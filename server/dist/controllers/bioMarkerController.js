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
exports.deleteBioMarkerType = exports.deleteBioMarker = exports.editBioMarker = exports.getBioMarkersName = exports.getBioMarkers = exports.createBioMarker = void 0;
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const BioMarker_1 = __importDefault(require("../models/BioMarker"));
exports.createBioMarker = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, unit, alias, bioMarkerTypes, scientificName } = req.body;
    //Check if biomarker name already exists
    if (yield BioMarker_1.default.findOne({ name: name, isDeleted: false }))
        return next((0, customError_1.createCustomError)('Bio Marker already exists. Edit the existing one.', 403));
    //Check if any of the aliases exist
    if (alias && (alias.length > 0 && (alias.length != 1 || alias[0] != ''))) {
        console.log('alias', alias);
        if (yield BioMarker_1.default.findOne({ alias: { $in: [...alias, name] } }))
            return next((0, customError_1.createCustomError)('Bio Marker already exists. Edit the existing one.', 403));
    }
    const newBioMarker = yield BioMarker_1.default.create({
        name, unit, alias, bioMarkerTypes, scientificName
    });
    res.status(201).json({ status: 'Success', message: 'Biomarker created.', data: newBioMarker });
}));
exports.getBioMarkers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bioMarkers = yield BioMarker_1.default.find({ isDeleted: false });
    res.status(200).json({ status: 'Success', results: bioMarkers.length, data: bioMarkers });
}));
exports.getBioMarkersName = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bioMarkers = yield BioMarker_1.default.aggregate([
        { $match: { isDeleted: false } },
        {
            $project: {
                name: 1,
                _id: 0
            }
        }
    ]);
    // const bioMarkers = await BioMarker.find({isDeleted: false});
    res.status(200).json({ status: 'Success', results: bioMarkers.length, data: bioMarkers });
}));
exports.editBioMarker = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, unit, bioMarkerTypes, alias, status, scientificName } = req.body;
    const { id } = req.params;
    const bioMarkerData = yield BioMarker_1.default.findOne({ _id: id });
    console.log("user", bioMarkerData);
    bioMarkerData.name = name,
        bioMarkerData.unit = unit,
        bioMarkerData.bioMarkerTypes = bioMarkerTypes,
        bioMarkerData.alias = alias,
        // bioMarkerData!.alias = alias, scientificName
        bioMarkerData.status = status,
        bioMarkerData.scientificName = scientificName;
    yield bioMarkerData.save();
    res.status(201).json({ status: "Success", data: bioMarkerData });
}));
exports.deleteBioMarker = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };
    try {
        const roleDetail = yield BioMarker_1.default.updateOne(filter, update);
        res.status(201).json({ massage: "Bio Marker delete succesfully" });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
}));
exports.deleteBioMarkerType = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const filter = {bioMarkerTypes._id: type_id } 
    // const update = { $set: { isDeleted: true } };
    // try{
    //     const roleDetail = await BioMarker.updateOne(filter, update);
    //     res.status(201).json({massage : "Bio Marker delete succesfully"});
    // } catch (e){
    //     res.status(500).json({error:"Failed to delete data"});
    // }  
    console.log("type_id", id);
    BioMarker_1.default.updateOne({ "bioMarkerTypes": { $elemMatch: { _id: id } } }, { $set: { "bioMarkerTypes.$.is_Deleted": true } }, (err, result) => {
        if (err) {
            // handle error
        }
        else {
            res.status(201).json({ massage: "Bio Marker delete succesfully" });
            console.log(result);
        }
    });
    // console.log(biomarkertype) const biomarkertype = await 
}));
