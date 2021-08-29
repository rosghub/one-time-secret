const app = require('../build/app');

module.exports.mochaHooks = {
    beforeAll: (done) => {
        app.on('started', () => { done(); });
    }
};
