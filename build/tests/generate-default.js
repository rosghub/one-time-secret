"use strict";
var expect = require('chai').expect;
var chai = require('chai');
var constants = require('../src/constants');
var parse = require('node-html-parser').parse;
var url = require('url');
chai.use(require('chai-http'));
chai.should();
describe('Generates and consumes default-encrypted secret', function () {
    var link;
    it('Generates default-encrypted link successfully', function (done) {
        chai.request('http://localhost:' + constants.PORT).post('/generate')
            .type('form')
            .send({
            secret: 'test',
            passphrase: null,
            ttl: null
        })
            .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            var root = parse(res.text);
            // check ttl
            var ttl = root.querySelector('#ttl').text.trim().split(' ')[0];
            expect(ttl).to.be.equal('7');
            // check link
            link = url.parse(root.querySelector('#secret').text.trim());
            expect(link.href).to.be.a('string').and.match(/^https?:\/\/[^\/]+\/view\/\w+/);
            done();
        });
    });
    it('Views link without reveal', function (done) {
        chai.request(link.protocol + "//" + link.host)
            .get(link.pathname)
            .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            var root = parse(res.text);
            // Check spoiler reveal link
            var element = root.querySelector('#secret');
            expect(element, 'Secret element').to.not.be.null;
            expect(element.text.trim()).to.be.equal('Click to Reveal');
            done();
        });
    });
    it('Reveals default-decrypted secret', function (done) {
        chai.request(link.protocol + "//" + link.host)
            .get(link.pathname)
            .query({ reveal: true })
            .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            var root = parse(res.text);
            expect(root.querySelector('.subtitle').text.trim())
                .to.be.a('string').and.match(/^Your secret has been revealed/);
            expect(root.querySelector('#secret').text.trim())
                .to.be.a('string').and.not.empty;
            done();
        });
    });
});
//# sourceMappingURL=generate-default.js.map