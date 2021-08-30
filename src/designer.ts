import * as express from 'express';
import { Request, Response } from 'express';
import * as constants from './constants';
const app = express();

const { PORT } = constants;

app.set('view engine', 'ejs')
    .get('/', (req: Request, res: Response) => {
        res.render('index', { maxLen: constants.MAX_LEN });
    })
    .get('/generate', (req: Request, res: Response) => {
        res.render('generate', { link: 'link' });
    })
    .get('/spoiler', (req: Request, res: Response) => {
        res.render('spoiler');
    })
    .get('/view', (req: Request, res: Response) => {
        res.render('secret', { secret: 'true', decrypted: false });
    })
    .get('/decrypt', (req: Request, res: Response) => {
        res.render('decrypt', { link: '/view/1234', wrongPass: true });
    })
    .use((req: Request, res: Response) => {
        res.render('error');
    });

app.listen(PORT, '127.0.0.1', () => {
    console.log('EJS Template designer mounted at http://localhost:' + PORT);
});