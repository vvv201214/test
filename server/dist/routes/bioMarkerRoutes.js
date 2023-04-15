"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const bioMarkerController_1 = require("../controllers/bioMarkerController");
const router = express_1.default.Router();
router.route('/').get(bioMarkerController_1.getBioMarkers).post(authController_1.protect, bioMarkerController_1.createBioMarker);
router.route('/update/:id').put(bioMarkerController_1.editBioMarker);
router.route('/delete/:id').patch(bioMarkerController_1.deleteBioMarker);
router.route('/bioMarkerTypeDelete/:id').patch(bioMarkerController_1.deleteBioMarkerType);
router.route('/bioMarkerName').get(bioMarkerController_1.getBioMarkersName);
exports.default = router;
