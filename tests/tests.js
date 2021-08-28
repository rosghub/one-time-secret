const { expect } = require('chai');
const chai = require('chai');
const app = require('./../app');
const constants = require('./../src/constants');
const { parse } = require('node-html-parser');

chai.use(require('chai-http'));
chai.should();

describe('Test site config', () => {
    it('Should properly render index', () => {
            chai.request(app).get('/')
            .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(200);

                const root = parse(res.text);
                expect(root.querySelector('title').text).to.be.equal('One Time Secret');

                const secretMaxLen = root.querySelector('textarea[name="secret"]').attrs.maxlength;
                expect(parseInt(secretMaxLen)).to.be.equal(constants.MAX_LEN);
            });
    })
})