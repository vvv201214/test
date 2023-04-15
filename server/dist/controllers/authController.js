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
exports.resetPassword = exports.forgotPassword = exports.isTokenValid = exports.getUserDetailAfterRefresh = exports.protect = exports.logout = exports.signup = exports.googleLogin = exports.externalLogin = exports.phoneLogin = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const customError_1 = require("../errors/customError");
const authUtil_1 = require("../utils/authUtil");
const CatchAsync_1 = __importDefault(require("../middlewares/CatchAsync"));
const crypto_1 = __importDefault(require("crypto"));
;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email)
        return next((0, customError_1.createCustomError)('Username or email needed', 401));
    if (!password)
        return next((0, customError_1.createCustomError)('Password is needed', 401));
    const user = yield User_1.default.findOne({
        email: email
    });
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next((0, customError_1.createCustomError)('Incorrect email or password', 401));
    }
    const token = (0, authUtil_1.signToken)(String(user._id));
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        token,
        data: user,
    });
});
exports.login = login;
const phoneLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile, authId } = req.body;
    let user;
    if (!mobile) {
        return next((0, customError_1.createCustomError)('Enter a valid phone number', 404));
    }
    user = yield User_1.default.findOne({ mobile });
    if (!user) {
        user = yield User_1.default.create({ mobile, authId });
        const token = (0, authUtil_1.signToken)(String(user._id));
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(201).json({
            status: 'success',
            token,
            isNew: true || !user.isOnBoarded,
            data: user,
        });
    }
    else {
        const token = (0, authUtil_1.signToken)(String(user._id));
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(200).json({
            status: 'success',
            token,
            isNew: false || !user.isOnBoarded,
            data: user,
        });
    }
});
exports.phoneLogin = phoneLogin;
const externalLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authId } = req.body;
    let user;
    if (!authId) {
        return next((0, customError_1.createCustomError)('Enter a valid phone number', 404));
    }
    user = yield User_1.default.findOne({ authId });
    if (!user) {
        user = yield User_1.default.create({ authId });
        const token = (0, authUtil_1.signToken)(String(user._id));
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(201).json({
            status: 'success',
            token,
            isNew: true,
            data: user,
        });
    }
    else {
        const token = (0, authUtil_1.signToken)(String(user._id));
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(200).json({
            status: 'success',
            token,
            isNew: false,
            data: user,
        });
    }
});
exports.externalLogin = externalLogin;
const googleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authId, email, firstName, lastName, profilePhoto } = req.body;
    let user;
    if (!email) {
        return next((0, customError_1.createCustomError)('Email is required', 401));
    }
    user = yield User_1.default.findOne({ email });
    if (!user) {
        user = yield User_1.default.create({ authId, email, firstName, lastName, profilePhoto });
        const token = (0, authUtil_1.signToken)(String(user._id));
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(201).json({
            status: 'success',
            token,
            isNew: true || !user.isOnBoarded,
            data: user,
        });
    }
    else {
        if (!user.profilePhoto) {
            user.profilePhoto = profilePhoto;
        }
        user.authId = authId;
        yield user.save({ validateBeforeSave: false });
        const token = (0, authUtil_1.signToken)(String(user._id));
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === 'production',
            // httpOnly: true,
        });
        res.status(200).json({
            status: 'success',
            token,
            isNew: false || !user.isOnBoarded,
            data: user,
        });
    }
});
exports.googleLogin = googleLogin;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, passwordConfirm, mobile, firstName, lastName } = req.body;
    if (yield User_1.default.findOne({ email }))
        return next((0, customError_1.createCustomError)('User already exists. Please log in.', 400));
    const newUser = yield User_1.default.create({
        email,
        password,
        firstName,
        lastName,
        mobile,
        isOnBoarded: true
    });
    const token = (0, authUtil_1.signToken)(String(newUser._id));
    res.status(200).json({
        status: 'success',
        token,
        data: newUser,
    });
});
exports.signup = signup;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("jwt", { path: "/" });
    res
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
});
exports.logout = logout;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // console.log((req ))
        if (req.cookies) {
            if (req.cookies.jwt)
                token = req.cookies.jwt;
        }
        if (!token)
            return next((0, customError_1.createCustomError)('You are not logged in. Please log in to continue.', 401));
        const decoded = yield (0, authUtil_1.promisifiedVerify)(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const freshUser = yield User_1.default.findById(decoded._id);
        if (!freshUser) {
            return next((0, customError_1.createCustomError)('User no longer exixts.', 401));
        }
        if (freshUser.changedPasswordAfter(decoded.iat)) {
            return next((0, customError_1.createCustomError)('Password was changed. Log in again.', 401));
        }
        req.user = freshUser;
        req.token = token;
        next();
    }
    catch (e) {
        throw new Error();
    }
});
exports.protect = protect;
const getUserDetailAfterRefresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("req is", req)
    let user = req.user._doc;
    let token = req.token;
    res.status(200).json({
        status: 'success',
        data: Object.assign(Object.assign({}, user), { token }),
    });
    // res.json(req);
});
exports.getUserDetailAfterRefresh = getUserDetailAfterRefresh;
const isTokenValid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token)
            return res.json(false);
        const decoded = yield (0, authUtil_1.promisifiedVerify)(token, process.env.JWT_SECRET);
        if (!decoded)
            return res.json(false);
        const freshUser = yield User_1.default.findById(decoded._id);
        if (!freshUser)
            return res.json(false);
        res.json(true);
    }
    catch (e) {
        return next(e.message);
    }
});
exports.isTokenValid = isTokenValid;
exports.forgotPassword = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on POSTed email
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next((0, customError_1.createCustomError)('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        // await new Email(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next((0, customError_1.createCustomError)('There was an error sending the email. Try again later!', 500));
    }
}));
exports.resetPassword = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield User_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next((0, customError_1.createCustomError)('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const token = (0, authUtil_1.signToken)(String(user._id));
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        token,
        data: user,
    });
}));
