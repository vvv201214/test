import mongoose, { Schema } from "mongoose";


const uploadSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    discription:{
        type: String,
        // required : true
    },
    price:{
        type: String,
        // required: true
    },
    currency:{
        type: String,
        // required: true
    },
    link:{
        type: String,
        required: true
    }

})


const labTest = mongoose.model("test", uploadSchema);
export default labTest;