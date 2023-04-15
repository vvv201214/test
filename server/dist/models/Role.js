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
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const roleSchema = new mongoose_1.default.Schema({
    roleName: {
        type: String,
        required: true
    },
    reportAccess: {
        type: Boolean,
        default: false,
        required: true
    },
    userAccess: {
        type: Boolean,
        default: false,
        required: true
    },
    attributesAccess: {
        type: Boolean,
        default: false,
        required: true
    },
    analyticsAccess: {
        type: Boolean,
        default: false,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now(),
        required: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedOn: {
        type: Date,
        // required : true
    },
    lastModifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        // required : true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        // required : true
    },
    status: {
        type: String,
        default: 'Active',
        required: true
    },
    uid: {
        type: String,
        // required : true
    }
});
roleSchema.pre('save', function (next) {
    if (!this.uid) {
        this.uid = (0, uuid_1.v4)();
        return next();
    }
    ;
    next();
});
roleSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.createdBy) {
            this.createdBy = this._id;
        }
        if (!this.lastModifiedBy) {
            this.lastModifiedBy = this._id;
        }
        this.lastModifiedOn = Date.now();
        console.log(this.lastModifiedOn);
        next();
    });
});
const role = mongoose_1.default.model("Role", roleSchema);
exports.default = role;
