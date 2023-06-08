const fileCollection = require("../models/file");

const access = async (req,resp) => {
    try{
        
        const email = req.body.user.email;
        const urls = await fileCollection.find({email:email},{email:0});
        
        resp.status(400).json({
            data:urls,
            message:"Cloud files fetched successfully."
        })
    }catch(error){
        resp.status(500).json({
            message:"Error while Fetching uploaded files.",
            success : false
        })
    }

}

module.exports = access;