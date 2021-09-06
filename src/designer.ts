import * as express from 'express';
import { Request, Response } from 'express';
import * as constants from './constants';
import * as favicon from 'serve-favicon';
import * as path from 'path';

const app = express();

const { PORT } = constants;

app.use(favicon('static/favicon.ico'));
app.use('/css', express.static(path.join(__dirname, '../..', 'static/css')));
app.set('view engine', 'ejs')
    .get('/', (req: Request, res: Response) => {
        res.render('index', { maxLen: constants.MAX_LEN });
    })
    .get('/generate', (req: Request, res: Response) => {
        res.render('generate', { 
            link: 'http://localhost:3000/view/12394732984723942349823', 
            ttl: 4,
            expirationDate: new Date().getTime(),
            secret: 'this is a secret oaiwjef oiwa jfowa jfowai foewathis is a secret oaiwjef oiwa jfowa jfowai foewathis is a secret oaiwjef oiwa jfowa jfowai foewa'
        });
    })
    .get('/spoiler', (req: Request, res: Response) => {
        res.render('spoiler');
    })
    .get('/view', (req: Request, res: Response) => {
        res.render('secret', { secret: 'true', decrypted: true });
    })
    .get('/decrypt', (req: Request, res: Response) => {
        res.render('decrypt', { link: '/view/1234', wrongPass: false });
    })
    .use((req: Request, res: Response) => {
        res.render('error');
    });

app.listen(PORT, '127.0.0.1', () => {
    console.log('EJS Template designer mounted at http://localhost:' + PORT);
});