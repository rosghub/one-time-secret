"use strict";
var expect = require('chai').expect;
var chai = require('chai');
var app = require('../src/app');
var constants = require('../src/constants');
var parse = require('node-html-parser').parse;
chai.use(require('chai-http'));
chai.should();
var appUrl = 'http://localhost:' + constants.PORT;
describe('Test site config', function () {
    it('Env vars sourced', function () {
        var PORT = process.env.PORT;
        PORT && expect(parseInt(PORT)).to.be.equal(constants.PORT);
    });
    it('Express is properly configured', function () {
        expect(constants.PORT).not.to.be.null;
        expect(app.get('view engine')).to.be.equal('ejs');
    });
    it('Index is properly rendered', function (done) {
        chai.request(appUrl).get('/')
            .end(function (err, res) {
            expect(err).to.be.null;
            res.should.have.status(200);
            var root = parse(res.text);
            expect(root.querySelector('title').text).to.be.equal('One Time Secret');
            var secretMaxLen = root.querySelector('textarea[name="secret"]').attrs.maxlength;
            expect(parseInt(secretMaxLen)).to.be.equal(constants.MAX_LEN);
            done();
        });
    });
    it('Unknown route renders error page', function (done) {
        chai.request(appUrl)
            .get('/unknown')
            .end(function (err, res) {
            expect(err).to.be.null;
            res.should.have.status(404);
            var root = parse(res.text);
            expect(root.querySelector('.subtitle').text.trim())
                .to.be.a('string').and.match(/^Page not found/);
            done();
        });
    });
});
//# sourceMappingURL=config.js.map