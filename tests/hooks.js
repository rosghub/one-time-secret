const app = require('./../app');

module.exports.mochaHooks = {
    beforeAll: (done) => {
        app.on('started', () => { done(); });
    }
};
