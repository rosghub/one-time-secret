const crypto = require('crypto');

/**
 * GCM is an authenticated encryption mode that
 * not only provides confidentiality but also 
 * provides integrity in a secured way
 * */
const BLOCK_CIPHER = 'aes-256-gcm';

/**
 * 128 bit auth tag is recommended for GCM
 */
const AUTH_TAG_BYTE_LEN = 16;

/**
 * NIST recommends 96 bits or 12 bytes IV for GCM
 * to promote interoperability; efficiency; and
 * simplicity of design
 */
const IV_BYTE_LEN = 12;

/**
 * Note = 256 (in algorithm name) is key size. 
 * Block size for AES is always 128
 */
const KEY_BYTE_LEN = 32;

/**
 * To prevent rainbow table attacks
 * */
const SALT_BYTE_LEN = 16;

const getIV = () => crypto.randomBytes(IV_BYTE_LEN);
const getRandomKey = () => crypto.randomBytes(KEY_BYTE_LEN);

/**
 * To prevent rainbow table attacks
 * */
const getSalt = () => crypto.randomBytes(SALT_BYTE_LEN);

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
function encrypt(messagetext, key) {
    const iv = getIV();
    const cipher = crypto.createCipheriv(
        BLOCK_CIPHER, key, iv,
        { 'authTagLength': AUTH_TAG_BYTE_LEN });
    let encryptedMessage = cipher.update(messagetext);
    encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
    return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]);
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
function decrypt(ciphertext, key) {
    const authTag = ciphertext.slice(-16);
    const iv = ciphertext.slice(0, 12);
    const encryptedMessage = ciphertext.slice(12, -16);
    const decipher = crypto.createDecipheriv(
        BLOCK_CIPHER, key, iv,
        { 'authTagLength': AUTH_TAG_BYTE_LEN });
    decipher.setAuthTag(authTag);
    let messagetext = decipher.update(encryptedMessage);
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
    encrypt,
    decrypt
};