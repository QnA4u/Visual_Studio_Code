/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


import { isFunction, getDocument } from '@microsoft/applicationinsights-core-js';
export function createDomEvent(eventName) {
    var event = null;
    if (isFunction(Event)) {
        event = new Event(eventName);
    }
    else {
        var doc = getDocument();
        if (doc && doc.createEvent) {
            event = doc.createEvent("Event");
            event.initEvent(eventName, true, true);
        }
    }
    return event;
}