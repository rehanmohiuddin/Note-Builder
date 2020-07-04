const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
    code:{
    type:String,
    trim:true,
    required:true,
    maxlengtn:32,
    unique:true,
    }
},
{timestamps:true}
);

module.exports = mongoose.model("code",codeSchema);