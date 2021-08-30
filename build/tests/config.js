"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var chai_1 = require("chai");
var app_1 = require("../src/app");
var constants = require("../src/constants");
var node_html_parser_1 = require("node-html-parser");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
var appUrl = 'http://localhost:' + constants.PORT;
describe('Test site config', function () {
    it('Env vars sourced', function () {
        var PORT = process.env.PORT;
        PORT && (0, chai_1.expect)(parseInt(PORT)).to.be.equal(constants.PORT);
    });
    it('Express is properly configured', function () {
        (0, chai_1.expect)(constants.PORT).not.to.be.null;
        (0, chai_1.expect)(app_1.default.get('view engine')).to.be.equal('ejs');
    });
    it('Index is properly rendered', function (done) {
        chai.request(appUrl).get('/')
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            (0, chai_1.expect)(root.querySelector('title').text).to.be.equal('One Time Secret');
            var secretMaxLen = root.querySelector('textarea[name="secret"]').attrs.maxlength;
            (0, chai_1.expect)(parseInt(secretMaxLen)).to.be.equal(constants.MAX_LEN);
            done();
        });
    });
    it('Unknown route renders error page', function (done) {
        chai.request(appUrl)
            .get('/unknown')
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(404);
            var root = (0, node_html_parser_1.parse)(res.text);
            (0, chai_1.expect)(root.querySelector('.subtitle').text.trim())
                .to.be.a('string').and.match(/^Page not found/);
            done();
        });
    });
});
//# sourceMappingURL=config.js.map