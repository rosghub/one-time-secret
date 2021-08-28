const { expect } = require('chai');
const chai = require('chai');
const app = require('./../app');
const constants = require('./../src/constants');
const { parse } = require('node-html-parser');
const { off } = require('./../app');

chai.use(require('chai-http'));
chai.should();

describe('Test link generation', () => {
    var link;

    it('Generates link successfully', (done) => {
        chai.request(app).post('/generate')
            .type('form')
            .send({
                secret: 'test',
                passphrase: null,
                ttl: null
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                // check link
                const root = parse(res.text)
                link = root.querySelector('#secret').text.trim();
                expect(link).to.be.a('string').and.match(/^https?:\/\/[^\/]+\/view\/\w+/);

                // check ttl
                const ttl = root.querySelector('#ttl').text.trim().split(' ')[0];
                expect(ttl).to.be.equal('7');
                done();
            });
    });

/*
    it('Generates link unsuccessfully', (done) => {

    })
*/
});