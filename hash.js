const crypto = require("crypto");

/**
 * SHA256 hashing
 *
 */
class Hash {

    /**
     * SHA256 hash a string or buffer into hex encoding.
     *
     * @param {string | Buffer} value
     * @return {string}
     */
    static hash(value)
    {
        return this.hash2([value], "hex");
    }

    /**
     * SHA256 hash an array of strings and/or buffers.
     *
     * @param {(Array<any>)} buffers
     * @param {any} outputEncoding
     * @return {Buffer | string} If no outputEncoding is given then returns a Buffer.
     *  If "hex" is given as outputEncoding then the a HEX string will be returned.
     */
    static hash2(buffers, outputEncoding)
    {
        const hash = crypto.createHash("sha256");

        let index;
        for (index=0; index<buffers.length; index++) {
            hash.update(buffers[index]);
        }

        return hash.digest(outputEncoding);
    }

    /**
     * @param {number} [bytesCount] - number of bytes to generate
     * @throws An error is expected to be thrown by the crypto module if there is a problem generating the bytes.
     * @return {Buffer}
     */
    static generateRandomBytes(bytesCount)
    {
        bytesCount = bytesCount || 16;
        return crypto.randomBytes(bytesCount);
    }

    /**
     * @param {number} [bytesCount] - number of bytes to generate
     * @throws An error is expected to be thrown if there is a problem generating the bytes.
     * @return {string}
     */
    static generateRandomHex(bytesCount)
    {
        return this.generateRandomBytes(bytesCount).toString("hex");
    }
}

module.exports = Hash;
