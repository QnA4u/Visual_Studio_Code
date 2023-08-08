"use strict";
/**
 * Copyright (c) 2019, Microsoft Corporation (MIT License).
 *
 * This module fetches the console process list for a particular PID. It must be
 * called from a different process (child_process.fork) as there can only be a
 * single console attached to a process.
 */
var getConsoleProcessList;
try {
    getConsoleProcessList = require('../build/Release/conpty_console_list.node').getConsoleProcessList;
}
catch (err) {
    getConsoleProcessList = require('../build/Debug/conpty_console_list.node').getConsoleProcessList;
}
var shellPid = parseInt(process.argv[2], 10);
var consoleProcessList = getConsoleProcessList(shellPid);
process.send({ consoleProcessList: consoleProcessList });
process.exit(0);//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe719cd3e5825bf14e14182fddeb88ee8daf044f/node_modules/node-pty/lib/conpty_console_list_agent.js.map