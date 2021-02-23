const crypto = require("crypto");
const fs = require("fs");

class File
{
    /**
     * Read whole of part of a file.
     *
     * @param {string} file to read from
     * @param {number} offset in file to start reading from
     * @param {number} length in bytes to read
     * @return {Buffer}
     *  Buffer could be shorter than requested length
     */
    static readFile(file, offset, length)
    {
        const buffer = Buffer.alloc(length);
        const fd = fs.openSync(file, "r");
        const bytesRead = fs.readSync(fd, buffer, 0, length, offset);
        fs.closeSync(fd);
        if (bytesRead < length) {
            return buffer.slice(0, bytesRead);
        }
        return buffer;
    }

    /**
     * SHA256 hash the contents of a file using a stream.
     *
     * @param {string} filepath
     * @param {number | null} [length] of file to hash
     *  If file is longer than length the hash will be up til the length.
     *  If file is shorter than length the hash will be for the actual file length
     * @param {number | null} [offset] offset in file from where to hash
     * @param {any} [outputEncoding] defaults to "hex"
     * @return {string} hash
     */
    static async hashFile(filepath, length, offset, outputEncoding)
    {
        outputEncoding = outputEncoding || "hex";
        const hash = crypto.createHash("sha256");

        // Special case.
        if (length === 0) {
            hash.update("");
            return hash.digest(outputEncoding);
        }

        if (outputEncoding) {
            hash.setEncoding(outputEncoding);
        }

        const options = {};
        if (length != null) {
            options.end = length - 1 + (offset == null ? 0: offset);
        }
        if (offset != null) {
            options.start = offset;
        }

        const fd = fs.createReadStream(filepath, options);

        const streamIt = () => {
            return new Promise( accept => {
                fd.on("end", () => {
                    accept();
                });

                fd.pipe(hash);
            });
        };

        await streamIt();

        return hash.read();
    }

    /**
     * Return file length
     *
     * @param {string} file file path
     * @return {number} length of file in bytes
     */
    static statLength(file)
    {
        const stats = fs.statSync(file);
        return stats.size;
    }
}

module.exports = File;
