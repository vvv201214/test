"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const router = express_1.default.Router();
// configure the AWS SDK with your S3 credentials
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: ""
});
const s3 = new aws_sdk_1.default.S3();
// configure Multer to use S3 as the storage backend
// let fileName ;
// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: function(req, file, cb) {
//     console.log("file", file)
//     fileName = file.originalname;
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
//       console.log("file not found")
//       return;
//       // return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
//   },
// });
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
});
console.log("upload", upload);
// router.route('/').post(upload.single('file'), getUploads);
router.route('/').post(upload.array("files"), uploadController_1.getUploads);
exports.default = router;
