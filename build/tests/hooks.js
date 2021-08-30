"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mochaHooks = void 0;
var app_1 = require("../src/app");
exports.mochaHooks = {
    beforeAll: function (done) {
        app_1.default.on('started', function () { done(); });
    }
};
//# sourceMappingURL=hooks.js.map