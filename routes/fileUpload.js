const express = require("express");
const r = express.Router();


//middleware for access of uploading to a particular id
const auth = require("../middlewares/Auth");

//controller for handling upload operation
const {localImgUpload,cloudUpload} = require("../controllers/fileUpload")

r.post("/localImgUpload",localImgUpload);
r.post("/cloudUpload",auth,cloudUpload);
module.exports = r;