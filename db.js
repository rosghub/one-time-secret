const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017', {
    serverSelectionTimeoutMS : process.env.DB_SERVER_TIMEOUT_MS
});

// return success
module.exports.connectMongo = async () => {
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

module.exports.db = client.db('secrets');