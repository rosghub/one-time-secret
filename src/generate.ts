import { storeSecret } from './db/secrets';
import { MAX_LEN } from './constants';
import { NextFunction, Request, Response } from 'express';

// @return errors
function getValidationErrors(secret: string): string | null {
    if (typeof(secret) !== 'string')
        return 'Invalid data type';
    if (secret.length <= 0)
        return 'Invalid string length';
    if (secret.length > MAX_LEN)
        return 'Secret too long';

    return null;
}

function validateSecret(req: Request, res: Response, next: NextFunction) {
    var { secret, ttl } = req.body;
    const validationErrors = getValidationErrors(secret);
    if (validationErrors) {
        res.send(validationErrors);
    }
    else {
        if (ttl) {
            if (ttl < 0)
                ttl = null;
            else if (ttl > 30)
                ttl = 30;

            req.body.ttl = ttl;
        }
        next();
    }
}

async function generateSecret(req: Request, res: Response) {
    const { secret, passphrase, ttl } = req.body;
    const { insertedId, ttl: actualTTL, expiresAt } = await storeSecret(secret, passphrase, ttl);

    const protocol = req.secure ? 'https' : 'http';
    const url = protocol + '://' + req.get('host') + '/view/' + insertedId;

    res.render('generate', {
        link: url,
        ttl: actualTTL,
        expirationDate: expiresAt
    });
}

export default [validateSecret, generateSecret];