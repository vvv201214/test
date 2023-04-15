"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReciprocalRelation = void 0;
function getReciprocalRelation(relation, gender) {
    var _a, _b;
    const relationsMap = {
        mother: {
            gender: 'female',
            female: 'daughter',
            male: 'son'
        },
        father: {
            gender: 'male',
            female: 'daughter',
            male: 'son'
        },
        daughter: {
            gender: 'female',
            female: 'mother',
            male: 'father'
        },
        son: {
            gender: 'male',
            female: 'mother',
            male: 'father'
        },
        grandfather: {
            gender: 'male',
            female: 'granddaughter',
            male: 'grandson'
        },
        grandmother: {
            gender: 'female',
            female: 'granddaughter',
            male: 'grandson'
        },
        grandson: {
            gender: 'male',
            female: 'grandmother',
            male: 'grandfather',
        },
        granddaughter: {
            gender: 'female',
            female: 'grandmother',
            male: 'grandfather',
        },
        aunt: {
            gender: 'female',
            female: 'neice',
            male: 'nephew'
        },
        uncle: {
            gender: 'male',
            female: 'neice',
            male: 'nephew'
        },
        'mother-in-law': {
            gender: 'female',
            female: 'daughter-in-law',
            male: 'son-in-law',
        },
        'father-in-law': {
            gender: 'male',
            female: 'daughter-in-law',
            male: 'son-in-law',
        },
        'brother-in-law': {
            gender: 'male',
            male: 'brother-in-law',
            female: 'sister-in-law'
        },
        'sister-in-law': {
            gender: 'female',
            male: 'brother-in-law',
            female: 'sister-in-law'
        }
    };
    const reciprocalRelation = (_a = relationsMap[relation]) === null || _a === void 0 ? void 0 : _a[gender];
    const reciprocalGender = (_b = relationsMap[relation]) === null || _b === void 0 ? void 0 : _b.gender;
    return { reciprocalRelation: reciprocalRelation || 'family Member', reciprocalGender: reciprocalGender || 'others' };
}
exports.getReciprocalRelation = getReciprocalRelation;
