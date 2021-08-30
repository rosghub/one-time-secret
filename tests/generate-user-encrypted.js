const { expect } = require('chai');
const chai = require('chai');
const constants = require('../src/constants');
const { parse } = require('node-html-parser');
const url = require('url');

chai.use(require('chai-http'));
chai.should();


describe('Generates and consumes default-encrypted secret', () => {
    var link;

    it('Generates user-encrypted link with TTL successfully', (done) => {
        chai.request('http://localhost:' + constants.PORT).post('/generate')
            .type('form')
            .send({
                secret: 'test',
                passphrase: 'thisismypassword',
                ttl: '9'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                const root = parse(res.text)

                // check ttl
                const ttl = root.querySelector('#ttl').text.trim().split(' ')[0];
                expect(ttl).to.be.equal('9');

                // check link
                link = url.parse(root.querySelector('#secret').text.trim());
                expect(link.href).to.be.a('string').and.match(/^https?:\/\/[^\/]+\/view\/\w+/);

                done();
            });
    });

    it('Views user-encrypted link', (done) => {
        chai.request(`${link.protocol}//${link.host}`)
            .get(link.pathname)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                const root = parse(res.text);

                // Check decrypt page rendered
                expect(root.querySelector('.subtitle').text.trim())
                    .to.be.a('string').and.match(/^This secret is encrypted with a user passphrase\./);

                // Check form properly rendered
                const form = root.querySelector('form');
                expect(form).to.not.be.null;
                expect(form.attrs.action).to.be.equal(link.pathname);
                expect(form.attrs.method).to.be.equal('POST');

                done();
            })
    });

    it('Fails to decrypt user-encrypted link with wrong password', (done) => {
        chai.request(`${link.protocol}//${link.host}`)
            .post(link.pathname)
            .type('form')
            .send({
                passphrase: 'wrongpassword'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                const root = parse(res.text);

                // Check decrypt page rendered
                expect(root.querySelector('.subtitle').text.trim())
                    .to.be.a('string').and.match(/^This secret is encrypted with a user passphrase\./);

                // Check password rejected text
                const warning = root.querySelector('.has-text-danger');
                expect(warning).to.not.be.null;
                expect(warning.text.trim())
                    .to.be.a('string').and.match(/^Cannot decrypt this secret with the provided passphrase\./);

                // Check form properly rendered
                const form = root.querySelector('form');
                expect(form).to.not.be.null;
                expect(form.attrs.action).to.be.equal(link.pathname);
                expect(form.attrs.method).to.be.equal('POST');

                done();
            })
    });

    it('Successfully decrypts user-encrypted link', (done) => {
        chai.request(`${link.protocol}//${link.host}`)
            .post(link.pathname)
            .type('form')
            .send({
                passphrase: 'thisismypassword'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                const root = parse(res.text);

                // Check page subtitle
                expect(root.querySelector('.subtitle').text.trim())
                    .to.be.a('string').and.match(/^Your secret has been revealed/);

                // Check successful decryption message
                const m = root.querySelector('.has-text-success');
                expect(m).to.not.be.null;
                expect(m.text.trim())
                    .to.be.a('string').and.match(/^Successfully decrypted with user passphrase\./);

                // Check secret
                expect(root.querySelector('#secret').text.trim())
                    .to.be.a('string').and.not.empty;

                done();
            })
    });
});