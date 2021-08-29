var crypto = require('crypto');
var defaultPass = '357e231089bef2841bde3a53aa62b11e5d2874a5501a7ce4d46a95e616b5e17a';
/**
 * GCM is an authenticated encryption mode that
 * not only provides confidentiality but also
 * provides integrity in a secured way
 * */
var BLOCK_CIPHER = 'aes-256-gcm';
/**
 * 128 bit auth tag is recommended for GCM
 */
var AUTH_TAG_BYTE_LEN = 16;
/**
 * NIST recommends 96 bits or 12 bytes IV for GCM
 * to promote interoperability; efficiency; and
 * simplicity of design
 */
var IV_BYTE_LEN = 12;
/**
 * Note = 256 (in algorithm name) is key size.
 * Block size for AES is always 128
 */
var KEY_BYTE_LEN = 32;
/**
 * To prevent rainbow table attacks
 * */
var SALT_BYTE_LEN = 16;
var getIV = function () { return crypto.randomBytes(IV_BYTE_LEN); };
var getRandomKey = function () { return crypto.randomBytes(KEY_BYTE_LEN); };
/**
 * To prevent rainbow table attacks
 * */
var getSalt = function () { return crypto.randomBytes(SALT_BYTE_LEN); };
/**
 *
 * @param {Buffer} password - The password to be used for generating key
 *
 * To be used when key needs to be generated based on password.
 * The caller of this function has the responsibility to clear
 * the Buffer after the key generation to prevent the password
 * from lingering in the memory
 */
function getKeyFromPassword(password, salt) {
    return crypto.scryptSync(password, salt, KEY_BYTE_LEN);
}
/**
 *
 * @param {Buffer} messagetext - The clear text message to be encrypted
 * @param {Buffer} key - The key to be used for encryption
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the encryption to prevent the message text
 * and the key from lingering in the memory
 */
function encrypt(messagetext, password) {
    var pass = password || defaultPass;
    var salt = getSalt();
    var key = getKeyFromPassword(pass, salt);
    var iv = getIV();
    var cipher = crypto.createCipheriv(BLOCK_CIPHER, key, iv, { 'authTagLength': AUTH_TAG_BYTE_LEN });
    var encryptedMessage = cipher.update(messagetext);
    encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
    //return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]);
    /*
        return {
            iv: iv.toString('hex'),
            message: encryptedMessage.toString('hex'),
            authTag: cipher.getAuthTag().toString('hex'),
            salt: salt.toString('hex')
        };
        */
    return {
        iv: iv,
        message: encryptedMessage,
        authTag: cipher.getAuthTag(),
        salt: salt
    };
}
/**
 *
 * @param {Buffer} ciphertext - Cipher text
 * @param {Buffer} key - The key to be used for decryption
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the decryption to prevent the message text
 * and the key from lingering in the memory
 */
/*
function decrypt(ciphertext, key) {
    const authTag = ciphertext.slice(-1 * AUTH_TAG_BYTE_LEN);
    const iv = ciphertext.slice(0, IV_BYTE_LEN);
    const encryptedMessage = ciphertext.slice(IV_BYTE_LEN, -1 * AUTH_TAG_BYTE_LEN);
    */
function decrypt(hash, password) {
    var iv = hash.iv, message = hash.message, authTag = hash.authTag, salt = hash.salt;
    var pass = password || defaultPass;
    var key = getKeyFromPassword(pass, salt);
    var decipher = crypto.createDecipheriv(BLOCK_CIPHER, key, iv, { 'authTagLength': AUTH_TAG_BYTE_LEN });
    decipher.setAuthTag(authTag);
    var messagetext = decipher.update(message);
    messagetext = Buffer.concat([messagetext, decipher.final()]);
    return messagetext;
}
/*
const assert = require('assert');
const cryptoUtils = require('../lib/crypto_utils');
describe('CryptoUtils', function() {
  describe('decrypt()', function() {
    it('should return the same mesage text after decryption of text encrypted with a '
     + 'randomly generated key', function() {
      let plaintext = 'my message text';
      let key = cryptoUtils.getRandomKey();
      let ciphertext = cryptoUtils.encrypt(plaintext, key);

      let decryptOutput = cryptoUtils.decrypt(ciphertext, key);

      assert.equal(decryptOutput.toString('utf8'), plaintext);
    });

    it('should return the same mesage text after decryption of text excrypted with a '
     + 'key generated from a password', function() {
      let plaintext = 'my message text';

      let key = cryptoUtils.getKeyFromPassword(
              Buffer.from('mysecretpassword'), cryptoUtils.getSalt());
      let ciphertext = cryptoUtils.encrypt(plaintext, key);

      let decryptOutput = cryptoUtils.decrypt(ciphertext, key);

      assert.equal(decryptOutput.toString('utf8'), plaintext);
    });
  });
});
*/
module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};
