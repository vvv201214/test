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
const unitSchema = new mongoose_1.default.Schema({
    unitFullName: {
        type: String,
        required: true
    },
    unitId: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        // required: true
    },
    createdOn: {
        type: Date,
        default: Date.now(),
        required: true
    },
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
        // required : true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    },
    status: {
        type: String,
        default: 'Active',
        required: true
    },
    unitConversion: [{
            unitConversionFullName: {
                type: String,
                // required : true
            },
            unitConversionId: {
                type: String,
                // required : true
            },
            value: {
                type: Number,
                // required : true
            },
            id: {
                type: String,
                // required : true
            },
            created_On: {
                type: Date,
                default: Date.now(),
                // required : true
            },
            created_By: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                // required : true
            },
            lastModified_On: {
                type: Date,
                // required : true
            },
            lastModified_By: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                // required : true
            },
            is_Deleted: {
                type: Boolean,
                default: false,
                // required : true
            },
            bioMarkers: {
                type: String,
                // required : true
            }
        }]
});
unitSchema.pre('save', function (next) {
    if (!this.uid) {
        // this.lastModifiedOn = Date.now();
        this.uid = (0, uuid_1.v4)();
        const random6DigitNumber = Math.floor(Math.random() * 900000) + 100000;
        if (this.unitConversion[0]) {
            this.unitConversion[0].id = (0, uuid_1.v4)() + random6DigitNumber;
        }
        return next();
    }
    ;
    // this.lastModifiedOn = Date.now();
    next();
});
//   roleSchema.pre('save', async function(next){
//     if(!this.createdBy){
//         this.createdBy = this._id;
//     }
//     if(!this.lastModifiedBy){
//         this.lastModifiedBy = this._id;
//     }
//     (this as any).lastModifiedOn = Date.now();
//     next();
// });
unitSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.createdBy) {
            this.createdBy = this._id;
        }
        if (!this.lastModifiedBy) {
            this.lastModifiedBy = this._id;
        }
        this.lastModifiedOn = Date.now();
        this.unitConversion.map((elem) => {
            elem.created_By = this._id;
            elem.lastModified_By = this._id;
            elem.lastModified_On = elem.created_On;
        });
        next();
    });
});
const unit = mongoose_1.default.model("Unit", unitSchema);
exports.default = unit;
