"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var constants = require("./constants");
var favicon = require("serve-favicon");
var path = require("path");
var app = express();
var PORT = constants.PORT;
app.use(favicon('static/favicon.ico'));
app.use('/css', express.static(path.join(__dirname, '../..', 'static/css')));
app.set('view engine', 'ejs')
    .get('/', function (req, res) {
    res.render('index', { maxLen: constants.MAX_LEN });
})
    .get('/generate', function (req, res) {
    res.render('generate', {
        link: 'http://localhost:3000/view/12394732984723942349823',
        ttl: 4,
        expirationDate: new Date().getTime(),
        secret: 'this is a secret oaiwjef oiwa jfowa jfowai foewathis is a secret oaiwjef oiwa jfowa jfowai foewathis is a secret oaiwjef oiwa jfowa jfowai foewa'
        //secret: 'test'
    });
})
    .get('/spoiler', function (req, res) {
    res.render('spoiler');
})
    .get('/view', function (req, res) {
    res.render('secret', { secret: 'true', decrypted: true });
})
    .get('/decrypt', function (req, res) {
    res.render('decrypt', { link: '/view/1234', wrongPass: false });
})
    .use(function (req, res) {
    res.render('error');
});
app.listen(PORT, '127.0.0.1', function () {
    console.log('EJS Template designer mounted at http://localhost:' + PORT);
});
//# sourceMappingURL=designer.js.map