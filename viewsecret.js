const { ObjectId } = require('mongodb');
const { db } = require('./db');


// @return secret
async function destroySecret(id) {
    try {
        const collection = db.collection('secrets');
        const doc = { _id: ObjectId(id) };

        const secret = await collection.findOne(doc).then(res => res ? res.secret : null);

        if (secret)
            return collection.deleteOne(doc).then(res => {
                console.log('Secret deleted');
                return secret
            });
    }
    catch (e) {
    }
    return null;
}

async function viewSecret(req, res) {
    const { id } = req.params;

    const secret = (await destroySecret(id)) || `Secret doesn't exist`;

    res.render('secret', { secret });
}

module.exports = viewSecret;