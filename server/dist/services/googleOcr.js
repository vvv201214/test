"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectTextFromUrl = exports.detectText = void 0;
const vision = __importStar(require("@google-cloud/vision"));
// import { getJsonDataFromGCS } from './googleStorage';
// const CONFIG= {
//     credentials: {
//         private_key: JSON.parse(process.env.GCV_PRIVATE_KEY!),
//         client_email: JSON.parse(process.env.GCV_CLIENT_EMAIL!),
//     }
// }
const credentilsNew = JSON.parse(JSON.stringify({
    "type": "service_account",
    "project_id": "jeevankhata-backend",
    "private_key_id": "cbedf2b0706f62f76473c3c4bf17ea5f0f9d18d4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzW8r937SXi/2M\nedaOoavVum15/uPHjJvp/afI/MxfMx5I1BtU220lDn2iHbSh+6LM0kUFwtRTIlPi\nJqeBsLNFOnpPe7BOQluRjOBe3pHR2blqaE6GwK11hSKaV1BlL3s/nF+36FIzDkg0\nDEjVfUqr9VABHBTrddoFsPe+n7ja1fRMPIDji6lG+OxFJ38LS5nweWSi3ARnjnrf\nT+W0tAmxkrRqjRW4o4oWUf5M95ViDmTiGhOrRV2flRcC7hIF8MswsHrdVgU3t270\n3Wzz2mO26nqvcRoY0aTwlBfJu1r/igq2i6P6m2mmJIjXq/nhjNhqGlfYyQFnkAtA\nEdEdzHvvAgMBAAECggEABO5/NF/UTV5yCEzJU36qhOPtYq9ZgAEjwFlTJbmdvPhg\n2svKPJkT9TLizXRXpSSQI2WctD3ZLLgC6nL5pB1BsKOc/VZ/UIeOkP/4o2MnS0fb\nS0u27QmbO2H/w5KnCUE2+FbKYvomWHUKEzRLRGN/jB7gpkcpZBgHeKSXC0zE/m9b\nuWZO0e3+PstwRYV98pjtRlZrI2PJq8BTB5ZsBeJjtjo1BVb8vAAOOS97FQJKzvIQ\nq98fHi1hZ4SM2SBFR5/TVSDmz5C9o4geRQqOiUFztm4Y3qiyZxaDlhqcnbnbCrF6\nHkhnUbVDr+AOr+bK/2Mx/qcp7NoARczB0bTvmikdcQKBgQDzNAnOn96KNyk46h4P\n2QcqKlz65tqg7AEZJRXMVUaOexQDQiu9d2gVC2GujklVYd8tFP/NapeVav+sWLKQ\nC7KyIHYnqU9fp9syhhaaUUHZjfzLqJIawNHFhbBB3Twt9+qP6kgL7lmkhixe+6cW\nVE5B+sTw+KPHzw05K2dg5HLYHQKBgQC8y8NJYxlZevkILHksIRhqMh+c56Ez0IHn\n2UZfOZR23QF/f+QIjvinubhM1X/2hQhYxORu+5CTg5PxrA/6doiwFZfP3pEhZ0Ov\n6IzrqkTeR1t09QhUVCz0Ejay7ZD3iRyqSBHtjgVWJxviQ8zJq55tQf4XmfngsRV8\nNTu58RReewKBgQCnNfkkMjCscN6LvhOrK7lMWVISQ5S/nWPn6OKC2YKoRaDt2JoA\nK0/JYEjp3fQ3mxH5if2SOx47YhSlZ1plxVU4OS9jd3oWN29y3lQ+B24x6PiNAbpq\nYHYZyx/zOOu+YzzHc/nTEi5Z+tIZAAbSSGaB4Kt1Tk40+3uI+fma2ZbIVQKBgDr8\nftti9vyaC0yeeI1tGa+0UWQ4iokh0DScEfyWhOhOTLWFQ73YzZ+5yvdWjVB8aAs0\nGRsDxjwQlByh4awjdLlvRatQoo+JMAC5662F2VaJfO2h0SRn2FO5jRWCXBS65hXd\nxpwuD0THm1KqVEV+NVV1lOnS1dt5+HiCOVLzG6YZAoGBAJItf2K9djxDj0dy4VKF\nPjhZTjhNga88pd3HPHZsYw/XTTnluZXzDYOcYVgOKeghDz4qLlFYJHSp1I8aTuWv\nC52sDgntfEnUsSJN6rq8+WV4J3AUEmnT8VwpTlxqkkdupL06wrO99zMKWu6upf0Y\nsDP8fhnq0Vzw2brpLWyRXwu+\n-----END PRIVATE KEY-----\n",
    "client_email": "jkprog@jeevankhata-backend.iam.gserviceaccount.com",
    "client_id": "117764412374014655116",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/jkprog%40jeevankhata-backend.iam.gserviceaccount.com"
}));
const CONFIGX = {
    credentials: {
        private_key: credentilsNew.private_key,
        client_email: credentilsNew.client_email,
    }
};
const client = new vision.ImageAnnotatorClient(CONFIGX);
const detectText = (filePath, fileType) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield client.textDetection(filePath);
        console.log(result.length);
        return result;
    }
    catch (err) {
        console.log(err);
    }
});
exports.detectText = detectText;
const detectTextFromUrl = (filePath, fileType) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield client.textDetection(filePath);
        console.log(result.length);
        return result;
    }
    catch (err) {
        console.log(err);
    }
});
exports.detectTextFromUrl = detectTextFromUrl;
// export const detectDocumentText = async(fileName: any, fileType: string) => {
//    // Imports the Google Cloud client libraries
// // Creates a client
// const client = new vision.v1.ImageAnnotatorClient(CONFIGX);
// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// // Bucket where the file resides
// const bucketName = 'jk-test-docs';
// // Path to PDF file within bucket
// // The folder to store the results
// const outputPrefix = 'results';
// const gcsSourceUri = `gs://${bucketName}/${fileName}`;
// const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}/`;
// const inputConfig = {
//   // Supported mime_types are: 'application/pdf' and 'image/tiff'
//   mimeType: 'application/pdf',
//   gcsSource: {
//     uri: gcsSourceUri,
//   },
// };
// const outputConfig = {
//   gcsDestination: {
//     uri: gcsDestinationUri,
//   },
// };
// const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
// const request = {
//   requests: [
//     {
//       inputConfig: inputConfig,
//       features: features,
//       outputConfig: outputConfig,
//     },
//   ],
// };
// const [operation]:any = await client.asyncBatchAnnotateFiles(request as any);
// const [filesResponse] = await operation.promise();
// const destinationUri =
//   filesResponse.responses[0].outputConfig.gcsDestination.uri;
// console.log('Json saved to: ' + destinationUri);
// // const data = await getJsonDataFromGCS(fileName, bucketName);
// return data;
// }
// export default {detectText, detectTextFromUrl};
