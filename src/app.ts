require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as constants from './constants';
import { connectDB, ConnectionResult } from './db/db';
import generate from './generate';
import view from './view';
import * as favicon from 'serve-favicon';
import * as path from 'path';

const app = express();
app.set('trust proxy', '127.0.0.1');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(favicon('static/favicon.ico'));
app.use('/css', express.static(path.join(__dirname, '../..', 'static/css')));


// Redirect http to https in production
if (process.env.NODE_ENV == 'production') {
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (!req.secure)
            return res.redirect('https://' + req.get('host') + req.url);

        next();
    });
}

app.get('/', (_req, res: Response) => {
    res.render('index', { maxLen: constants.MAX_LEN })
});
app.post('/generate', generate);
app.use('/view', view);

app.use((_req, res: Response) => {
    res.status(404);
    res.render('error');
});

connectDB().then(({ success }: ConnectionResult) => {
    if (success) {
        app.listen(constants.PORT, '127.0.0.1', () => {
            app.emit('started');
        });
        console.log('listening at port: ' + constants.PORT);
    }
    else
        console.log('DB connection failed, aborted.');
});

export default app;