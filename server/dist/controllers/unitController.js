"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnitConversionType = exports.deleteUnit = exports.editUnit = exports.getUnits = exports.createUnit = void 0;
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const Unit_1 = __importDefault(require("../models/Unit"));
// unitFullName, unitId,  unitConversionData
exports.createUnit = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { unitFullName, unitId, unitConversion } = req.body;
    //Check if biomarker name already exists
    if (yield Unit_1.default.findOne({ isDeleted: false, unitFullName: unitFullName }))
        return next((0, customError_1.createCustomError)('Unit already exists. Edit the existing one.', 403));
    const newUnit = yield Unit_1.default.create({
        unitFullName, unitId, unitConversion
    });
    res.status(201).json({ status: 'Success', message: 'Unit created.', data: newUnit });
}));
exports.getUnits = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const units = yield Unit_1.default.find({ isDeleted: false });
    res.status(200).json({ status: 'Success', results: units.length, data: units });
}));
exports.editUnit = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { unitFullName, unitId, unitConversion, status } = req.body;
    const { id } = req.params;
    const unitData = yield Unit_1.default.findOne({ _id: id });
    console.log("user", unitData);
    unitData.unitFullName = unitFullName,
        unitData.unitId = unitId,
        unitData.unitConversion = unitConversion,
        unitData.status = status,
        yield unitData.save();
    res.status(201).json({ status: "Success", data: unitData });
}));
exports.deleteUnit = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };
    try {
        const unitDetail = yield Unit_1.default.updateOne(filter, update);
        res.status(201).json({ massage: "Unit delete succesfully" });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
}));
exports.deleteUnitConversionType = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    Unit_1.default.updateOne({ "unitConversion": { $elemMatch: { _id: id } } }, { $set: { "unitConversion.$.is_Deleted": true } }, (err, result) => {
        if (err) {
            // handle error
        }
        else {
            res.status(201).json({ massage: "Unit Conversion delete succesfully" });
            console.log(result);
        }
    });
    // console.log(biomarkertype) const biomarkertype = await 
}));
