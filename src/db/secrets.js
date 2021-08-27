const { ObjectId } = require('mongodb');
const { encrypt } = require('../crypto');
const { db } = require('./db');
const { DEFAULT_SECRET_TTL } = require('./../constants');

function storeSecret(secret, password, ttl) {
    const _ttl = ttl || DEFAULT_SECRET_TTL;
    const _password = (password != null && password.length > 0) ? password : null;

    // TTL days to ms
    const expiresAt = new Date(new Date().getTime() + 86400000 * _ttl);
    const doc = {
        hash: encrypt(secret, _password),
        userPass: _password != null,
        expiresAt
    };

    return db.collection('secrets').insertOne(doc).then(res => {
        const { insertedId } = res;
        console.log(`Inserted secret ${insertedId} with ${password ? 'user' : 'default'} pass.`);
        return {
            insertedId,
            ttl: _ttl
        };
    }).catch(err => {
        console.error(err);
        return null;
    });
}

function getSecret(id) {
    try {
        const collection = db.collection('secrets');
        const doc = { _id: new ObjectId(id) };

        return collection.findOne(doc).then(doc => {
            if (doc) {
                const { hash } = doc;
                doc.hash = {
                    iv: hash.iv.buffer,
                    message: hash.message.buffer,
                    authTag: hash.authTag.buffer,
                    salt: hash.salt.buffer
                };
                return doc;
            }
            return null;
        })
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