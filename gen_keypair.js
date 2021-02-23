#!/usr/bin/env node

const ed25519 = require("tweetnacl");

const keyPairData = ed25519.sign.keyPair();
const keyPair = {
    publicKey: Buffer.from(keyPairData.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPairData.secretKey).toString("hex")
};

console.log(JSON.stringify(keyPair, null, 4));
