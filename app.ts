require('dotenv').config();
import constants from './src/constants';
const { connectDB } = require('./src/db/db');
import { Request, Response } from "express";
import express = require('express');
import generate = require('./src/generate');
import view = require('./src/view');

const app = express();
app.set('trust proxy', '127.0.0.1');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Redirect http to https in production
app.use((req: Request, res: Response, next) => {
    if (!req.secure && process.env.NODE_ENV == 'production')
        return res.redirect('https://' + req.get('host') + req.url);

    next();
});

app.get('/', (_req, res: Response) => {
    res.render('index', { maxLen: constants.MAX_LEN })
});
app.post('/generate', generate);
app.use('/view', view);

app.use((_req, res: Response) => {
    res.status(404);
    res.render('error');
});

connectDB().then(({ success }: { success: boolean }) => {
    if (success) {
        app.listen(constants.PORT, '127.0.0.1', () => {
            app.emit('started');
        });
        console.log('listening at port: ' + constants.PORT);
    }
    else
        console.log('DB connection failed, aborted.');
});

module.exports = app;