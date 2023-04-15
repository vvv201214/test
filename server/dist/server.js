"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../config.env') });
console.log(process.env.DEV_DB);
const dB = (_a = process.env.DEV_DB) === null || _a === void 0 ? void 0 : _a.replace('<password>', process.env.DEV_DB_PASSWORD);
const PORT = process.env.PORT || 8080;
console.log(dB);
mongoose_1.default.connect(dB).then(() => {
    console.log('Database Connected!');
});
const server = app_1.default.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
