
const cloudinary = require("cloudinary").v2; 
const fileCollection = require("../models/file");

const localImgUpload = (req,resp) => {
    try{
        //assuming that file is sent in the request in file key.
        const file = req.files.file;
        console.log(req.files.file.name);
        const extension = req.files.file.name.split(".")[-1];
        console.log(extension);
        //path to store file locally on the server
        const path = __dirname + "/files/" + req.body.email +"_"+ Date.now() + "." + extension;
    
        file.mv(path, (error) => {
            if(error){
                resp.status(500).json({
                    success: false,
                    message:"Error while uploading file."+ error
                })
            }else{
                resp.status(200).json({
                    success: true,
                    message:"File uploaded successfully."
                })
            }
        })
    }catch(error){
        resp.status(500).json({
            success:false,
            message:"File not uploaded."
        })
    }
}

// const auth = require("../middlewares/Auth.js");

//controller for uploading image on cloudinary
const cloudUpload = async (req,resp) => {
    try{
        const email = req.body.user.email;
        const tags = req.body.tags;
        const file = req.files.file;
        const extension = file.name.split(".")[1];
        const allowed_types = ["jpg","jpeg","png","mp4"];
        console.log(allowed_types.includes(file.name.split(".")[1]));
        if(!allowed_types.includes(extension)){
            resp.status(404).json({
                message:"File type not supported by this route.",
                success:false
            })
        }
        //limiting the file size upto 10MB
        if(file.bytes >= 10*Math.pow(2,20)){
            resp.status(404).json({
                message: "Size Limit exceeded",
                success: false
            })
        }
        //upload if file type is supported.
        //response of the upload will contain url(for http request), secure_url(for https request)
        const rtype = (extension == "mp4") ? 'video' : 'image';
        const options = {
            folder : email,
            resource_type : rtype
        }
        console.log(file.tempFilePath)
        const cloudResponse = await cloudinary.uploader.upload(file.tempFilePath,options);
        // console.log(cloudResponse);

        if(cloudResponse){
            try{
                const insert = await fileCollection.create({email: email,tags:tags,url:cloudResponse.secure_url})
            }catch(error){
                resp.status(500).json({
                    message:"Error while creating document in file database",
                    success:true
                })
            }
            resp.status(200).json({
                message: "File uploaded on cloudinary",
                success: true,
                data :cloudResponse.secure_url
            })
        }
        else{
            resp.status(500).json({
                message:"Error while uploading on cloudinary",
                success:false
            })
        }
    }catch(error){
        resp.status(500).json({
            message:"Error Occured",
            success:false
        })
    }
}

module.exports = {localImgUpload,cloudUpload};


// const obj = {
//     name : "Kshitiz",
//     rollnumber : 53,
//     marks : 100
// }
// let token = "dhsdihhd.skdsknkjsdn.idsidsndnkiu";
// fetch("http://localhost:3000/history",{
//     method:"post",
//     headers : {
//         "Authentication" : `Bearer ${token}`
//     },
//     body: JSON.stringify(obj)
// }).then((resp)=>resp.json())
// .catch((err)=>console.log(err));