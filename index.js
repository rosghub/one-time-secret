const { render } = require('ejs');
const express = require('express');
const path = require('path');
require('dotenv').config();
const { connectMongo } = require('./db');
const generate = require('./generate');
const viewSecret = require('./viewsecret');

const port = process.env.PORT;


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.post('/generate', generate);
app.get('/view/:id', viewSecret);

/*
app.get('/test', (req, res) => {
    res.render('generate', { link: 'link goes here' });
})
*/

connectMongo().then(success => {
    if (success) {
        app.listen(port, '127.0.0.1');
        console.log('listening at port: ' + port);
    }
    else
        console.log('DB connection failed, aborted.');
});
