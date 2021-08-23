const { MongoClient, ObjectId } = require('mongodb');
const { encrypt } = require('./crypto');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const tableName = 'secrets';
const indexTTLName = 'expiresAtTTL';
const defaultTTL = parseInt(process.env.DEFAULT_SECRET_TTL) || 7;

const client = new MongoClient(mongoUrl, {
    serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_TIMEOUT_MS)
});

const db = client.db(tableName);

async function connectMongo() {
    console.log('Establing DB connection...');
    return client.connect().then(async client => {
        console.log('Mongo connection successful');

        await checkIndexes();
        return {
            success: true,
            client
        };
    }).catch(err => {
        console.error(err);
        console.log('Mongo connection failed');
        return {
            success: false,
            client: null
        };
    });
}

async function checkIndexes() {
    const indexes = await client.db(tableName).collection('secrets').indexes();
    const exists = indexes.find(e => e.name == indexTTLName)
    if (!exists) {
        console.log('Index TTL missing, creating now');
        const name = await db.collection('secrets').createIndex(
            { expiresAt: 1 },
            {
                expireAfterSeconds: 0,
                name: indexTTLName
            }
        );
        if (name == indexTTLName)
            console.log('Index TTL created');
    }
    else
        console.log('Index TTL already exists');
}

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
    deleteSecret,
    tableName,
    indexTTLName
};