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
exports.getOCRData = exports.saveOcrData = void 0;
const uploadedDataSchema_1 = __importDefault(require("../models/uploadedDataSchema"));
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const User_1 = __importDefault(require("../models/User"));
const saveOcrData = (ocrData, userReq, link, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("in save data func", ocrData)
    const { name, age, gender, testName, lab, bioMarker, date } = ocrData;
    // console.log("bioMarker", bioMarker);
    //check if role exisits
    // if(await UploadedData.findOne({roleName})) return next(createCustomError('Role already exists. Please edit the existing role.', 401));
    const doc = yield uploadedDataSchema_1.default.create({
        name: name,
        age: age,
        gender: gender,
        testName: testName,
        lab: lab,
        bioMarker: bioMarker,
        link: link,
        date: date
    });
    const user = yield User_1.default.findById(userReq._id);
    user.documents = [...user.documents, doc._id];
    yield user.save({ validateBeforeSave: false });
    console.log("this is ocr", doc);
    res.status(201).json({ status: 'Success', message: 'data saved successfully', data: doc });
});
exports.saveOcrData = saveOcrData;
exports.getOCRData = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadedData = yield uploadedDataSchema_1.default.find({ isDeleted: false }).sort({ _id: -1 });
    if (!uploadedData)
        return next((0, customError_1.createCustomError)('Can\'t get roles', 404));
    res.status(200).json({ status: 'Success', data: uploadedData, results: uploadedData.length });
}));
// export const deleteRole = CatchAsync(async (req:Request, res: Response, next:NextFunction) => {
//     const {id} = req.params;
//     const filter = { _id: id };
//     const update = { $set: { isDeleted: true } };
//     try{
//         const roleDetail = await Role.updateOne(filter, update);
//         console.log("this is roledetail", roleDetail);
//         res.status(201).json({massage : "data delete succesfully"});
//     } catch (e){
//         res.status(500).json({error:"Failed to delete data"});
//     }    
// });
