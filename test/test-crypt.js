#!/usr/bin/env node
//
// Test Crypt utility code
//

// Project dependencies
const Crypt = require("../crypt.js");

// External
const nacl = require("tweetnacl");

// NodeJS native dependencies
const assert = require("assert");
const crypto = require("crypto");


//
// Data
const referenceDataStr = "reference test data string";
const referenceData = new TextEncoder("utf-8").encode(referenceDataStr);
console.log("Reference data:", referenceDataStr);


//
// Symmetric encryption: encrypt and decrypt the reference data
const sharedSecret = "A Very Secrety Secret be 32bytes";
const s_encryptedData = Crypt.symmetricEncrypt(referenceData, sharedSecret);
const s_decryptedData = Crypt.symmetricDecrypt(s_encryptedData, sharedSecret);

// Confirm decryption succeeded, data matches reference data length, byte-by-byte and converted string
assert(s_decryptedData != null);
assert(s_decryptedData.length == referenceData.length);
assert(s_decryptedData.every((value, index) => value === referenceData[index]));
const s_decryptedDataStr = new TextDecoder("utf-8").decode(s_decryptedData);
assert(s_decryptedDataStr == referenceDataStr);
console.log("Symmetrical decryption output:", s_decryptedDataStr);


//
// Asymmetric encryption: encrypt and decrypt the reference data
const senderKeyPair = nacl.box.keyPair();
const recipientKeyPair = nacl.box.keyPair();
const a_encryptedData = Crypt.asymmetricEncrypt(referenceData, recipientKeyPair.publicKey, senderKeyPair.secretKey);
const a_decryptedData = Crypt.asymmetricDecrypt(a_encryptedData, senderKeyPair.publicKey, recipientKeyPair.secretKey);

// Confirm decryption succeeded, data matches reference data length, byte-by-byte and converted string
assert(a_decryptedData != null);
assert(a_decryptedData.length == referenceData.length);
assert(a_decryptedData.every((value, index) => value === referenceData[index]));
const a_decryptedDataStr = new TextDecoder("utf-8").decode(a_decryptedData);
assert(a_decryptedDataStr == referenceDataStr);
console.log("Asymmetrical decryption output:", a_decryptedDataStr);


//
// RSA public key encryption with key pair object: encrypt and decrypt the reference data
const recipientKeyPairRSA = crypto.generateKeyPairSync("rsa", { modulusLength: 4096 });
console.log("Public key:", recipientKeyPairRSA.publicKey);
console.log("Private key:", recipientKeyPairRSA.privateKey);
const referenceDataBuffer = Buffer.from(referenceData);
const r_encryptedData = Crypt.encrypt(referenceDataBuffer, recipientKeyPairRSA.publicKey);
const r_decryptedData = Crypt.decrypt(r_encryptedData, recipientKeyPairRSA.privateKey);

// Confirm decryption succeeded, data matches reference data length, byte-by-byte and converted string
assert(r_decryptedData != null);
assert(r_decryptedData.length == referenceData.length);
assert(r_decryptedData.every((value, index) => value === referenceData[index]));
const r_decryptedDataStr = new TextDecoder("utf-8").decode(r_decryptedData);
assert(r_decryptedDataStr == referenceDataStr);
console.log("RSA public key decryption output:", r_decryptedDataStr);


//
// RSA public key encryption with string-based key pair: encrypt and decrypt the reference data
const recipientKeyPairRSAStr = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096 ,

    //
    // "When encoding public keys, it is recommended to use 'spki'. When encoding private keys, it is recommended to use 'pkcs8'"
    // Source: https://nodejs.org/docs/latest-v12.x/api/crypto.html#crypto_crypto_generatekeypairsync_type_options
    publicKeyEncoding: {
        type: "spki",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
    }
});
console.log("Public key:", recipientKeyPairRSAStr.publicKey);
console.log("Private key:", recipientKeyPairRSAStr.privateKey);
const rs_encryptedData = Crypt.encrypt(referenceDataBuffer, recipientKeyPairRSAStr.publicKey);
const rs_decryptedData = Crypt.decrypt(rs_encryptedData, recipientKeyPairRSAStr.privateKey);

// Confirm decryption succeeded, data matches reference data length, byte-by-byte and converted string
assert(rs_decryptedData != null);
assert(rs_decryptedData.length == referenceData.length);
assert(rs_decryptedData.every((value, index) => value === referenceData[index]));
const rs_decryptedDataStr = new TextDecoder("utf-8").decode(rs_decryptedData);
assert(rs_decryptedDataStr == referenceDataStr);
console.log("RSA public key decryption output:", rs_decryptedDataStr);
