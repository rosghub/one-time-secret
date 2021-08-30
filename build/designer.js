"use strict";
var express = require('express');
var constants = require('./src/constants');
var app = express();
var PORT = constants.PORT;
app.set('view engine', 'ejs')
    .get('/', function (req, res) {
    res.render('index', { maxLen: constants.MAX_LEN });
})
    .get('/generate', function (req, res) {
    res.render('generate', { link: 'link' });
})
    .get('/spoiler', function (req, res) {
    res.render('spoiler');
})
    .get('/view', function (req, res) {
    res.render('secret', { secret: 'true', decrypted: false });
})
    .get('/decrypt', function (req, res) {
    res.render('decrypt', { link: '/view/1234', wrongPass: true });
})
    .use(function (req, res) {
    res.render('error');
});
app.listen(PORT, '127.0.0.1', function () {
    console.log('EJS Template designer mounted at http://localhost:' + PORT);
});
//# sourceMappingURL=designer.js.map