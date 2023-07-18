import mongoose from "mongoose";

const clinicDoctorSchema = mongoose.Schema({
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
    SERVICES:{
        required: false,
        type: String,
        trim: true
    },
    QUALIFICATIONS:{
        required: false,
        type: String,
        trim: true
    },
    IMAGE_PATH:{
        required: false,
        type: String,
        trim: true
    }
});

const ClinicDoctor = mongoose.model("ClinicDoctor", clinicDoctorSchema, 'MAS_CLINIC_DOCTOR_INFO');

module.exports = ClinicDoctor;