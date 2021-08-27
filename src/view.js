const { Router } = require('express');
const { getSecret, deleteSecret } = require('./db/secrets');
const { decrypt } = require('./crypto');

module.exports = Router()
    .get('/:id', findSecret, getSecret)
    .post('/:id', findSecret, handleUserDecrypt);


async function findSecret(req, res, next) {
    const { id } = req.params;
    req.doc = await getSecret(id);

    if (req.doc)
        next();
    else
        res.render('secret', { secret: null, decrypted: false })
}

async function getSecret(req, res) {
    const { secret } = req.doc;

    if (req.doc.userPass) {
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
                const message = decrypt({
                    iv: secret.iv.buffer,
                    message: secret.message.buffer,
                    authTag: secret.authTag.buffer,
                    salt: secret.salt.buffer
                });
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

async function handleUserDecrypt(req, res, next) {
    if (req.method == 'POST') {
        const { passphrase } = req.body;
        const { doc } = req;
        const { id } = req.params;

        if (!passphrase) {
            res.status(400);
        }
        else {
            try {
                const hash = doc.secret;
                const secret = decrypt({
                    iv: hash.iv.buffer,
                    message: hash.message.buffer,
                    authTag: hash.authTag.buffer,
                    salt: hash.salt.buffer
                }, passphrase);
                await deleteSecret(id);
                res.render('secret', { secret, decrypted: true });
            }
            catch (e) {
                res.render('decrypt', {
                    link: req.originalUrl,
                    wrongPass: true
                })
            }
        }
    }
    else if (req.method == 'GET' && req.doc.userPass)
        res.render('decrypt', {
            link: req.originalUrl,
            wrongPass: false
        });
    else
        next();
}