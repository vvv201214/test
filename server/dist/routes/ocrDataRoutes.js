"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ocrDataController_1 = require("../controllers/ocrDataController");
const router = express_1.default.Router();
router.route('/').get(ocrDataController_1.getOCRData);
// router.route('/update/:id').put(editLabTest); , uploadInLocal.single('file')
// router.route('/delete/:id').patch(deleteLabTest);
exports.default = router;
