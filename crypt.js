//
// External dependencies
const nacl = require("tweetnacl");
const { encodeBase64, decodeBase64 } = require("tweetnacl-util");

//
// Native NodeJS dependencies
const assert = require("assert");
const crypto = require("crypto");

/**
 *
 * Symmetrical and assymetrical cryptography
 *
 */
class Crypt {
    /**
     * Performs symmetric encryption of data using a shared secret key
     *
     * @param {Unit8Array} data - any chunk of data
     * @param {string} sharedSecret - secret key known by or previously shared between sender and recipient
     * @return {Uint8Array} - encrypted data in the form of a NaCl secret box
     */
    static symmetricEncrypt(data, sharedSecret) {
        assert(sharedSecret.length == nacl.secretbox.keyLength);
        //
        // Set up random nonce, sanitize secret, then
        // create a new NaCl secret box to store the input data
        const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
        assert(nonce.length == nacl.secretbox.nonceLength);
        const secret = decodeBase64(encodeBase64(sharedSecret));
        const box = nacl.secretbox(data, nonce, secret);
        assert(box.length == (data.length + nacl.secretbox.overheadLength));

        //
        // Assemble encrypted data into a single output, then return
        const output = new Uint8Array(nonce.length + box.length);
        output.set(nonce);
        output.set(box, nonce.length);
        return output;
    }

    /**
     * Performs symmetric decryption of data using a shared secret key
     *
     * @param {Uint8Array} data - encrypted data in the form of a NaCl secret box
     * @param {string} sharedSecret - secret key known by or previously shared between sender and recipient
     * @return {Unit8Array | null} - decrypted output or null on failure during decryption
     */
    static symmetricDecrypt(data, sharedSecret) {
        //
        // Split up the input data into nonce and box parts
        const nonce = data.slice(0, nacl.secretbox.nonceLength);
        assert(nonce.length == nacl.secretbox.nonceLength);
        const box = data.slice(nacl.secretbox.nonceLength, data.length);

        //
        // Decrypt data by opening up the box with the shared secret
        const secret = decodeBase64(encodeBase64(sharedSecret));
        const output = nacl.secretbox.open(box, nonce, secret);
        return output;
    }

    /**
     * Performs public key encryption of data
     *
     * @param {Unit8Array} data - any chunk of data
     * @param {Uint8Array} recipientPublicKey - the publicKey part of NaCl box key pair from the one expected to receive the encrypted message
     * @param {Uint8Array} senderSecretKey - secretKey part of NaCl box key pair for the one signing the message
     * @return {Uint8Array} - encrypted data in the form of a NaCl box
     */
    static asymmetricEncrypt(data, recipientPublicKey, senderSecretKey) {
        //
        // Input validation
        assert(recipientPublicKey.length == nacl.box.publicKeyLength);
        assert(senderSecretKey.length == nacl.box.secretKeyLength);

        //
        // Create a new NaCl box using public-key encryption,
        // targeting the recipient public key and signing with sender's own secret key
        const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
        assert(nonce.length == nacl.box.nonceLength);
        const box = nacl.box(data, nonce, recipientPublicKey, senderSecretKey);
        assert(box.length == (data.length + nacl.secretbox.overheadLength));

        //
        // Assemble encrypted data into a single output, then return
        const output = new Uint8Array(nonce.length + box.length);
        output.set(nonce);
        output.set(box, nonce.length);
        return output;
    }

    /**
     * Performs public key decryption of data
     *
     * @param {Uint8Array} data - encrypted data in the form of a NaCl box
     * @param {Uint8Array} senderPublicKey - the publicKey part of NaCl box key pair from the one who sent the encrypted message
     * @param {Uint8Array} recipientSecretKey - secretKey part of NaCl box key pair for the one receiving the encrypted message
     * @return {Unit8Array | null} - decrypted output or null on failure during decryption
     */
    static asymmetricDecrypt(data, senderPublicKey, recipientSecretKey) {
        //
        // Split up the input data into nonce and box parts
        const nonce = data.slice(0, nacl.secretbox.nonceLength);
        assert(nonce.length == nacl.secretbox.nonceLength);
        const box = data.slice(nacl.secretbox.nonceLength, data.length);

        //
        // Decrypt the input data by opening up the box using the recipient's own secret key,
        // in conjunction with the sender's public key
        const output = nacl.box.open(box, nonce, senderPublicKey, recipientSecretKey);
        return output;
    }

    /**
     * Performs RSA public key encryption of data
     *
     * @param {Buffer} data - any chunk of data to be encrypted
     * @param {Object | string} recipientPublicKey - the PEM encoded public key
     * @return {Buffer} - encrypted data
     */
    static encrypt(data, recipientPublicKey) {
        const output = crypto.publicEncrypt({
            key: recipientPublicKey,

            // From OpenSSL documentation:
            // RSA_PKCS1_PADDING (PKCS #1 v1.5 padding) currently is the most widely used mode.
            // However, it is highly recommended to use RSA_PKCS1_OAEP_PADDING in new applications.
            // RSA_PKCS1_OAEP_PADDING (EME-OAEP) as defined in PKCS #1 v2.0 with SHA-1, MGF1 and
            // an empty encoding parameter. This mode is recommended for all new applications.
            // Source: https://www.openssl.org/docs/manmaster/man3/RSA_public_encrypt.html
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, data);
        return output;
    }

    /**
     * Performs RSA decryption of data that was signed against a specific public key
     *
     * @param {Buffer} data - any chunk of encrypted data
     * @param {Object | string} recipientPrivateKey - the PEM encoded private key
     * @return {Buffer} - decrypted data
     */
    static decrypt(data, recipientPrivateKey) {
        const output = crypto.privateDecrypt({
            key: recipientPrivateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, data);
        return output;
    }
}

module.exports = Crypt;
