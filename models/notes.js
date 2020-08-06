const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        maxlength:100,
    },
    description:{
        type:String,
        trim:true,
        required:true,
        maxlength:20000,
    },
    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    }

},
{timestamps:true}
)
module.exports=mongoose.model("Notes",noteSchema);