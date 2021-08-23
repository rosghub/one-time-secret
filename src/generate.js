const { storeSecret } = require('./db/secrets');
const MAX_LEN = process.env.MAX_LEN || 1024;

// @return errors
function getValidationErrors(secret) {
    if (typeof(secret) !== 'string')
        return 'Invalid data type';
    if (secret.length <= 0)
        return 'Invalid string length';
    if (secret.length > MAX_LEN)
        return 'Secret too long';

    return null;
}

function validateSecret(req, res, next) {
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

async function generateSecret(req, res) {
    const { secret, passphrase, ttl } = req.body;
    const { insertedId, ttl: actualTTL } = await storeSecret(secret, passphrase, ttl);

    const protocol = req.secure ? 'https' : 'http';
    const url = protocol + '://' + req.get('host') + '/view/' + insertedId;
    res.render('generate', {
        link: url,
        ttl: actualTTL
    });
}

module.exports = [
    validateSecret,
    generateSecret
];