const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req,resp,next) => {
    try{
        // console.log(req.cookies.token);
        // const token = req.header("Authentication").replace("Bearer ","");
        const token = req.cookies.token;
        if(!token){
            resp.status(404).json({
                message: "Token Missing",
                success: false
            })
        }
        try{
            const verified = jwt.verify(token , process.env.JWT_SECRET);
            console.log(verified);
            req.body.user = verified; 
        }catch(error){
            resp.status(500).json({
                message: "token couldn't be verified",
                success:false
            })
            
        }
        next();
    }catch(error){
        resp.status(500).json({
            message:"Error During Authentication"
        })
    }
}

module.exports = auth;