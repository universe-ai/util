const ed25519 = require("tweetnacl");

/**
 * @typedef {Object} KeyPair
 * @property {string} priv - private key
 * @property {string} pub - public key
 */

class ed25519Wrapper
{
    /**
     * Sign message with the private key and return signature as hexadecimal string.
     * @param {string} message
     * @param {KeyPair} keyPair
     * @return {string}
     */
    static sign(message, keyPair)
    {
        const privateKey = Buffer.from(keyPair.secretKey, "hex");
        const toSign = Buffer.from(message);

        const signature = ed25519.sign.detached(toSign, privateKey);
        return Buffer.from(signature).toString("hex");
    }

    /**
     * Verify that the challenge string was signed by the given public key
     * @param {string} signature
     * @param {string} message
     * @param {string} publicKeyHex
     * @return {boolean}
     */
    static verify(signature, message, publicKeyHex)
    {
        const publicKeyHex2 = Buffer.from(publicKeyHex, "hex");
        const signature2 = Buffer.from(signature, "hex");
        const message2 = Buffer.from(message);

        try {
            return ed25519.sign.detached.verify(message2, signature2, publicKeyHex2);
        }
        catch(e) {
            return false;
        }
    }

    /**
     * @return {KeyPair}
     */
    static makeKeyPair()
    {
        // Generate a new key pair without specifying a seed.
        // Expects NaCl library to handle key pair generation from a secure random seed.
        const keyPair = ed25519.sign.keyPair();
        return {
            publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
            secretKey: Buffer.from(keyPair.secretKey).toString("hex")
        };
    }
}

module.exports = ed25519Wrapper;
