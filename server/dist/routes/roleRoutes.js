"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = require("../controllers/roleController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.route('/').get(roleController_1.getRoles).post(authController_1.protect, roleController_1.createRole);
router.route('/update/:id').put(roleController_1.editRole);
router.route('/delete/:id').patch(roleController_1.deleteRole);
exports.default = router;
