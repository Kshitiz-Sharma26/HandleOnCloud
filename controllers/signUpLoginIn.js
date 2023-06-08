const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const email_validator = require("deep-email-validator"); 
const users = require("../models/user");

require("dotenv").config();

const signUp = async (req,resp) =>{
    try{
        const {name,email,password} = req.body;
        //validating email using deep-email-validator
        const emailValid = await email_validator.validate(email);
        if(emailValid.valid == false){
            resp.status(404).json({
                message:"Email passed is not valid",
                succes:false
            })
            return;
        }
        const exists = await users.findOne({email});
        if(exists == null){
            let hashedPassword;
            try{
                hashedPassword = await bcrypt.hash(password,10);
            }
            catch(error){
                resp.status(500).json({
                    message:"Error while Hashing",
                    data:{},
                    success:false
                })
            }
            users.create({
            name:name,email:email,password:hashedPassword
            })
            resp.status(200).json({
            message:"Id Created",
            data:{name,email,hashedPassword},
            success:true
            })
        }
        else{
            resp.status(400).json({
                message:"Already Exists",
                success:false
            })
        }
    }   
    catch(error){
        resp.status(500).json({
            message: "Inernal Error",
            success:false,
            data: {}
        })
    } 
}

const login = async (req,resp) => {
try{
    const { email,password } = req.body;
    if(!email || !password){
        resp.status(400).json({
            message:"Empty string passed",
            success:false
        })
    }

    const exists = await users.findOne({email});
    
    if(exists !== null){
        try{
            const found = await bcrypt.compare(password,exists.password);
            if(found){
                const expiry = "60m";
                const signature = jwt.sign({
                    email : exists.email,
                    id : exists._id
                },process.env.JWT_SECRET,{expiresIn : expiry});

                const options = {
                    //expires in 1 hr from now
                    expiresIn : new Date(Date.now() + 60*60*1000),
                    httpOnly:true
                }
                exists.password = undefined;
                // exists.token = signature;
                resp.cookie("token",signature,options).status(200).json({
                    message:"Entry Verified",
                    succes:true,
                    data :{
                        user : exists,
                        token : signature
                    }
                })
            }
            else{
                resp.status(400).json({
                    message:"Wrong Password",
                    succes:false
                })
            }
        }
        catch(error){
            resp.status(500).json({
                message:"Error while comparing password in Database or generating token",
                success:false
            })
        }
    }
    else{
        resp.status(500).json({
            success:false,
            message:"Email not in Database"
        })
    }       
}   
catch(error){
    resp.status(500).json({
        message: "Inernal Error",
        success:false,
        data: {}
    })
} 
}

// module.exports = {login};
module.exports = { login,signUp };