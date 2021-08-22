const { MongoClient, ObjectId } = require('mongodb');
const { encrypt } = require('./crypto');
const client = new MongoClient('mongodb://localhost:27017', {
    serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_TIMEOUT_MS)
});

const db = client.db('secrets');

// return success
async function connectMongo() {
    console.log('Establing DB connection...');
    return client.connect().then(client => {
        console.log('Mongo connection successful')
        return true;
    }).catch(err => {
        console.error(err);
        console.log('Mongo connection failed');
        return false;
    })
}

function storeSecret(secret, password) {
    const doc = {
        secret: encrypt(secret, password),
        userPass: password != null && password.length > 0
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

        return collection.findOne(doc).then(res => {
            if (res) {
                /*
                const { secret, userPass } = res;
                return decrypt({
                    iv: secret.iv.buffer,
                    message: secret.message.buffer,
                    authTag: secret.authTag.buffer,
                    salt: secret.salt.buffer
                });
                */
               return res;
            }
            return null;
        });
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
    connectMongo,
    storeSecret,
    getSecret,
    deleteSecret
};