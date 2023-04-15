"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uploadSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        // required : true
    },
    price: {
        type: String,
        // required: true
    },
    currency: {
        type: String,
        // required: true
    },
    link: {
        type: String,
        required: true
    }
});
const labTest = mongoose_1.default.model("test", uploadSchema);
exports.default = labTest;
