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
exports.mostRecentGraph = exports.allBioMarkers = exports.bioMarkerGraph = exports.getVitals = exports.addVitals = exports.getReminders = exports.addReminder = exports.getAllFamilyMemberDocuments = exports.getFamilyMemberDocuments = exports.getFamilyMember = exports.getFamilyMembers = exports.createFamilyMember = exports.deleteMe = exports.editMe = exports.getUser = exports.deleteUser = exports.editUser = exports.getUsers = exports.createUser = exports.uploadToS3 = exports.resizePhoto = exports.uploadMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const User_1 = __importDefault(require("../models/User"));
const uploadedDataSchema_1 = __importDefault(require("../models/uploadedDataSchema"));
const customError_1 = require("../errors/customError");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const userHelper_1 = require("../helpers/userHelper");
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el) &&
            (obj[el] !== null &&
                obj[el] !== undefined &&
                obj[el] !== '')) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type"), false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter }).single("profilePhoto");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
exports.uploadMulter = upload;
const resizePhoto = (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        console.log('no file');
        next();
        return;
    }
    (0, sharp_1.default)(req.file.buffer).resize({ width: 300, height: 300 }).toBuffer()
        .then((resizedImageBuffer) => {
        req.file.buffer = resizedImageBuffer;
        next();
    })
        .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error resizing photo" });
    });
};
exports.resizePhoto = resizePhoto;
const uploadToS3 = (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }
    // create S3 upload parameters
    const key = `users/${req.user.firstName + req.user.lastName + req.user.jeevanKhataId}/photos/profilePhotos/${(Date.now()) + req.file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
    };
    // upload image to S3 bucket
    s3.upload(params).promise()
        .then((s3Data) => {
        console.log('file uploaded');
        req.profilePhotoUrl = s3Data.Location;
        next();
    })
        .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error uploading photo to S3" });
    });
};
exports.uploadToS3 = uploadToS3;
exports.createUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address } = req.body;
    console.log("User :", req.user);
    //Check for required fields 
    if (!(email || password || mobile || firstName || lastName || dateOfBirth || gender))
        return next((0, customError_1.createCustomError)('Enter all mandatory fields.', 401));
    //Check if user exists
    if (yield User_1.default.findOne({ isDeleted: false, email }))
        return next((0, customError_1.createCustomError)('User with this email already exists. Please login with existing email.', 401));
    const user = yield User_1.default.create({ firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address });
    if (!user)
        return next((0, customError_1.createCustomError)('Couldn\'t create user', 400));
    res.status(201).json({ status: "Success", data: user });
}));
exports.getUsers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find({ isDeleted: false })
        .populate({ path: "role", select: "roleName" });
    if (!users)
        return next((0, customError_1.createCustomError)('No users found.', 404));
    res.status(200).json({ status: "Success", data: users, results: users.length });
}));
exports.editUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, role, address } = req.body;
    const { id } = req.params;
    console.log("User :", req.user);
    //Finding user
    const userData = yield User_1.default.findOne({ _id: id });
    console.log("user", userData);
    if (password) {
        userData.firstName = firstName;
        userData.lastName = lastName,
            userData.gender = gender,
            userData.dateOfBirth = dateOfBirth,
            userData.email = email,
            userData.password = password,
            userData.mobile = mobile,
            userData.city = city,
            userData.state = state,
            userData.role = role,
            userData.address = address;
    }
    else {
        userData.firstName = firstName;
        userData.lastName = lastName,
            userData.gender = gender,
            userData.dateOfBirth = dateOfBirth,
            userData.email = email,
            userData.mobile = mobile,
            userData.city = city,
            userData.state = state,
            userData.address = address,
            userData.role = role;
    }
    yield userData.save();
    res.status(201).json({ status: "Success", data: userData });
}));
exports.deleteUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };
    try {
        const userDetail = yield User_1.default.updateOne(filter, update);
        console.log("this is userdetail", userDetail);
        res.status(201).json({ massage: "data delete succesfully" });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
}));
exports.getUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const user = yield User_1.default.findOne({ _id: id, isDeleted: false }).select('-__v -password')
        .populate({ path: "role", select: "roleName" });
    if (!user)
        return next((0, customError_1.createCustomError)('No such user found.', 404));
    res.status(200).json({ status: "Success", data: user });
}));
exports.editMe = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const { firstName, lastName, gender, dateOfBirth, email, password, mobile, city, state, address } = req.body;
    const user = yield User_1.default.findOne({ _id: id, isDeleted: false }).select('-__v -password -role');
    if (!user)
        return next((0, customError_1.createCustomError)('No such user found.', 404));
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'mobile', 'profilePhoto', 'city', 'state', 'dateOfBirth', 'lastModifiedBy', 'address', 'gender');
    filteredBody.lastModifiedBy = id;
    if (req.file)
        filteredBody.profilePhoto = req.profilePhotoUrl;
    if (!user.isOnBoarded)
        filteredBody.isOnBoarded = true;
    const updatedUser = yield User_1.default.findByIdAndUpdate(id, filteredBody, {
        new: true,
        runValidators: true
    }).select('-__v -password -role');
    res.status(200).json({ status: "Success", data: updatedUser });
}));
exports.deleteMe = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const filter = { _id: id };
    const update = { $set: { isDeleted: true } };
    try {
        const userDetail = yield User_1.default.updateOne(filter, update);
        console.log("this is userdetail", userDetail);
        res.status(201).json({ message: "data deleted succesfully" });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to delete data" });
    }
}));
exports.createFamilyMember = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile, relation, gender, email, firstName, lastName, dateOfBirth, createdBy } = req.body;
    console.log("User :", req.user);
    let loggedInUser = req.user;
    //Check for required fields 
    if (!(mobile))
        return next((0, customError_1.createCustomError)('Mobile Number is required.', 401));
    let familyMember = {};
    //Check if user exists
    const existingUser = yield User_1.default.findOne({ isDeleted: false, mobile });
    if (existingUser) {
        let existingUserId = existingUser._id;
        familyMember = { relation, profile: existingUserId };
        let { reciprocalRelation, reciprocalGender } = (0, userHelper_1.getReciprocalRelation)(relation, loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.gender);
        let reciprocalFamilymember = { reciprocalRelation, profile: loggedInUser._id };
        loggedInUser.familyTree = [...loggedInUser.familyTree, familyMember];
        existingUser.familyTree = [...existingUser.familyTree, reciprocalFamilymember];
        yield loggedInUser.save({ validateBeforeSave: false });
        yield existingUser.save({ validateBeforeSave: false });
        return res.status(200).json({ status: 'success', message: 'Added family Member successfully', data: loggedInUser });
    }
    const newUser = yield User_1.default.create({ mobile, relation, gender, email, firstName, lastName, dateOfBirth, createdBy: loggedInUser._id });
    if (!newUser)
        return next((0, customError_1.createCustomError)('Couldn\'t create user', 400));
    familyMember = { relation, profile: newUser._id };
    let { reciprocalRelation, reciprocalGender } = (0, userHelper_1.getReciprocalRelation)(relation, loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.gender);
    let reciprocalFamilymember = { reciprocalRelation, profile: loggedInUser._id };
    loggedInUser.familyTree = [...loggedInUser.familyTree, familyMember];
    newUser.familyTree = [...newUser.familyTree, reciprocalFamilymember];
    if (!gender)
        newUser.gender = reciprocalGender;
    if (!createdBy)
        newUser.createdBy = loggedInUser._id;
    console.log("newUser", newUser, loggedInUser._id);
    yield newUser.save();
    yield loggedInUser.save();
    res.status(200).json({ status: "success", message: 'Added family Member successfully', data: loggedInUser });
}));
//Get family members  
exports.getFamilyMembers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let loggedInUser = req.user;
    let familyTree = loggedInUser.familyTree;
    // console.log("familyTree", familyTree, loggedInUser)
    let allFamilyDataArr = [];
    let getRelation;
    for (let i = 0; i < familyTree.length; i++) {
        let outerObj = {};
        if (familyTree[i].profile == familyTree[i].profile) {
            getRelation = familyTree[i].relation;
        }
        let pipeline = [{ $match: { _id: familyTree[i].profile } },
            { $project: { _id: 1, firstName: 1, lastName: 1, documents: 1, profilePhoto: 1 } }
        ];
        let familyMemberData = yield User_1.default.aggregate(pipeline);
        let familyMember = yield User_1.default.findById(familyTree[i].profile)
            .populate("documents", "createdOn");
        let document = familyMember === null || familyMember === void 0 ? void 0 : familyMember.documents;
        if (document) {
            document.sort((a, b) => {
                if (a.createdOn > b.createdOn) {
                    return -1;
                }
                if (a.createdOn < b.createdOn) {
                    return 1;
                }
                return 1;
            });
        }
        // console.log("documents", familyMember, familyTree[i].profile, document)
        let totalDocument;
        let lastUpload;
        if (document) {
            totalDocument = (_b = (_a = familyMemberData[0]) === null || _a === void 0 ? void 0 : _a.documents) === null || _b === void 0 ? void 0 : _b.length;
            lastUpload = (_c = document[0]) === null || _c === void 0 ? void 0 : _c.createdOn;
            (_d = familyMemberData[0]) === null || _d === void 0 ? true : delete _d.documents;
        }
        outerObj.data = familyMemberData[0];
        outerObj.user_relation = getRelation;
        outerObj.no_of_documents = totalDocument;
        outerObj.lastUploaded = lastUpload;
        if (familyMemberData.length !== 0)
            allFamilyDataArr.push(outerObj);
    }
    res.status(200).json({ status: "success", message: 'Getting family Member successfully', data: allFamilyDataArr });
}));
//Get family member
exports.getFamilyMember = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    let loggedInUser = req.user;
    const { id } = req.params;
    let familyTree = loggedInUser.familyTree;
    let getRelation;
    for (let i = 0; i < familyTree.length; i++) {
        if (familyTree[i].profile == id) {
            getRelation = familyTree[i].relation;
        }
    }
    let allFamilyDataArr = [];
    try {
        let outerObj = {};
        let familyMemberData = yield User_1.default.findOne({ _id: id }).select({ _id: 1, firstName: 1, lastName: 1, email: 1, mobile: 1, gender: 1, dateOfBirth: 1, profilePhoto: 1 });
        console.log("familyMemberData", familyMemberData);
        let totalDocument;
        let lastUpload;
        let familyMember = yield User_1.default.findById(id)
            .populate("documents", "createdOn");
        let document = familyMember === null || familyMember === void 0 ? void 0 : familyMember.documents;
        if (document) {
            totalDocument = document.length;
            document.sort((a, b) => {
                if (a.createdOn > b.createdOn) {
                    return -1;
                }
                if (a.createdOn < b.createdOn) {
                    return 1;
                }
                return 1;
            });
        }
        if (document) {
            lastUpload = (_e = document[0]) === null || _e === void 0 ? void 0 : _e.createdOn;
        }
        outerObj.data = familyMemberData;
        outerObj.user_relation = getRelation;
        outerObj.no_of_documents = totalDocument;
        outerObj.lastUploaded = lastUpload;
        allFamilyDataArr.push(outerObj);
    }
    catch (e) {
        console.log("error", e);
    }
    res.status(200).json({ status: "success", message: 'Getting family Member successfully', data: allFamilyDataArr });
}));
//Get family member documents
exports.getFamilyMemberDocuments = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    let { id } = req.params;
    const particulerUser = yield User_1.default.findOne({ isDeleted: false, _id: id });
    let loggedInUser = req.user;
    // console.log("loggedInUser", loggedInUser)
    let allFamilyDataArr = [];
    for (let i = 0; i < ((_f = particulerUser === null || particulerUser === void 0 ? void 0 : particulerUser.documents) === null || _f === void 0 ? void 0 : _f.length); i++) {
        let pipeline = [{ $match: { _id: particulerUser === null || particulerUser === void 0 ? void 0 : particulerUser.documents[i] } },
            { $project: { _id: 1, name: 1, age: 1, gender: 1, lab: 1, createdOn: 1, bioMarker: 1 } }];
        let familyMemberData = yield uploadedDataSchema_1.default.aggregate(pipeline);
        allFamilyDataArr.push(familyMemberData[0]);
    }
    // res.status(200).json({status: "success", message: 'Getting family Member Documents successfully', data:allFamilyDataArr});
    const dummyData = [
        {
            _id: "6406e79209f45809eac328fa",
            name: "Prateek Pawan",
            age: "30",
            gender: "male",
            lab: "Tata 1mg",
            date: "2023-03-09",
            document_image: "https://i.pinimg.com/originals/dc/3f/1b/dc3f1b80aecfff20f0c68be78a461119.jpg",
            bioMarker: [
                {
                    Haemoglobin: {
                        result: "14.741.8",
                        unit: "%",
                        range: "40-50",
                        comments: "Normal"
                    }
                },
                {
                    RBC: {
                        result: "4.67",
                        unit: "fLmillion",
                        range: "83-101",
                        comments: "High"
                    }
                },
            ]
        }
    ];
    res.status(200).json({ status: "success", message: 'Getting family Member Documents successfully', data: dummyData });
}));
// Get all family member document
exports.getAllFamilyMemberDocuments = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let loggedInUser = req.user;
    let familyTree = loggedInUser.familyTree;
    console.log("loggedInUser", loggedInUser);
    let allFamilyDataArr = [];
    for (let i = 0; i < familyTree.length; i++) {
        let outerObj = {};
        let pipeline = [{ $match: { _id: familyTree[i].profile } },
            { $project: { _id: 1, firstName: 1, lastName: 1, documents: 1, profilePhoto: 1 } }
        ];
        //let familyMemberData: any = await User.aggregate(pipeline);
        let familyMember = yield User_1.default.findById(familyTree[i].profile)
            .populate("documents");
        let document = familyMember === null || familyMember === void 0 ? void 0 : familyMember.documents;
        console.log("documents", document);
        for (let j = 0; j < (document === null || document === void 0 ? void 0 : document.length); j++) {
            let pipeline = [{ $match: { _id: document[j]._id } },
                { $project: { _id: 1, name: 1, age: 1, gender: 1, lab: 1, createdOn: 1, link: 1 } }];
            let familyMembersDocuments = yield uploadedDataSchema_1.default.aggregate(pipeline);
            outerObj.data = familyMembersDocuments[0];
            outerObj.abnormilies = 3;
            console.log(outerObj);
            allFamilyDataArr.push(outerObj);
        }
    }
    let dummyObj = [
        {
            data: {
                name: "Prateek Pawan",
                lab: "Tata 1mg",
                report_date: "2023-10-12",
            },
            anomalies: 2,
            profile_image: "https://statinfer.com/wp-content/uploads/dummy-user.png"
        },
        {
            data: {
                name: "Prateek Pawan",
                lab: "Tata 1mg",
                report_date: "2023-10-11",
            },
            anomalies: 3,
            profile_image: "https://statinfer.com/wp-content/uploads/dummy-user.png"
        },
        {
            data: {
                name: "Prateek Pawan",
                lab: "Tata 1mg",
                report_date: "2023-10-10",
            },
            anomalies: 4,
            profile_image: "https://statinfer.com/wp-content/uploads/dummy-user.png"
        }
    ];
    res.status(200).json({ status: "success", message: 'Getting family Member successfully', data: dummyObj });
}));
exports.addReminder = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { reminderType, title, description, reminderCategory, repeatInterval, createdOn, reminderTime, reminderDate } = req.body;
    user.reminders = [...user.reminders, { title, description, reminderCategory, reminderType, repeatInterval, createdOn,
            reminderDate, reminderTime }];
    yield user.save();
    res.status(200).json({ status: 'success', message: 'Reminder added successfully', data: user.reminders });
}));
exports.getReminders = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(200).json({ status: 'success', data: user.reminders });
}));
// vitals
exports.addVitals = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { vitalType, date, unit, value, createdOn } = req.body;
    user.vitals = [...user.vitals, { vitalType, date, unit, value, createdOn }];
    yield user.save();
    res.status(200).json({ status: 'success', message: 'Vitals added successfully', data: user.vitals });
}));
exports.getVitals = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(200).json({ status: 'success', data: user.vitals });
}));
// BioMarker graph
exports.bioMarkerGraph = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { biomarker } = req.params;
    let loggedInUser = req.user;
    // let familyTree = loggedInUser.familyTree
    console.log("loggedInUser", loggedInUser);
    let allFamilyDataArr = [];
    let familyMember = yield User_1.default.findById(loggedInUser._id)
        .populate({
        path: "documents",
        select: "createdOn bioMarker.Haemoglobin"
    });
    let document = familyMember === null || familyMember === void 0 ? void 0 : familyMember.documents;
    console.log("documents", document);
    const dummyObj = [
        {
            x: "2023-03-09",
            y: 14.741
        },
        {
            x: "2023-03-10",
            y: 16.741
        },
        {
            x: "2023-03-11",
            y: 18.741
        }
    ];
    res.status(200).json({ status: "success", message: 'Getting cordinate successfully', data: dummyObj });
}));
exports.allBioMarkers = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let loggedInUser = req.user;
    // let familyTree = loggedInUser.familyTree
    console.log("loggedInUser", loggedInUser);
    let allBioMarkerArr = [];
    let familyMember = yield User_1.default.findById(loggedInUser._id)
        .populate({
        path: "documents",
        select: "createdOn bioMarker"
    });
    let document = familyMember === null || familyMember === void 0 ? void 0 : familyMember.documents;
    console.log("documents", document);
    for (let i = 0; i < document.length; i++) {
        let biomarkers = document[i].bioMarker;
        for (let j = 0; j < biomarkers.length; j++) {
            let biomarkerKey = Object.keys(biomarkers[j])[0];
            allBioMarkerArr.push(biomarkerKey);
        }
    }
    let uniqueArr = [...new Set(allBioMarkerArr)];
    res.status(200).json({ status: "success", message: 'Getting family Member successfully', data: uniqueArr });
}));
exports.mostRecentGraph = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let loggedInUser = req.user;
    // let familyTree = loggedInUser.familyTree
    console.log("loggedInUser", loggedInUser);
    let allBioMarkerArr = [];
    let familyMember = yield User_1.default.findById(loggedInUser._id)
        .populate({
        path: "documents",
        select: "createdOn bioMarker"
    });
    let document = familyMember === null || familyMember === void 0 ? void 0 : familyMember.documents;
    console.log("documents", document);
    document.sort((a, b) => {
        if (a.createdOn > b.createdOn) {
            return -1;
        }
        if (a.createdOn < b.createdOn) {
            return 1;
        }
        return 1;
    });
    // req.params.biomarker = document[0].bioMarker[0];
    req.params.biomarker = "Heamogloblin";
    // let dummyObj = [
    //     "Haemoglobin",
    //     "RBC",
    //     "Mean Corpuscular Volume",
    //     "Mean Corpuscular Hemoglobin",
    //     "Hematocrit",
    //     "Mean Platelet Volume",
    //     "Neutrophils",
    //     "Hemoglobin",
    //     "White Blood Cell count",
    //     "Platelet count",
    //     "Red Cell Distribution Width",
    //     "PLATELETS"
    // ]
    // res.status(200).json({status: "success", message: 'Getting most recent biomarker successfully', data:document[0].bioMarker});
    // res.status(200).json({status: "success", message: 'Getting most recent biomarker successfully', data: dummyObj});
    next();
}));
//Only allow access to creator and authenticated user id.
//canNotWrite: ['Shanu\'s objectid', 'Vimla\'s objectid']; 
//Patch family members
//Delete family members
//Upload for family
//if family member's object id is not in cannotWrite, allow else error permissions not given.
