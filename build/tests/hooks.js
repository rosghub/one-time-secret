"use strict";
var app = require('../src/app');
module.exports.mochaHooks = {
    beforeAll: function (done) {
        app.on('started', function () { done(); });
    }
};
//# sourceMappingURL=hooks.js.map