"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const labTest_1 = require("../controllers/labTest");
const router = express_1.default.Router();
router.route('/').get(labTest_1.getLabTests).post(authController_1.protect, labTest_1.createLabTest);
router.route('/update/:id').put(labTest_1.editLabTest);
router.route('/delete/:id').patch(labTest_1.deleteLabTest);
exports.default = router;
