/*
    Script for configuring mongoDB
    To be run once when installing
*/
require('dotenv').config({
    path: './../.env'
});
const { connectMongo, tableName } = require('./../src/utils/db');

connectMongo().then(async ({ success, client }) => {
    if (!success) return;

    const index = await client.db(tableName).collection('secrets').createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
    );
    console.log(index);

    process.exit();
});