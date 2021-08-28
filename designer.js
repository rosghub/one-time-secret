const express = require('express');
const constants = require('./src/constants');
const app = express();

const { PORT } = constants;

app.set('view engine', 'ejs')
    .get('/', (req, res) => {
        res.render('index', { maxLen: constants.MAX_LEN });
    })
    .get('/generate', (req, res) => {
        res.render('generate', { link: 'link' });
    })
    .get('/spoiler', (req, res) => {
        res.render('spoiler');
    })
    .get('/view', (req, res) => {
        res.render('secret', { secret: 'true', decrypted: false });
    })
    .get('/decrypt', (req, res) => {
        res.render('decrypt', { link: '/view/1234', wrongPass: true });
    })
    .use((req, res) => {
        res.render('error');
    });

app.listen(PORT, '127.0.0.1', () => {
    console.log('EJS Template designer mounted at http://localhost:' + PORT);
});