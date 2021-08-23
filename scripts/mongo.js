/*
    Script for configuring mongoDB
    To be run once when installing
*/
require('dotenv').config({
    path: './../.env'
});
const { connectMongo, tableName, indexTTLName } = require('./../src/utils/db');

connectMongo().then(async ({ success, client }) => {
    if (!success) return;

    const index = await client.db(tableName).collection('secrets').createIndex(
        { expiresAt: 1 },
        {
            expireAfterSeconds: 0,
            name: indexTTLName
        }
    );
    console.log('Index created: ' + index);

    process.exit();
});