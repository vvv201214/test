"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const unitController_1 = require("../controllers/unitController");
const router = express_1.default.Router();
router.route('/').get(unitController_1.getUnits).post(authController_1.protect, unitController_1.createUnit);
router.route('/update/:id').put(unitController_1.editUnit);
router.route('/delete/:id').patch(unitController_1.deleteUnit);
router.route('/unitConversionDelete/:id').patch(unitController_1.deleteUnitConversionType);
exports.default = router;
