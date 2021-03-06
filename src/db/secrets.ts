import { ObjectId, InsertOneResult, Document } from 'mongodb';
import { encrypt, Hash } from '../crypto-utils';
import db from './db';
import { DEFAULT_SECRET_TTL } from './../constants';


export type Secret = {
    hash: Hash,
    userPass: boolean,
    expiresAt: Date
}

export type StoreSecretResult = {
    insertedId: string,
    ttl?: string,
    expiresAt?: Date,
    userPass?: boolean
};

export function storeSecret(secret: string, password: string, ttl: string): Promise<StoreSecretResult> {
    const _ttl = parseInt(ttl) || DEFAULT_SECRET_TTL;
    const _password = (password != null && password.length > 0) ? password : null;

    // TTL days to ms
    const expiresAt = new Date(new Date().getTime() + 86400000 * _ttl);
    const doc: Secret = {
        hash: encrypt(secret, _password),
        userPass: _password != null,
        expiresAt
    };

    return db.collection('secrets').insertOne(doc).then((res: InsertOneResult<Document>) => {
        const insertedId = res.insertedId.toHexString();
        console.log(`Inserted secret ${insertedId} with ${password ? 'user' : 'default'} pass.`);

        return {
            insertedId,
            ttl: _ttl + '',
            expiresAt,
            userPass: doc.userPass
        };

    }).catch(err => {
        console.error(err);
        return { insertedId: null };
    });
}

export function getSecret(id: string): Promise<Secret> {
    try {
        const collection = db.collection('secrets');
        const doc = { _id: new ObjectId(id) };

        return collection.findOne(doc).then((doc: Document) => {
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
        })
    }
    catch (e) { }
    return null;
}

export function deleteSecret(id: string) {
    const doc = { _id: new ObjectId(id) };
    return db.collection('secrets').deleteOne(doc).then(res => {
        console.log('Secret deleted');
    });
}