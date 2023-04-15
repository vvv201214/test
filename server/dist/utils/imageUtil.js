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
exports.deskewImage = exports.convertPdfMultiToImageBuffer = exports.convertMultiPdfToImageBuffer = exports.imageBufferToPdfBuffer = exports.convertPdfToImageBuffer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const pdf2pic_1 = require("pdf2pic");
const rimraf_1 = __importDefault(require("rimraf"));
const fs_2 = require("fs");
const gm_1 = __importDefault(require("gm"));
const im = gm_1.default.subClass({ imageMagick: true });
const jimp_1 = __importDefault(require("jimp"));
const pdf_lib_1 = require("pdf-lib");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const pngjs_1 = require("pngjs");
function convertPdfToImageBuffer(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('recieved buffer', pdfBuffer);
        const tempFile = `${path_1.default.resolve(__dirname, `${Date.now()}.pdf`)}`;
        console.log(tempFile);
        yield fs_1.default.promises.writeFile(tempFile, pdfBuffer);
        const outputDirectory = `${path_1.default.resolve(__dirname, 'outputs')}`;
        console.log(outputDirectory);
        rimraf_1.default.sync(outputDirectory);
        (0, fs_2.mkdirSync)(outputDirectory);
        const options = {
            density: 100,
            saveFilename: `${Date.now()}`,
            savePath: outputDirectory,
            format: "png",
            width: 600,
            height: 900,
        };
        console.log('Error is not here');
        //   console.log(await pdf2image.convertPDF(tempFile));
        const pdf = yield (0, pdf_parse_1.default)(pdfBuffer);
        const numPages = pdf.numpages;
        console.log('total pages', numPages);
        const convert = (0, pdf2pic_1.fromBuffer)(pdfBuffer, options);
        console.log("this is convert", convert);
        let res;
        try {
            res = yield convert(1);
            console.log("this is convert res", res);
        }
        catch (err) {
            console.log("this is convert err", err);
        }
        console.log('Error is here?');
        fs_1.default.promises.unlink(tempFile);
        console.log(`${outputDirectory}/${res.name}`);
        let data = fs_1.default.readFileSync(`${outputDirectory}/${res.name}`);
        console.log(data);
        fs_1.default.promises.unlink(`${outputDirectory}/${res.name}`);
        return data;
    });
}
exports.convertPdfToImageBuffer = convertPdfToImageBuffer;
const imageBufferToPdfBuffer = (inputImageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('inputbuffer', inputImageBuffer);
    // const pdfBuffer = await sharp(inputImageBuffer).toFormat('pdf')
    //   .toBuffer();
    //   fs.writeFile(`${path.resolve(__dirname, `output.pdf`)}`, pdfBuffer, (error) => {
    //     if (error) {
    //       console.error(error);
    //     } else {
    //       console.log('PDF file written');
    //     }
    //   });
    // return pdfBuffer;
    const image = (0, sharp_1.default)(inputImageBuffer);
    const { width, height } = yield image.metadata();
    const pdfDoc = yield pdf_lib_1.PDFDocument.create();
    const pdfImage = yield pdfDoc.embedJpg(yield image.jpeg().toBuffer());
    const pdfPage = pdfDoc.addPage([width, height]);
    pdfPage.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: pdfImage.width,
        height: pdfImage.height
    });
    const pdfBuffer = Buffer.from(yield pdfDoc.save());
    console.log(pdfBuffer);
    fs_1.default.writeFile(`${path_1.default.resolve(__dirname, `output.pdf`)}`, pdfBuffer, (error) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log('PDF file written');
        }
    });
    return pdfBuffer;
});
exports.imageBufferToPdfBuffer = imageBufferToPdfBuffer;
const mkdirSynch = (dirPath) => {
    try {
        (0, fs_2.mkdirSync)(dirPath);
    }
    catch (err) {
        if (err.code !== 'EEXIST')
            throw err;
    }
};
function convertMultiPdfToImageBuffer(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('received buffer', pdfBuffer);
        const outputDirectory = `${path_1.default.resolve(__dirname, 'outputs')}`;
        console.log(outputDirectory);
        rimraf_1.default.sync(outputDirectory);
        (0, fs_2.mkdirSync)(outputDirectory);
        const options = {
            density: 100,
            saveFilename: `${Date.now()}`,
            savePath: outputDirectory,
            format: 'png',
            width: 600,
            height: 900,
        };
        const convert = (0, pdf2pic_1.fromBuffer)(pdfBuffer, options);
        const pdf = yield (0, pdf_parse_1.default)(pdfBuffer);
        const numPages = pdf.numpages;
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
            pages.push(yield convert(i));
        }
        const images = yield Promise.all(pages.map((page) => __awaiter(this, void 0, void 0, function* () {
            return yield jimp_1.default.read(`${outputDirectory}/${page.name}`);
        })));
        const result = new Promise((resolve, reject) => {
            new jimp_1.default(images[0].bitmap.width, images.reduce((acc, image) => acc + image.bitmap.height, 0), (err, image) => __awaiter(this, void 0, void 0, function* () {
                let currentHeight = 0;
                for (const img of images) {
                    image.composite(img, 0, currentHeight);
                    currentHeight += img.bitmap.height;
                }
                const outputPath = `${outputDirectory}/combined.png`;
                yield image.writeAsync(outputPath);
                fs_1.default.readFile(`${outputDirectory}/combined.png`, (err, data) => {
                    if (err)
                        reject(err);
                    resolve(data);
                });
            }));
        });
        yield result;
        let bufferData = yield fs_1.default.promises.readFile(`${outputDirectory}/combined.png`);
        // const buffer = await (result ).getBufferAsync(Jimp.MIME_PNG);
        // console.log('buffer', buffer);
        // await fs.promises.writeFile(`${outputDirectory}/test.png`, buffer);
        return bufferData;
        // console.log('result', result);
        // // let bufferData = await fs.promises.readFile(`${outputDirectory}/combined.png`);
        // // console.log(bufferData);
        // const buffer = await result.getBufferAsync(Jimp.MIME_PNG);
        // console.log('buffer', buffer);
        // await fs.promises.writeFile(`${outputDirectory}/test.png`, buffer);
        // return buffer;
    });
}
exports.convertMultiPdfToImageBuffer = convertMultiPdfToImageBuffer;
function convertPdfMultiToImageBuffer(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('received buffer', pdfBuffer);
        const outputDirectory = `${path_1.default.resolve(__dirname, 'outputs')}`;
        console.log(outputDirectory);
        rimraf_1.default.sync(outputDirectory);
        (0, fs_2.mkdirSync)(outputDirectory);
        const options = {
            density: 100,
            saveFilename: `${Date.now()}`,
            savePath: outputDirectory,
            format: 'png',
            width: 600,
            height: 900,
        };
        const convert = (0, pdf2pic_1.fromBuffer)(pdfBuffer, options);
        const pdf = yield (0, pdf_parse_1.default)(pdfBuffer);
        const numPages = pdf.numpages;
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
            pages.push(yield convert(i));
        }
        const promises = pages.map((page, index) => {
            return fs_1.default.promises.readFile(`${outputDirectory}/${page.name}`);
        });
        const imageBuffers = yield Promise.all(promises);
        console.log('image buffers', imageBuffers);
        let totalHeight = 0;
        let maxWidth = 0;
        imageBuffers.forEach(buffer => {
            const image = pngjs_1.PNG.sync.read(buffer);
            totalHeight += image.height;
            maxWidth = Math.max(maxWidth, image.width);
            console.log(totalHeight, maxWidth);
        });
        const result = new pngjs_1.PNG({
            width: maxWidth,
            height: totalHeight
        });
        let currentHeight = 0;
        imageBuffers.forEach((buffer, i) => {
            const image = pngjs_1.PNG.sync.read(buffer);
            console.log(image.width, image.height, currentHeight);
            pngjs_1.PNG.bitblt(image, result, 0, 0, maxWidth, currentHeight, 0, image.height);
            currentHeight += image.height;
        });
        const outputPath = `${outputDirectory}/combined.png`;
        fs_1.default.writeFileSync(outputPath, pngjs_1.PNG.sync.write(result));
        let data = fs_1.default.readFileSync(outputPath);
        // fs.promises.unlink(outputPath);
        return data;
    });
}
exports.convertPdfMultiToImageBuffer = convertPdfMultiToImageBuffer;
function deskewImage(inputImagePath, outputImagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('inside');
        const image = yield jimp_1.default.read(inputImagePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const threshold = 128;
        let skewAngle = 0;
        let sliceWidth = Math.floor(width * 0.1);
        let sliceHeight = Math.floor(height * 0.1);
        for (let i = 0; i < 10; i++) {
            const slice = image.clone().crop(i * sliceWidth, 0, sliceWidth, height);
            let histogram = new Array(height).fill(0);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < sliceWidth; x++) {
                    const color = jimp_1.default.intToRGBA(slice.getPixelColor(x, y));
                    if (color.r < threshold && color.g < threshold && color.b < threshold) {
                        histogram[y]++;
                    }
                }
            }
            let min = 0;
            let max = height - 1;
            let found = false;
            for (let j = 0; j < height / 2; j++) {
                if (histogram[j] > threshold && histogram[height - j - 1] > threshold) {
                    min = j;
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log('not found bro');
                continue;
            }
            found = false;
            for (let j = height / 2; j < height; j++) {
                if (histogram[j] > threshold && histogram[height - j - 1] > threshold) {
                    max = j;
                    found = true;
                    console.log('breaking');
                    break;
                }
            }
            if (!found) {
                console.log('not found');
                continue;
            }
            const sliceAngle = Math.atan2(2 * (max - min), height) / 2;
            skewAngle += sliceAngle;
        }
        if (skewAngle === 0) {
            console.log('no skew angle');
            return;
        }
        image.rotate(-skewAngle, false);
        image.write(outputImagePath);
    });
}
exports.deskewImage = deskewImage;
