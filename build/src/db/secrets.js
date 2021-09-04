"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSecret = exports.getSecret = exports.storeSecret = void 0;
var mongodb_1 = require("mongodb");
var crypto_utils_1 = require("../crypto-utils");
var db_1 = require("./db");
var constants_1 = require("./../constants");
function storeSecret(secret, password, ttl) {
    var _ttl = parseInt(ttl) || constants_1.DEFAULT_SECRET_TTL;
    var _password = (password != null && password.length > 0) ? password : null;
    // TTL days to ms
    var expiresAt = new Date(new Date().getTime() + 86400000 * _ttl);
    var doc = {
        hash: (0, crypto_utils_1.encrypt)(secret, _password),
        userPass: _password != null,
        expiresAt: expiresAt
    };
    return db_1.default.collection('secrets').insertOne(doc).then(function (res) {
        var insertedId = res.insertedId.toHexString();
        console.log("Inserted secret " + insertedId + " with " + (password ? 'user' : 'default') + " pass.");
        return {
            insertedId: insertedId,
            ttl: _ttl + '',
            expiresAt: expiresAt
        };
    }).catch(function (err) {
        console.error(err);
        return { insertedId: null };
    });
}
exports.storeSecret = storeSecret;
function getSecret(id) {
    try {
        var collection = db_1.default.collection('secrets');
        var doc = { _id: new mongodb_1.ObjectId(id) };
        return collection.findOne(doc).then(function (doc) {
            if (doc) {
                return {
                    hash: {
                        iv: doc.hash.iv.buffer,
                        message: doc.hash.message.buffer,
                        authTag: doc.hash.authTag.buffer,
                        salt: doc.hash.salt.buffer
                    },
                    userPass: doc.userPass,
                    expiresAt: doc.expiresAt
                };
            }
            return null;
        });
    }
    catch (e) { }
    return null;
}
exports.getSecret = getSecret;
function deleteSecret(id) {
    var doc = { _id: new mongodb_1.ObjectId(id) };
    return db_1.default.collection('secrets').deleteOne(doc).then(function (res) {
        console.log('Secret deleted');
    });
}
exports.deleteSecret = deleteSecret;
//# sourceMappingURL=secrets.js.map