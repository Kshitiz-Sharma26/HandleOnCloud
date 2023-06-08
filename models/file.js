const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    tags:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("file",schema);

