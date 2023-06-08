const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASEFILE_URL, {useNewUrlParser : true,useUnifiedTopology : true}).then(()=>{
        console.log("Connection established with file database.");
    }).catch((err)=>{
        console.log(`Error ${err} while connecting with file database`);
    })
}

module.exports = dbConnect;