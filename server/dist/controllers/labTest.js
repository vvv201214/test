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
exports.deleteLabTest = exports.editLabTest = exports.getLabTests = exports.createLabTest = void 0;
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const LabTest_1 = __importDefault(require("../models/LabTest"));
exports.createLabTest = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { testName, testScientificName, bioMarkers } = req.body;
    //Check if labtest name already exists
    if (yield LabTest_1.default.findOne({ isDeleted: false, testName: testName }))
        return next((0, customError_1.createCustomError)('Lab Test already exists. Edit the existing one.', 403));
    const newLabTest = yield LabTest_1.default.create({
        testName, testScientificName, bioMarkers
    });
    res.status(201).json({ status: 'Success', message: 'Lab test created.', data: newLabTest });
}));
exports.getLabTests = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const labTests = yield LabTest_1.default.find({ isDeleted: false });
    res.status(200).json({ status: 'Success', results: labTests.length, data: labTests });
}));
exports.editLabTest = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { testName, testScientificName, bioMarkers, status } = req.body;
    const { id } = req.params;
    const labTestData = yield LabTest_1.default.findOne({ _id: id });
    console.log("labtest", labTestData);
    labTestData.testName = testName,
        labTestData.testScientificName = testScientificName,
        labTestData.bioMarkers = bioMarkers,
        labTestData.status = status;
    yield labTestData.save();
    res.status(201).json({ status: "Success", data: labTestData });
}));
exports.deleteLabTest = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };
    try {
        const labtestDetail = yield LabTest_1.default.updateOne(filter, update);
        console.log("this is roledetail", labtestDetail);
        res.status(201).json({ massage: "data delete succesfully" });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
}));
