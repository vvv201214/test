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
exports.getData = exports.getUploads = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Schema_1 = __importDefault(require("./Schema"));
// CatchAsync
const s3 = new aws_sdk_1.default.S3();
exports.getUploads = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, currency } = req.body;
        console.log(req.body);
        const uploadedFiles = req.files;
        const fileUploadPromises = uploadedFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.originalname,
                Body: file.buffer,
            };
            const uploadedObject = yield s3.upload(uploadParams).promise();
            return {
                name: file.originalname,
                url: uploadedObject.Location,
                size: uploadedObject.Size,
                mimetype: file.mimetype,
            };
        }));
        const uploadedData = yield Promise.all(fileUploadPromises);
        const data = yield Schema_1.default.create({
            name: name,
            discription: description,
            price: price,
            currency: currency,
            link: uploadedData[0].url,
        });
        console.log(data);
        res.status(200).json(uploadedData);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error uploading files.");
    }
}));
exports.getData = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Schema_1.default.find();
    res.status(200).json({ status: 'Success', results: data.length, data: data });
}));
/*
data {
  ETag: '"50144ec9244526f497c161563f449d25"',
  ServerSideEncryption: 'AES256',
  VersionId: 'E9rLKolNOdTcOvp1RZtk0NiyP8a5ftMT',
  Location: 'https://jeevan-khata-test.s3.amazonaws.com/cbc1.jpeg',
  key: 'cbc1.jpeg',
  Key: 'cbc1.jpeg',
  Bucket: 'jeevan-khata-test'
}
*/ 
