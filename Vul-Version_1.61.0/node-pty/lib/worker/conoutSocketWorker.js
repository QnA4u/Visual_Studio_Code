"use strict";
/**
 * Copyright (c) 2020, Microsoft Corporation (MIT License).
 */
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var net_1 = require("net");
var conout_1 = require("../shared/conout");
var conoutPipeName = worker_threads_1.workerData.conoutPipeName;
var conoutSocket = new net_1.Socket();
conoutSocket.setEncoding('utf8');
conoutSocket.connect(conoutPipeName, function () {
    var server = net_1.createServer(function (workerSocket) {
        conoutSocket.pipe(workerSocket);
    });
    server.listen(conout_1.getWorkerPipeName(conoutPipeName));
    worker_threads_1.parentPort.postMessage(1 /* READY */);
});//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/node-pty/lib/worker/conoutSocketWorker.js.map