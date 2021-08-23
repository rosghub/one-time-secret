const { MongoClient } = require('mongodb');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const tableName = 'secrets';
const indexTTLName = 'expiresAtTTL';

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
        console.log('Index TTL missing, creating it now');
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
        console.log('Index TTL exists');
}

module.exports = {
    db,
    connectMongo
};