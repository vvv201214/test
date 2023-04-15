"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.CustomError = CustomError;
const createCustomError = (message, statusCode) => {
    return new CustomError(message, statusCode);
};
exports.createCustomError = createCustomError;
