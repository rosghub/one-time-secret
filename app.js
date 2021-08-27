const express = require('express');
require('dotenv').config();
const { connectDB } = require('./src/db/db');
const generate = require('./src/generate');
const view = require('./src/view');
const constants = require('./src/constants');

const app = express();
app.set('trust proxy', '127.0.0.1');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
//app.use(require('./dev/design'));

app.get('/', (_req, res) => {
    res.render('index', { maxLen: constants.MAX_LEN })
});
app.post('/generate', generate);
app.use('/view', view);

app.use((_req, res) => {
    res.render('error');
});

connectDB().then(({ success }) => {
    if (success) {
        app.listen(constants.PORT, '127.0.0.1');
        console.log('listening at port: ' + constants.PORT);
    }
    else
        console.log('DB connection failed, aborted.');
});
