import mongoose from "mongoose";

const districtSchema = mongoose.Schema({
    _id:{
        required: true,
        type: String,
        trim: true
    },
    AREA:{
        required: false,
        type: String,
        trim: true
    },
    DISTRICT:{
        required: true,
        type: String,
        trim: true
    }
});

const District = mongoose.model("District", districtSchema, 'MAS_DISTRICT_LIST');

module.exports = District;