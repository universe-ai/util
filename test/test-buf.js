#!/usr/bin/env node
// Test Buf utility code
//
//

const Buf = require("../buf.js");
const assert = require("assert");
const fs = require("fs");

// Set up reference data
const dataBuffer = fs.readFileSync("./data.txt");

const base64 = Buf.BufferToBase64(dataBuffer);
assert(base64 === "cmVmZXJlbmNlIHRlc3QgZGF0YSBzdHJpbmcK");
const dataBuffer2 = Buf.Base64ToBuffer(base64);
assert(dataBuffer.equals(dataBuffer2));

const str = Buf.BufferToString(dataBuffer, "utf-8");
assert(str === "reference test data string\n");
const dataBuffer3 = Buf.StringToBuffer(str, "utf-8");
assert(dataBuffer.equals(dataBuffer3));
