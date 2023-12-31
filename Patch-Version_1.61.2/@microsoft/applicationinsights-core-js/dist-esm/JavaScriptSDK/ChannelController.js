/*
 * Application Insights JavaScript SDK - Core, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


"use strict";
import { __extendsFn } from "@microsoft/applicationinsights-shims";
import dynamicProto from '@microsoft/dynamicproto-js';
import { BaseTelemetryPlugin } from './BaseTelemetryPlugin';
import { ProcessTelemetryContext } from './ProcessTelemetryContext';
import { initializePlugins } from './TelemetryHelpers';
import { arrForEach, objDefineAccessors, throwError } from "./HelperFuncs";
var ChannelControllerPriority = 500;
var ChannelValidationMessage = "Channel has invalid priority";
var ChannelController = /** @class */ (function (_super) {
    __extendsFn(ChannelController, _super);
    function ChannelController() {
        var _this = _super.call(this) || this;
        _this.identifier = "ChannelControllerPlugin";
        _this.priority = ChannelControllerPriority; // in reserved range 100 to 200
        var _channelQueue;
        dynamicProto(ChannelController, _this, function (_self, _base) {
            _self.setNextPlugin = function (next) {
                // The Channel controller is last in pipeline
            };
            _self.processTelemetry = function (item, itemCtx) {
                if (_channelQueue) {
                    arrForEach(_channelQueue, function (queues) {
                        // pass on to first item in queue
                        if (queues.length > 0) {
                            // Copying the item context as we could have mutiple chains that are executing asynchronously
                            // and calling _getDefTelCtx as it's possible that the caller doesn't pass any context
                            var chainCtx = _this._getTelCtx(itemCtx).createNew(queues);
                            chainCtx.processNext(item);
                        }
                    });
                }
            };
            _self.getChannelControls = function () {
                return _channelQueue;
            };
            _self.initialize = function (config, core, extensions) {
                if (_self.isInitialized()) {
                    // already initialized
                    return;
                }
                _base.initialize(config, core, extensions);
                _createChannelQueues((config || {}).channels, extensions);
                // Initialize the Queues
                arrForEach(_channelQueue, function (queue) { return initializePlugins(new ProcessTelemetryContext(queue, config, core), extensions); });
            };
        });
        function _checkQueuePriority(queue) {
            arrForEach(queue, function (queueItem) {
                if (queueItem.priority < ChannelControllerPriority) {
                    throwError(ChannelValidationMessage + queueItem.identifier);
                }
            });
        }
        function _addChannelQueue(queue) {
            if (queue && queue.length > 0) {
                queue = queue.sort(function (a, b) {
                    return a.priority - b.priority;
                });
                _checkQueuePriority(queue);
                _channelQueue.push(queue);
            }
        }
        function _createChannelQueues(channels, extensions) {
            _channelQueue = [];
            if (channels) {
                // Add and sort the configuration channel queues
                arrForEach(channels, function (queue) { return _addChannelQueue(queue); });
            }
            if (extensions) {
                // Create a new channel queue for any extensions with a priority > the ChannelControllerPriority
                var extensionQueue_1 = [];
                arrForEach(extensions, function (plugin) {
                    if (plugin.priority > ChannelControllerPriority) {
                        extensionQueue_1.push(plugin);
                    }
                });
                _addChannelQueue(extensionQueue_1);
            }
        }
        return _this;
    }
// Removed Stub for ChannelController.prototype.processTelemetry.
    ;
// Removed Stub for ChannelController.prototype.getChannelControls.
// Removed Stub for ChannelController.prototype.initialize.
    /**
     * Static constructor, attempt to create accessors
     */
    // tslint:disable-next-line
    ChannelController._staticInit = (function () {
        var proto = ChannelController.prototype;
        // Dynamically create get/set property accessors
        objDefineAccessors(proto, "ChannelControls", proto.getChannelControls);
        objDefineAccessors(proto, "channelQueue", proto.getChannelControls);
    })();
    return ChannelController;
}(BaseTelemetryPlugin));
export { ChannelController };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/@microsoft/applicationinsights-core-js/dist-esm/JavaScriptSDK/ChannelController.js.map