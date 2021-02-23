// Binary buffer util
//
//
class Buf
{
    /**
     * @param {string} str
     * @param {string | undefined} encoding
     * @return {Buffer}
     */
    static StringToBuffer(str, encoding)
    {
        return Buffer.from(str, encoding);
    }

    /**
     * @param {Buffer} buffer
     * @param {string} encoding
     * @return {string}
     */
    static BufferToString(buffer, encoding)
    {
        return buffer.toString(encoding);
    }

    /**
     * @param {Buffer}
     * @return {string}
     */
    static BufferToBase64(buffer)
    {
        return buffer.toString("base64");
    }

    /**
     * @param {string} base64String
     * @return {Buffer}
     */
    static Base64ToBuffer(base64String)
    {
        return Buffer.from(base64String, "base64");
    }
}

module.exports = Buf;
