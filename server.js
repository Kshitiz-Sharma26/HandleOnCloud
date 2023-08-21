const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(cookieParser());

//Middlewares
// populates req.body with json data 
app.use(express.json());
//populates req.files and used for created temp directory to save files uploaded by client.
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));

const port = process.env.PORT || 3000;

//connect to the database
const dbConnect = require("./config/database");
dbConnect();

//configuring cloudinary
const cloudConfig = require("./config/cloudinary");
cloudConfig();

//mounting routes
const upload = require("./routes/fileUpload");
app.use("/api/v1/upload",upload);

//for signUp and logIn
const signUp = require("./routes/signUplogIn");
app.use("/api/v1",signUp);

//for accessing files
const access = require("./routes/accessFiles.js");
app.use("/api/v1",access);

app.listen(port, ()=>{
    console.log("Server Listening at port ",port);
})