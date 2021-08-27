/*
    Render EJS templates with mock data for page design
 */

const { Router } = require('express');

module.exports = Router()
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