const { Router } = require('express');
const { getSecret, deleteSecret } = require('./db/secrets');
const { decrypt } = require('./crypto');

module.exports = Router()
    .get('/:id', findSecret, revealSecret)
    .post('/:id', findSecret, handleUserDecrypt);


async function findSecret(req, res, next) {
    const { id } = req.params;
    req.doc = await getSecret(id);

    if (req.doc)
        next();
    else
        res.render('secret', { secret: null, decrypted: false });
}

async function revealSecret(req, res) {

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
                const message = decrypt(req.doc.hash);
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
    const { passphrase } = req.body;
    const { id } = req.params;

    if (!passphrase) {
        res.status(400);
    }
    else {
        try {
            const secret = decrypt(req.doc.hash, passphrase);
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