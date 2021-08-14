const express = require('express');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT;

const generate = require('./generate');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.post('/generate', generate);
/*
app.post('/generate', (req, res) => {
    const back = req.header.Referer || '/';
    res.send(`todo<br/><a href=${back}>back</a>`);
});
*/

app.listen(port, '127.0.0.1');
console.log('listening at port: ' + port);