/*
 * Application Insights JavaScript SDK - Common, 2.6.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */


/**
 * Exception details of the exception in a chain.
 */
var ExceptionDetails = /** @class */ (function () {
    function ExceptionDetails() {
        /**
         * Indicates if full exception stack is provided in the exception. The stack may be trimmed, such as in the case of a StackOverflow exception.
         */
        this.hasFullStack = true;
        /**
         * List of stack frames. Either stack or parsedStack should have a value.
         */
        this.parsedStack = [];
    }
    return ExceptionDetails;
}());
export { ExceptionDetails };//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ee8c7def80afc00dd6e593ef12f37756d8f504ea/node_modules/@microsoft/applicationinsights-common/dist-esm/Interfaces/Contracts/Generated/ExceptionDetails.js.map