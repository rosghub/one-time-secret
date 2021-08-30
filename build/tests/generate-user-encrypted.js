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
    it('Generates user-encrypted link with TTL successfully', function (done) {
        chai.request('http://localhost:' + constants.PORT).post('/generate')
            .type('form')
            .send({
            secret: 'test',
            passphrase: 'thisismypassword',
            ttl: '9'
        })
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            // check ttl
            var ttl = root.querySelector('#ttl').text.trim().split(' ')[0];
            (0, chai_1.expect)(ttl).to.be.equal('9');
            // check link
            link = url.parse(root.querySelector('#secret').text.trim());
            (0, chai_1.expect)(link.href).to.be.a('string').and.match(/^https?:\/\/[^\/]+\/view\/\w+/);
            done();
        });
    });
    it('Views user-encrypted link', function (done) {
        chai.request(link.protocol + "//" + link.host)
            .get(link.pathname)
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            // Check decrypt page rendered
            (0, chai_1.expect)(root.querySelector('.subtitle').text.trim())
                .to.be.a('string').and.match(/^This secret is encrypted with a user passphrase\./);
            // Check form properly rendered
            var form = root.querySelector('form');
            (0, chai_1.expect)(form).to.not.be.null;
            (0, chai_1.expect)(form.attrs.action).to.be.equal(link.pathname);
            (0, chai_1.expect)(form.attrs.method).to.be.equal('POST');
            done();
        });
    });
    it('Fails to decrypt user-encrypted link with wrong password', function (done) {
        chai.request(link.protocol + "//" + link.host)
            .post(link.pathname)
            .type('form')
            .send({
            passphrase: 'wrongpassword'
        })
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            // Check decrypt page rendered
            (0, chai_1.expect)(root.querySelector('.subtitle').text.trim())
                .to.be.a('string').and.match(/^This secret is encrypted with a user passphrase\./);
            // Check password rejected text
            var warning = root.querySelector('.has-text-danger');
            (0, chai_1.expect)(warning).to.not.be.null;
            (0, chai_1.expect)(warning.text.trim())
                .to.be.a('string').and.match(/^Cannot decrypt this secret with the provided passphrase\./);
            // Check form properly rendered
            var form = root.querySelector('form');
            (0, chai_1.expect)(form).to.not.be.null;
            (0, chai_1.expect)(form.attrs.action).to.be.equal(link.pathname);
            (0, chai_1.expect)(form.attrs.method).to.be.equal('POST');
            done();
        });
    });
    it('Successfully decrypts user-encrypted link', function (done) {
        chai.request(link.protocol + "//" + link.host)
            .post(link.pathname)
            .type('form')
            .send({
            passphrase: 'thisismypassword'
        })
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
            var root = (0, node_html_parser_1.parse)(res.text);
            // Check page subtitle
            (0, chai_1.expect)(root.querySelector('.subtitle').text.trim())
                .to.be.a('string').and.match(/^Your secret has been revealed/);
            // Check successful decryption message
            var m = root.querySelector('.has-text-success');
            (0, chai_1.expect)(m).to.not.be.null;
            (0, chai_1.expect)(m.text.trim())
                .to.be.a('string').and.match(/^Successfully decrypted with user passphrase\./);
            // Check secret
            (0, chai_1.expect)(root.querySelector('#secret').text.trim())
                .to.be.a('string').and.not.empty;
            done();
        });
    });
});
//# sourceMappingURL=generate-user-encrypted.js.map