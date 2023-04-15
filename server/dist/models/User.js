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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        // required: true
    },
    lastName: {
        type: String,
        // required : true
    },
    email: {
        type: String,
        // required : true
    },
    mobile: {
        type: String,
        // required : true
    },
    authId: String,
    gender: {
        type: String,
        // required : true
    },
    dateOfBirth: {
        type: Date,
        // required : true
    },
    height: Number,
    weight: Number,
    city: {
        type: String,
        // required : true
    },
    state: {
        type: String,
        // required : true
    },
    aadhaarCardNumber: {
        type: Number,
        // required : false
    },
    password: {
        type: String,
        required: false
    },
    passwordChangedAt: {
        type: Date,
        required: false
    },
    otp: {
        type: Number,
        required: false
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        default: Object('63cc2464c60a8373837d3235'),
        required: false
    },
    createdOn: {
        type: Date,
        default: Date.now(),
        // required : true
    },
    profilePhoto: String,
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        // required : true
    },
    lastModifiedOn: {
        type: Date,
        // required : true
    },
    lastModifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        // required : true
    },
    uid: {
        type: String,
        // default: false,
        // required : true
    },
    referralCode: String,
    referredBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    jeevanKhataId: {
        type: String,
        // required : true
    },
    address: {
        type: String,
        // required : true
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    documents: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'uploadedData' }],
    familyTree: [{
            relation: {
                type: String,
            },
            profile: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
            }
        }],
    reminders: [
        {
            reminderId: { type: String, default: (0, uuid_1.v4)() },
            title: String,
            description: String,
            reminderType: {
                type: String,
                enum: ['recurring', 'one-time']
            },
            createdOn: {
                type: Date,
                default: Date.now()
            },
            reminderCategory: String,
            reminderDate: Date,
            reminderTime: Date,
            repeatInterval: {
                type: String,
            },
            lastModifiedOn: Date,
        }
    ],
    vitals: [
        {
            vitalsId: { type: String, default: (0, uuid_1.v4)() },
            vitalType: String,
            value: String,
            date: String,
            createdOn: {
                type: Date,
                default: Date.now()
            },
            unit: String,
        }
    ]
});
//check password
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
//check if password has changed after issuing the token 
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);
        return jwtTimeStamp < changedTimeStamp;
    }
    return false;
};
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        this.lastModifiedOn = Date.now();
        this.uid = (0, uuid_1.v4)();
        return next();
    }
    ;
    this.lastModifiedOn = Date.now();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.pre('save', function (next) {
    console.log("in the presave", this._id);
    if (!this.createdBy) {
        this.createdBy = this._id;
        return next();
    }
    ;
    next();
});
userSchema.pre('findOneAndUpdate', function (next) {
    this.set({ lastModifiedOn: Date.now() });
    next();
});
//Hashing user password  
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    });
});
//Adding the jk id before saving
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.jeevanKhataId || this.isNew) {
            const count = yield user.countDocuments();
            const userId = "JK" + (count + 1).toString().padStart(8, "0");
            this.jeevanKhataId = userId;
            next();
        }
        next();
    });
});
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const user = mongoose_1.default.model("User", userSchema);
exports.default = user;
// TODO : role not updating in role, modifiedby createdby not updating,
// length for unit and biomarker, infinity loop in post middleware
