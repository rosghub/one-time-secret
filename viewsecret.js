const { getSecret, deleteSecret } = require('./db');
const { decrypt } = require('./crypto');

async function handleUserPass(req, res, next) {
    if (req.method == 'POST') {
        const { passphrase } = req.body;
        const { id } = req.params;
        const doc = await getSecret(id);
        const { secret } = doc;
        try {
            const message = decrypt({
                iv: secret.iv.buffer,
                message: secret.message.buffer,
                authTag: secret.authTag.buffer,
                salt: secret.salt.buffer
            }, passphrase);
            res.render('secret', {
                secret: message,
                userPass: false,
                link: null
            });
            await deleteSecret(id);
        }
        catch (e) {
            // TODO render wrong pass
        }
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
        res.render('secret', {
            secret: null,
            userPass: false,
            link: null
        });
}

async function viewDecryptedSecret(req, res) {
    const { userPass, secret } = req;
    if (userPass) {
        res.render('secret', {
            secret: null,
            userPass: true,
            link: req.originalUrl
        });
    }
    else {
        const message = decrypt({
            iv: secret.iv.buffer,
            message: secret.message.buffer,
            authTag: secret.authTag.buffer,
            salt: secret.salt.buffer
        });
        res.render('secret', {
            secret: message,
            userPass: false,
            link: null
        });
        await deleteSecret(req.params.id);
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