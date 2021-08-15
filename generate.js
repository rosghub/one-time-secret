const { db } = require('./db');
const MAX_LEN = process.env.MAX_LEN || 1024;

// @return errors
function validateSecret(secret) {
    if (typeof(secret) !== 'string')
        return 'Invalid data type';
    if (secret.length <= 0)
        return 'Invalid string length';
    if (secret.length > MAX_LEN)
        return 'Secret too long';

    return null;
}

async function storeSecret(secret) {
    return db.collection('secrets').insertOne({ secret }).then(res => {
        const { insertedId } = res;
        console.log('inserted document: ' + insertedId);
        return insertedId;
    }).catch(err => {
        console.error(err);
    });
}

function generateValidation(req, res, next) {
    const secret = req.body.secret;
    const validationErrors = validateSecret(secret);
    if (validationErrors) {
        res.send(validationErrors);
    }
    else
        next();
}

async function generate(req, res) {
    const { secret } = req.body;
    const id = await storeSecret(secret);
    res.send('Here\'s your link: https://secrets.rosghub.xyz/view/' + id);
}

module.exports = [
    generateValidation,
    generate
];