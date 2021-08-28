const { expect } = require('chai');
const chai = require('chai');
const app = require('./../app');
const constants = require('./../src/constants');
const { parse } = require('node-html-parser');

chai.use(require('chai-http'));
chai.should();

describe('Test link generation', () => {
    it('Generates link successfully', () => {
        chai.request(app).post('/generate')
            .type('form')
            .send({
                secret: 'test',
                passphrase: null,
                ttl: null
            })
            .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(200);

                const root = parse(res.text)
                const link = root.querySelector('#secret').text;
                console.log('Link: ' + link);
                expect(link).to.be.a('string').and.match(/^http/);
            });
    });
});