import { NextFunction, Request, Response, Router } from 'express';
import { getSecret, deleteSecret, Secret } from './db/secrets';
import { decrypt } from './crypto-utils';

export default Router()
    .get('/:id', findSecret, revealSecret)
    .post('/:id', findSecret, handleUserDecrypt);

interface SecretRequest extends Request {
    secret: Secret
}

async function findSecret(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const secret = await getSecret(id);

    if (secret) {
        (req as SecretRequest).secret = secret;
        next();
    }
    else
        res.render('secret', { secret: null, decrypted: false });
}

async function revealSecret(req: Request, res: Response) {
    const { secret } = (req as SecretRequest);

    if (secret.userPass) {
        res.render('decrypt', {
            link: req.originalUrl,
            wrongPass: false
        });
    }
    else {
        const reveal = req.query.reveal === 'true';

        if (reveal) {
            try {
                // Decrypt with default pass
                const message = decrypt(secret.hash);
                await deleteSecret(req.params.id);
                res.render('secret', { secret: message, decrypted: false });
            }
            catch (e) {
                console.error(e);
                res.status(500);
            }
        }
        else
            res.render('spoiler');
    }
}

async function handleUserDecrypt(req: Request, res: Response) {
    const { passphrase } = req.body;
    const { id } = req.params;
    const { secret } = (req as SecretRequest);

    if (!passphrase) {
        res.status(400);
        res.send('Client error no passphrase provided');
    }
    else {
        try {
            // Decrypt with user pass
            const message = decrypt(secret.hash, passphrase);
            await deleteSecret(id);
            res.render('secret', { secret: message, decrypted: true });
        }
        catch (e) {
            res.render('decrypt', {
                link: req.originalUrl,
                wrongPass: true
            })
        }
    }
}