const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const defaultKey = '7qGR6qADFWfKzS';
const iv = crypto.randomBytes(16);

function encrypt(text, userKey) {
    const key = userKey || defaultKey;

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

function decrypt(hash, userKey) {
    const key = userKey || defaultKey;

    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};