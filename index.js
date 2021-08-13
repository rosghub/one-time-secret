const express = require('express');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', (req, res) => {
    const back = req.header.Referer || '/';
    res.send(`todo<br/><a href=${back}>back</a>`);
});

app.listen(port, '127.0.0.1');
console.log('listening at port: ' + port);