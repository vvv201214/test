"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisifiedVerify = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (_id) => {
    return jsonwebtoken_1.default.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.signToken = signToken;
const promisifiedVerify = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
};
exports.promisifiedVerify = promisifiedVerify;
