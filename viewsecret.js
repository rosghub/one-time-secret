const { ObjectId } = require('mongodb');
const { db } = require('./db');


// @return secret
async function destroySecret(id) {
    const collection = db.collection('secrets');
    const doc = { _id: ObjectId(id) };

    const secret = await collection.findOne(doc).then(res => res ? res.secret : null);

    if (secret)
        return collection.deleteOne(doc).then(res => {
            console.log('Secret deleted');
            return secret
        });

    return null;
}

async function viewSecret(req, res) {
    const { id } = req.params;

    const secret = await destroySecret(id);

    const m = secret ? `Here's you're secret: ${secret}` : `Secret doesn't exist.`;
    res.send(m);
}

module.exports = viewSecret;