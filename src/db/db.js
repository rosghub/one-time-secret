const { MongoClient } = require('mongodb');
const {
    MONGO_URL,
    MONGO_TABLE,
    MONGO_INDEX_TTL,
    DB_SERVER_TIMEOUT_MS
} = require('./../constants');

const client = new MongoClient(MONGO_URL, {
    serverSelectionTimeoutMS: DB_SERVER_TIMEOUT_MS
});

const db = client.db(MONGO_TABLE);

async function connectDB() {
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
    // Create TTL index on secrets collection
    const indexes = await client.db(MONGO_TABLE).collection('secrets').indexes();
    const exists = indexes.find(e => e.name == MONGO_INDEX_TTL)
    if (!exists) {
        console.log('Index TTL missing, creating it now');
        const name = await db.collection('secrets').createIndex(
            { expiresAt: 1 },
            {
                expireAfterSeconds: 0,
                name: MONGO_INDEX_TTL
            }
        );
        if (name == MONGO_INDEX_TTL)
            console.log('Index TTL created');
    }
    else
        console.log('Index TTL exists');
}

module.exports = {
    db,
    connectDB
};