const mongoose = require("mongoose");
const transporter = require("../config/nodemailer");

const schema = new mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required:true
    }
})

schema.post('save', (doc) => {
    const options = {
        from : "Nodemailer",
        to : doc.email,
        subject:"You just became a member!",
        text : "This id was used to create an account on our file handling system(HandleOnCloud).In case if used without your consent, contact us for removal.",
    }
    const Info = transporter.sendMail(options,(error,info)=>{
        if(error){
            console.log("Error Occured while sending email : ",error);
        }
        else{
            console.log("Email sent : ",info);
        }
    })
})

module.exports = mongoose.model("user",schema);