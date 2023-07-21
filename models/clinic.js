import mongoose from "mongoose";

const clinicSchema = mongoose.Schema({
    _id:{
        required: true,
        type: String,
        trim: true
    },
    WALLET_ADDRESS:{
        required: false,
        type: String,
        trim: true
    },
    KEY:{
        required: false,
        type: String,
        trim: true
    },
    EMAIL:{
        required: true,
        type: String,
        trim: true
    },
    PASSWORD:{
        required: true,
        type: String,
        trim: true
    },
    AREA:{
        required: true,
        type: String,
        trim: true
    },
    DISTRICT:{
        required: true,
        type: String,
        trim: true
    },
    ADDRESS:{
        required: true,
        type: String,
        trim: true
    },
    NAME:{
        required: true,
        type: String,
        trim: true
    },
    PHONE_NO:{
        required: true,
        type: String,
        trim: true
    },
    OPENING_HRS:{
        required: false,
        type: String,
        trim: true
    },
    IMAGE_PATH:{
        required: false,
        type: String,
        trim: true
    },
    ACTIVE:{
        required: true,
        type: String,
        trim: true
    },
    VERIFIED:{
        required: true,
        type: String,
        trim: true
    }
});

const Clinic = mongoose.model("Clinic", clinicSchema, 'MAS_CLINIC_INFO');

module.exports = Clinic;