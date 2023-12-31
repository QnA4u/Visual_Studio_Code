"use strict";
var fs = require("fs");
var os = require("os");
var path = require("path");
var zlib = require("zlib");
var child_process = require("child_process");
var Logging = require("./Logging");
var AutoCollectHttpDependencies = require("../AutoCollection/HttpDependencies");
var Util = require("./Util");
var Sender = (function () {
    function Sender(config, onSuccess, onError) {
        this._config = config;
        this._onSuccess = onSuccess;
        this._onError = onError;
        this._enableDiskRetryMode = false;
        this._resendInterval = Sender.WAIT_BETWEEN_RESEND;
        this._maxBytesOnDisk = Sender.MAX_BYTES_ON_DISK;
        this._numConsecutiveFailures = 0;
        if (!Sender.OS_PROVIDES_FILE_PROTECTION) {
            // Node's chmod levels do not appropriately restrict file access on Windows
            // Use the built-in command line tool ICACLS on Windows to properly restrict
            // access to the temporary directory used for disk retry mode.
            if (Sender.USE_ICACLS) {
                // This should be async - but it's currently safer to have this synchronous
                // This guarantees we can immediately fail setDiskRetryMode if we need to
                try {
                    Sender.OS_PROVIDES_FILE_PROTECTION = fs.existsSync(Sender.ICACLS_PATH);
                }
                catch (e) { }
                if (!Sender.OS_PROVIDES_FILE_PROTECTION) {
                    Logging.warn(Sender.TAG, "Could not find ICACLS in expected location! This is necessary to use disk retry mode on Windows.");
                }
            }
            else {
                // chmod works everywhere else
                Sender.OS_PROVIDES_FILE_PROTECTION = true;
            }
        }
    }
    /**
    * Enable or disable offline mode
    */
    Sender.prototype.setDiskRetryMode = function (value, resendInterval, maxBytesOnDisk) {
        this._enableDiskRetryMode = Sender.OS_PROVIDES_FILE_PROTECTION && value;
        if (typeof resendInterval === 'number' && resendInterval >= 0) {
            this._resendInterval = Math.floor(resendInterval);
        }
        if (typeof maxBytesOnDisk === 'number' && maxBytesOnDisk >= 0) {
            this._maxBytesOnDisk = Math.floor(maxBytesOnDisk);
        }
        if (value && !Sender.OS_PROVIDES_FILE_PROTECTION) {
            this._enableDiskRetryMode = false;
            Logging.warn(Sender.TAG, "Ignoring request to enable disk retry mode. Sufficient file protection capabilities were not detected.");
        }
    };
    Sender.prototype.send = function (payload, callback) {
        var _this = this;
        var endpointUrl = this._config.endpointUrl;
        // todo: investigate specifying an agent here: https://nodejs.org/api/http.html#http_class_http_agent
        var options = {
            method: "POST",
            withCredentials: false,
            headers: {
                "Content-Type": "application/x-json-stream"
            }
        };
        zlib.gzip(payload, function (err, buffer) {
            var dataToSend = buffer;
            if (err) {
                Logging.warn(err);
                dataToSend = payload; // something went wrong so send without gzip
                options.headers["Content-Length"] = payload.length.toString();
            }
            else {
                options.headers["Content-Encoding"] = "gzip";
                options.headers["Content-Length"] = buffer.length;
            }
            Logging.info(Sender.TAG, options);
            // Ensure this request is not captured by auto-collection.
            options[AutoCollectHttpDependencies.disableCollectionRequestOption] = true;
            var requestCallback = function (res) {
                res.setEncoding("utf-8");
                //returns empty if the data is accepted
                var responseString = "";
                res.on("data", function (data) {
                    responseString += data;
                });
                res.on("end", function () {
                    _this._numConsecutiveFailures = 0;
                    Logging.info(Sender.TAG, responseString);
                    if (typeof _this._onSuccess === "function") {
                        _this._onSuccess(responseString);
                    }
                    if (typeof callback === "function") {
                        callback(responseString);
                    }
                    if (_this._enableDiskRetryMode) {
                        // try to send any cached events if the user is back online
                        if (res.statusCode === 200) {
                            setTimeout(function () { return _this._sendFirstFileOnDisk(); }, _this._resendInterval);
                            // store to disk in case of burst throttling
                        }
                        else if (res.statusCode === 408 ||
                            res.statusCode === 429 ||
                            res.statusCode === 439 ||
                            res.statusCode === 500 ||
                            res.statusCode === 503) {
                            // TODO: Do not support partial success (206) until _sendFirstFileOnDisk checks payload age
                            _this._storeToDisk(payload);
                        }
                    }
                });
            };
            var req = Util.makeRequest(_this._config, endpointUrl, options, requestCallback);
            req.on("error", function (error) {
                // todo: handle error codes better (group to recoverable/non-recoverable and persist)
                _this._numConsecutiveFailures++;
                // Only use warn level if retries are disabled or we've had some number of consecutive failures sending data
                // This is because warn level is printed in the console by default, and we don't want to be noisy for transient and self-recovering errors
                // Continue informing on each failure if verbose logging is being used
                if (!_this._enableDiskRetryMode || _this._numConsecutiveFailures > 0 && _this._numConsecutiveFailures % Sender.MAX_CONNECTION_FAILURES_BEFORE_WARN === 0) {
                    var notice = "Ingestion endpoint could not be reached. This batch of telemetry items has been lost. Use Disk Retry Caching to enable resending of failed telemetry. Error:";
                    if (_this._enableDiskRetryMode) {
                        notice = "Ingestion endpoint could not be reached " + _this._numConsecutiveFailures + " consecutive times. There may be resulting telemetry loss. Most recent error:";
                    }
                    Logging.warn(Sender.TAG, notice, error);
                }
                else {
                    var notice = "Transient failure to reach ingestion endpoint. This batch of telemetry items will be retried. Error:";
                    Logging.info(Sender.TAG, notice, error);
                }
                _this._onErrorHelper(error);
                if (typeof callback === "function") {
                    var errorMessage = "error sending telemetry";
                    if (error && (typeof error.toString === "function")) {
                        errorMessage = error.toString();
                    }
                    callback(errorMessage);
                }
                if (_this._enableDiskRetryMode) {
                    _this._storeToDisk(payload);
                }
            });
            req.write(dataToSend);
            req.end();
        });
    };
    Sender.prototype.saveOnCrash = function (payload) {
        if (this._enableDiskRetryMode) {
            this._storeToDiskSync(payload);
        }
    };
    Sender.prototype._runICACLS = function (args, callback) {
        var aclProc = child_process.spawn(Sender.ICACLS_PATH, args, { windowsHide: true });
        aclProc.on("error", function (e) { return callback(e); });
        aclProc.on("close", function (code, signal) {
            return callback(code === 0 ? null : new Error("Setting ACL restrictions did not succeed (ICACLS returned code " + code + ")"));
        });
    };
    Sender.prototype._runICACLSSync = function (args) {
        // Some very old versions of Node (< 0.11) don't have this
        if (child_process.spawnSync) {
            var aclProc = child_process.spawnSync(Sender.ICACLS_PATH, args, { windowsHide: true });
            if (aclProc.error) {
                throw aclProc.error;
            }
            else if (aclProc.status !== 0) {
                throw new Error("Setting ACL restrictions did not succeed (ICACLS returned code " + aclProc.status + ")");
            }
        }
        else {
            throw new Error("Could not synchronously call ICACLS under current version of Node.js");
        }
    };
    Sender.prototype._getACLIdentity = function (callback) {
        if (Sender.ACL_IDENTITY) {
            return callback(null, Sender.ACL_IDENTITY);
        }
        var psProc = child_process.spawn(Sender.POWERSHELL_PATH, ["-Command", "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name"], {
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe'] // Needed to prevent hanging on Win 7
        });
        var data = "";
        psProc.stdout.on("data", function (d) { return data += d; });
        psProc.on("error", function (e) { return callback(e, null); });
        psProc.on("close", function (code, signal) {
            Sender.ACL_IDENTITY = data && data.trim();
            return callback(code === 0 ? null : new Error("Getting ACL identity did not succeed (PS returned code " + code + ")"), Sender.ACL_IDENTITY);
        });
    };
    Sender.prototype._getACLIdentitySync = function () {
        if (Sender.ACL_IDENTITY) {
            return Sender.ACL_IDENTITY;
        }
        // Some very old versions of Node (< 0.11) don't have this
        if (child_process.spawnSync) {
            var psProc = child_process.spawnSync(Sender.POWERSHELL_PATH, ["-Command", "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name"], {
                windowsHide: true,
                stdio: ['ignore', 'pipe', 'pipe'] // Needed to prevent hanging on Win 7
            });
            if (psProc.error) {
                throw psProc.error;
            }
            else if (psProc.status !== 0) {
                throw new Error("Getting ACL identity did not succeed (PS returned code " + psProc.status + ")");
            }
            Sender.ACL_IDENTITY = psProc.stdout && psProc.stdout.toString().trim();
            return Sender.ACL_IDENTITY;
        }
        else {
            throw new Error("Could not synchronously get ACL identity under current version of Node.js");
        }
    };
    Sender.prototype._getACLArguments = function (directory, identity) {
        return [directory,
            "/grant", "*S-1-5-32-544:(OI)(CI)F",
            "/grant", identity + ":(OI)(CI)F",
            "/inheritance:r"]; // Remove all inherited permissions
    };
    Sender.prototype._applyACLRules = function (directory, callback) {
        var _this = this;
        if (!Sender.USE_ICACLS) {
            return callback(null);
        }
        // For performance, only run ACL rules if we haven't already during this session
        if (Sender.ACLED_DIRECTORIES[directory] === undefined) {
            // Avoid multiple calls race condition by setting ACLED_DIRECTORIES to false for this directory immediately
            // If batches are being failed faster than the processes spawned below return, some data won't be stored to disk
            // This is better than the alternative of potentially infinitely spawned processes
            Sender.ACLED_DIRECTORIES[directory] = false;
            // Restrict this directory to only current user and administrator access
            this._getACLIdentity(function (err, identity) {
                if (err) {
                    Sender.ACLED_DIRECTORIES[directory] = false; // false is used to cache failed (vs undefined which is "not yet tried")
                    return callback(err);
                }
                else {
                    _this._runICACLS(_this._getACLArguments(directory, identity), function (err) {
                        Sender.ACLED_DIRECTORIES[directory] = !err;
                        return callback(err);
                    });
                }
            });
        }
        else {
            return callback(Sender.ACLED_DIRECTORIES[directory] ? null :
                new Error("Setting ACL restrictions did not succeed (cached result)"));
        }
    };
    Sender.prototype._applyACLRulesSync = function (directory) {
        if (Sender.USE_ICACLS) {
            // For performance, only run ACL rules if we haven't already during this session
            if (Sender.ACLED_DIRECTORIES[directory] === undefined) {
                this._runICACLSSync(this._getACLArguments(directory, this._getACLIdentitySync()));
                Sender.ACLED_DIRECTORIES[directory] = true; // If we get here, it succeeded. _runIACLSSync will throw on failures
                return;
            }
            else if (!Sender.ACLED_DIRECTORIES[directory]) {
                throw new Error("Setting ACL restrictions did not succeed (cached result)");
            }
        }
    };
    Sender.prototype._confirmDirExists = function (directory, callback) {
        var _this = this;
        fs.lstat(directory, function (err, stats) {
            if (err && err.code === 'ENOENT') {
                fs.mkdir(directory, function (err) {
                    if (err && err.code !== 'EEXIST') {
                        callback(err);
                    }
                    else {
                        _this._applyACLRules(directory, callback);
                    }
                });
            }
            else if (!err && stats.isDirectory()) {
                _this._applyACLRules(directory, callback);
            }
            else {
                callback(err || new Error("Path existed but was not a directory"));
            }
        });
    };
    /**
     * Computes the size (in bytes) of all files in a directory at the root level. Asynchronously.
     */
    Sender.prototype._getShallowDirectorySize = function (directory, callback) {
        // Get the directory listing
        fs.readdir(directory, function (err, files) {
            if (err) {
                return callback(err, -1);
            }
            var error = null;
            var totalSize = 0;
            var count = 0;
            if (files.length === 0) {
                callback(null, 0);
                return;
            }
            // Query all file sizes
            for (var i = 0; i < files.length; i++) {
                fs.stat(path.join(directory, files[i]), function (err, fileStats) {
                    count++;
                    if (err) {
                        error = err;
                    }
                    else {
                        if (fileStats.isFile()) {
                            totalSize += fileStats.size;
                        }
                    }
                    if (count === files.length) {
                        // Did we get an error?
                        if (error) {
                            callback(error, -1);
                        }
                        else {
                            callback(error, totalSize);
                        }
                    }
                });
            }
        });
    };
    /**
     * Computes the size (in bytes) of all files in a directory at the root level. Synchronously.
     */
    Sender.prototype._getShallowDirectorySizeSync = function (directory) {
        var files = fs.readdirSync(directory);
        var totalSize = 0;
        for (var i = 0; i < files.length; i++) {
            totalSize += fs.statSync(path.join(directory, files[i])).size;
        }
        return totalSize;
    };
    /**
     * Stores the payload as a json file on disk in the temp directory
     */
    Sender.prototype._storeToDisk = function (payload) {
        var _this = this;
        // tmpdir is /tmp for *nix and USERDIR/AppData/Local/Temp for Windows
        var directory = path.join(os.tmpdir(), Sender.TEMPDIR_PREFIX + this._config.instrumentationKey);
        // This will create the dir if it does not exist
        // Default permissions on *nix are directory listing from other users but no file creations
        Logging.info(Sender.TAG, "Checking existance of data storage directory: " + directory);
        this._confirmDirExists(directory, function (error) {
            if (error) {
                Logging.warn(Sender.TAG, "Error while checking/creating directory: " + (error && error.message));
                _this._onErrorHelper(error);
                return;
            }
            _this._getShallowDirectorySize(directory, function (err, size) {
                if (err || size < 0) {
                    Logging.warn(Sender.TAG, "Error while checking directory size: " + (err && err.message));
                    _this._onErrorHelper(err);
                    return;
                }
                else if (size > _this._maxBytesOnDisk) {
                    Logging.warn(Sender.TAG, "Not saving data due to max size limit being met. Directory size in bytes is: " + size);
                    return;
                }
                //create file - file name for now is the timestamp, a better approach would be a UUID but that
                //would require an external dependency
                var fileName = new Date().getTime() + ".ai.json";
                var fileFullPath = path.join(directory, fileName);
                // Mode 600 is w/r for creator and no read access for others (only applies on *nix)
                // For Windows, ACL rules are applied to the entire directory (see logic in _confirmDirExists and _applyACLRules)
                Logging.info(Sender.TAG, "saving data to disk at: " + fileFullPath);
                fs.writeFile(fileFullPath, payload, { mode: 384 }, function (error) { return _this._onErrorHelper(error); });
            });
        });
    };
    /**
     * Stores the payload as a json file on disk using sync file operations
     * this is used when storing data before crashes
     */
    Sender.prototype._storeToDiskSync = function (payload) {
        // tmpdir is /tmp for *nix and USERDIR/AppData/Local/Temp for Windows
        var directory = path.join(os.tmpdir(), Sender.TEMPDIR_PREFIX + this._config.instrumentationKey);
        try {
            Logging.info(Sender.TAG, "Checking existance of data storage directory: " + directory);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
            }
            // Make sure permissions are valid
            this._applyACLRulesSync(directory);
            var dirSize = this._getShallowDirectorySizeSync(directory);
            if (dirSize > this._maxBytesOnDisk) {
                Logging.info(Sender.TAG, "Not saving data due to max size limit being met. Directory size in bytes is: " + dirSize);
                return;
            }
            //create file - file name for now is the timestamp, a better approach would be a UUID but that
            //would require an external dependency
            var fileName = new Date().getTime() + ".ai.json";
            var fileFullPath = path.join(directory, fileName);
            // Mode 600 is w/r for creator and no access for anyone else (only applies on *nix)
            Logging.info(Sender.TAG, "saving data before crash to disk at: " + fileFullPath);
            fs.writeFileSync(fileFullPath, payload, { mode: 384 });
        }
        catch (error) {
            Logging.warn(Sender.TAG, "Error while saving data to disk: " + (error && error.message));
            this._onErrorHelper(error);
        }
    };
    /**
     * Check for temp telemetry files
     * reads the first file if exist, deletes it and tries to send its load
     */
    Sender.prototype._sendFirstFileOnDisk = function () {
        var _this = this;
        var tempDir = path.join(os.tmpdir(), Sender.TEMPDIR_PREFIX + this._config.instrumentationKey);
        fs.exists(tempDir, function (exists) {
            if (exists) {
                fs.readdir(tempDir, function (error, files) {
                    if (!error) {
                        files = files.filter(function (f) { return path.basename(f).indexOf(".ai.json") > -1; });
                        if (files.length > 0) {
                            var firstFile = files[0];
                            var filePath = path.join(tempDir, firstFile);
                            fs.readFile(filePath, function (error, payload) {
                                if (!error) {
                                    // delete the file first to prevent double sending
                                    fs.unlink(filePath, function (error) {
                                        if (!error) {
                                            _this.send(payload);
                                        }
                                        else {
                                            _this._onErrorHelper(error);
                                        }
                                    });
                                }
                                else {
                                    _this._onErrorHelper(error);
                                }
                            });
                        }
                    }
                    else {
                        _this._onErrorHelper(error);
                    }
                });
            }
        });
    };
    Sender.prototype._onErrorHelper = function (error) {
        if (typeof this._onError === "function") {
            this._onError(error);
        }
    };
    Sender.TAG = "Sender";
    Sender.ICACLS_PATH = process.env.systemdrive + "/windows/system32/icacls.exe";
    Sender.POWERSHELL_PATH = process.env.systemdrive + "/windows/system32/windowspowershell/v1.0/powershell.exe";
    Sender.ACLED_DIRECTORIES = {};
    Sender.ACL_IDENTITY = null;
    // the amount of time the SDK will wait between resending cached data, this buffer is to avoid any throtelling from the service side
    Sender.WAIT_BETWEEN_RESEND = 60 * 1000;
    Sender.MAX_BYTES_ON_DISK = 50 * 1000 * 1000;
    Sender.MAX_CONNECTION_FAILURES_BEFORE_WARN = 5;
    Sender.TEMPDIR_PREFIX = "appInsights-node";
    Sender.OS_PROVIDES_FILE_PROTECTION = false;
    Sender.USE_ICACLS = os.type() === "Windows_NT";
    return Sender;
}());
module.exports = Sender;//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/applicationinsights/out/Library/Sender.js.map