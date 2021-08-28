const { expect } = require('chai');
const chai = require('chai');
const app = require('./../app');
const constants = require('./../src/constants');
const { parse } = require('node-html-parser');

chai.use(require('chai-http'));
chai.should();

before(done => {
    app.on('started', () => { done(); });
});

describe('Test site config', () => {
    it('Env vars sourced', () => {
        const { PORT } = process.env;
        PORT && expect(PORT).to.be.equal(constants.PORT);
    });

    it('Express is properly configured', () => {
        expect(constants.PORT).not.to.be.null;
        expect(app.get('view engine')).to.be.equal('ejs');
    });

    it('App is served properly', () => {
        chai.request(`http://localhost:${constants.PORT}`)
        .get('/')
        .end((err, res) => {
            expect(err).to.be.null;
            res.should.have.status(200);
        });
    });

    it('Index is properly rendered', () => {
        chai.request(app).get('/')
            .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(200);

                const root = parse(res.text);
                expect(root.querySelector('title').text).to.be.equal('One Time Secret');

                const secretMaxLen = root.querySelector('textarea[name="secret"]').attrs.maxlength;
                expect(parseInt(secretMaxLen)).to.be.equal(constants.MAX_LEN);
            });
    });
});