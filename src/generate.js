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
    const { secret } = req.body;
    const validationErrors = getValidationErrors(secret);
    if (validationErrors) {
        res.send(validationErrors);
    }
    else
        next();
}

async function generateSecret(req, res) {
    const { secret, passphrase } = req.body;
    const id = await storeSecret(secret, passphrase);
    const protocol = req.secure ? 'https' : 'http';
    const url = protocol + '://' + req.get('host') + '/view/' + id;
    res.render('generate', {
        link: url
    });
}

module.exports = [
    validateSecret,
    generateSecret
];