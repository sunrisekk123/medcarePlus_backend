import mongoose from "mongoose";

const clinicLangSchema = mongoose.Schema({
    _id:{
        required: true,
        type: String,
        trim: true
    },
    CLINIC_ID:{
        required: false,
        type: String,
        trim: true
    },
    NAME:{
        required: true,
        type: String,
        trim: true
    },
    ADDRESS:{
        required: false,
        type: String,
        trim: true
    }
});

const ClinicLang = mongoose.model("ClinicLang", clinicLangSchema, 'MAS_CLINIC_LANG');

module.exports = ClinicLang;