const { db } = require('./db');
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

async function storeSecret(secret) {
    return db.collection('secrets').insertOne({ secret }).then(res => {
        const { insertedId } = res;
        console.log('inserted document: ' + insertedId);
        return insertedId;
    }).catch(err => {
        console.error(err);
    });
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
    const { secret } = req.body;
    const id = await storeSecret(secret);
    const url = req.protocol + '://' + req.get('host') + '/view/' + id;
    //res.send(`Here's your link: <a href="${url}">${url}</a>`)
    res.render('generate', {
        link: url
    });
}

module.exports = [
    validateSecret,
    generateSecret
];