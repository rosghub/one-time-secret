var ObjectId = require('mongodb').ObjectId;
var encrypt = require('../crypto-utils').encrypt;
var db = require('./db').db;
var DEFAULT_SECRET_TTL = require('./../constants').DEFAULT_SECRET_TTL;
function storeSecret(secret, password, ttl) {
    var _ttl = ttl || DEFAULT_SECRET_TTL;
    var _password = (password != null && password.length > 0) ? password : null;
    // TTL days to ms
    var expiresAt = new Date(new Date().getTime() + 86400000 * _ttl);
    var doc = {
        hash: encrypt(secret, _password),
        userPass: _password != null,
        expiresAt: expiresAt
    };
    return db.collection('secrets').insertOne(doc).then(function (res) {
        var insertedId = res.insertedId;
        console.log("Inserted secret " + insertedId + " with " + (password ? 'user' : 'default') + " pass.");
        return {
            insertedId: insertedId,
            ttl: _ttl
        };
    }).catch(function (err) {
        console.error(err);
        return null;
    });
}
function getSecret(id) {
    try {
        var collection = db.collection('secrets');
        var doc = { _id: new ObjectId(id) };
        return collection.findOne(doc).then(function (doc) {
            if (doc) {
                var hash = doc.hash;
                doc.hash = {
                    iv: hash.iv.buffer,
                    message: hash.message.buffer,
                    authTag: hash.authTag.buffer,
                    salt: hash.salt.buffer
                };
                return doc;
            }
            return null;
        });
    }
    catch (e) { }
    return null;
}
function deleteSecret(id) {
    var doc = { _id: new ObjectId(id) };
    return db.collection('secrets').deleteOne(doc).then(function (res) {
        console.log('Secret deleted');
    });
}
module.exports = {
    storeSecret: storeSecret,
    getSecret: getSecret,
    deleteSecret: deleteSecret
};
//# sourceMappingURL=secrets.js.map