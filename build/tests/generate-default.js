"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var chai_1 = require("chai");
var constants = require("../src/constants");
var node_html_parser_1 = require("node-html-parser");
var url = require("url");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
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
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            // check ttl
            var ttl = root.querySelector('#ttl').text.trim().split(' ')[0];
            (0, chai_1.expect)(ttl).to.be.equal('7');
            // check link
            link = url.parse(root.querySelector('#secret').text.trim());
            (0, chai_1.expect)(link.href).to.be.a('string').and.match(/^https?:\/\/[^\/]+\/view\/\w+/);
            done();
        });
    });
    it('Views link without reveal', function (done) {
        chai.request(link.protocol + "//" + link.host)
            .get(link.pathname)
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            // Check spoiler reveal link
            var element = root.querySelector('#secret');
            (0, chai_1.expect)(element, 'Secret element').to.not.be.null;
            (0, chai_1.expect)(element.text.trim()).to.be.equal('Click to Reveal');
            done();
        });
    });
    it('Reveals default-decrypted secret', function (done) {
        chai.request(link.protocol + "//" + link.host)
            .get(link.pathname)
            .query({ reveal: true })
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            (0, chai_1.expect)(root.querySelector('.subtitle').text.trim())
                .to.be.a('string').and.match(/^Your secret has been revealed/);
            (0, chai_1.expect)(root.querySelector('#secret').text.trim())
                .to.be.a('string').and.not.empty;
            done();
        });
    });
});
//# sourceMappingURL=generate-default.js.map