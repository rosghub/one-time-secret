import * as chai from 'chai';
import { expect } from 'chai';
import app from '../src/app';
import * as constants from '../src/constants';
import { parse } from 'node-html-parser';
import { Done } from 'mocha';
import * as request from 'superagent';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);


const appUrl = 'http://localhost:' + constants.PORT;

describe('Test site config', () => {

    it('Env vars sourced', () => {
        const { PORT } = process.env;
        PORT && expect(parseInt(PORT)).to.be.equal(constants.PORT);
    });

    it('Express is properly configured', () => {
        expect(constants.PORT).not.to.be.null;
        expect(app.get('view engine')).to.be.equal('ejs');
    });

    it('Index is properly rendered', (done: Done) => {
        chai.request(appUrl).get('/')
            .end((err, res: request.Response) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                const root = parse(res.text);
                expect(root.querySelector('title').text).to.be.equal('One Time Secret');

                const secretMaxLen = root.querySelector('textarea[name="secret"]').attrs.maxlength;
                expect(parseInt(secretMaxLen)).to.be.equal(constants.MAX_LEN);

                done();
            });
    });

    it('Unknown route renders error page', (done: Done) => {
        chai.request(appUrl)
            .get('/unknown')
            .end((err, res: request.Response) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);

                const root = parse(res.text);

                expect(root.querySelector('.subtitle').text.trim())
                    .to.be.a('string').and.match(/^Page not found/);

                done();
            });
    });
});