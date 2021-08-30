const app = require('../src/app');

module.exports.mochaHooks = {
    beforeAll: (done) => {
        app.on('started', () => { done(); });
    }
};
