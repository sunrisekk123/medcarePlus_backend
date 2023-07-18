import mongoose from "mongoose";

const appointmentDiagnosisSchema = mongoose.Schema({
    _id:{
        required: true,
        type: String,
        trim: true
    },
    CLINIC_WALLET_ADDRESS:{
        required: false,
        type: String,
        trim: true
    },
    USER_WALLET_ADDRESS:{
        required: true,
        type: String,
        trim: true
    },
    DOCTOR_ID:{
        required: true,
        type: String,
        trim: true
    },
    DATE:{
        required: true,
        type: Date,
        trim: true
    },
    TIME:{
        required: true,
        type: String,
        trim: true
    },
    RECORDS:{
        required: true,
        type: String,
        trim: true
    },
    REMARKS:{
        required: false,
        type: String,
        trim: true
    }
});

const AppointmentDiagnosis = mongoose.model("AppointmentDiagnosis", appointmentDiagnosisSchema, 'MAS_APPOINTMENT_DIA_INFO');

module.exports = AppointmentDiagnosis;