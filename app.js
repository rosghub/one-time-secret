const express = require('express');
const path = require('path');
require('dotenv').config();
const { connectMongo } = require('./src/utils/db');
const generate = require('./src/generate');
const viewSecret = require('./src/viewsecret');

const port = process.env.PORT;


const app = express();
app.set('trust proxy', '127.0.0.1');
//app.use(require('./scripts/design')());

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));
app.post('/generate', generate);
app.all('/view/:id', viewSecret);

connectMongo().then(success => {
    if (success) {
        app.listen(port, '127.0.0.1');
        console.log('listening at port: ' + port);
    }
    else
        console.log('DB connection failed, aborted.');
});
