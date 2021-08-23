const { ObjectId } = require('mongodb');
const { encrypt } = require('./../utils/crypto');
const { db } = require('./db');

const defaultTTL = parseInt(process.env.DEFAULT_SECRET_TTL) || 7;

// ttl in days (86400000)
function storeSecret(secret, password) {
    const expiresAt = new Date(new Date().getTime() + 86400000 * defaultTTL);
    const doc = {
        secret: encrypt(secret, password),
        userPass: password != null && password.length > 0,
        expiresAt
    };

    return db.collection('secrets').insertOne(doc).then(res => {
        const { insertedId } = res;
        console.log(`Inserted secret ${insertedId} with ${password ? 'user' : 'default'} pass.`);
        return insertedId;
    }).catch(err => {
        console.error(err);
    });
}

function getSecret(id) {
    try {
        const collection = db.collection('secrets');
        const doc = { _id: new ObjectId(id) };

        //return collection.findOne(doc).then(res => res);
        return collection.findOne(doc);
    }
    catch (e) { }
    return null;
}

function deleteSecret(id) {
    const doc = { _id: new ObjectId(id) };
    return db.collection('secrets').deleteOne(doc).then(res => {
        console.log('Secret deleted');
    });
}

module.exports = {
    storeSecret,
    getSecret,
    deleteSecret
};