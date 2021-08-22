const { getSecret, deleteSecret } = require('./db');
const { decrypt } = require('./crypto');

async function findSecret(req, res, next) {
    const { id } = req.params;
    req.doc = await getSecret(id);

    if (req.doc)
        next();
    else
        res.render('secret', { secret: null })
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
                res.render('secret', { secret });
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

// method=GET && userPass=false
async function handleDefaultDecrypt(req, res) {
    const { secret } = req.doc;
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
            res.render('secret', { secret: message });
        }
        catch (e) {
            res.status(500);
        }
    }
    else
        res.render('spoiler');
}

module.exports = [
    findSecret,
    handleUserDecrypt,
    handleDefaultDecrypt
];