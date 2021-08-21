const { getSecret, deleteSecret } = require('./db');
const { decrypt } = require('./crypto');

async function handleUserPass(req, res, next) {
    if (req.method == 'POST') {
        const { passphrase } = req.body;
        const { id } = req.params;
        const doc = await getSecret(id);
        if (doc) {
            const { secret } = doc;
            try {
                const message = decrypt({
                    iv: secret.iv.buffer,
                    message: secret.message.buffer,
                    authTag: secret.authTag.buffer,
                    salt: secret.salt.buffer
                }, passphrase);
                await deleteSecret(id);
                res.render('secret', { secret: message });
            }
            catch (e) {
                res.render('decrypt', {
                    link: req.originalUrl,
                    wrongPass: true
                });
            }
        }
        else
            next();
    }
    else
        next();
}

async function viewSecret(req, res, next) {
    const { id } = req.params;
    const doc = await getSecret(id);

    if (doc) {
        req.userPass = doc.userPass;
        req.secret = doc.secret;
        next();
    }
    else
        res.render('secret', { secret: null });
}

async function viewDecryptedSecret(req, res) {
    const { userPass, secret } = req;
    if (userPass) {
        res.render('decrypt', {
            link: req.originalUrl,
            wrongPass: false
        });
    }
    else {
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
}

/*
async function viewSecret(req, res) {
    const { id } = req.params;

    const doc = await getSecret(id);
    const data = {
        secret: null,
        userPass: false,
        link: null
    };

    if (doc != null) {
        if (doc.userPass) {
            data.userPass = true;
            data.link = req.originalUrl;
        }
        else {
            const hash = doc.secret;
            data.secret = decrypt({
                iv: hash.iv.buffer,
                message: hash.message.buffer,
                authTag: hash.authTag.buffer,
                salt: hash.salt.buffer
            });
        }

        await deleteSecret(id);
    }
    res.render('secret', data);
}

module.exports = viewSecret;
*/

module.exports = [
    handleUserPass,
    viewSecret,
    viewDecryptedSecret
];