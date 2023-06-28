import mongoose from "mongoose";

const userSchema = mongoose.Schema({
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
    FNAME:{
        required: true,
        type: String,
        trim: true
    },
    LNAME:{
        required: true,
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
    HKID_NO:{
        required: true,
        type: String,
        trim: true
    },
    PHONE_NO:{
        required: true,
        type: String,
        trim: true
    },
    ADDRESS:{
        required: false,
        type: String,
        trim: true
    },
    BIRTH_DATE:{
        required: true,
        type: Date,
        trim: true
    }
});

const User = mongoose.model("User", userSchema, 'MAS_USER_INFO');

module.exports = User;