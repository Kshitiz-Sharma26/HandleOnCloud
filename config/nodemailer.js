const nodemailer = require("nodemailer");

require("dotenv").config();

const username = process.env.USER;
const password = process.env.PASSWORD;

console.log(username,password);
const transport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    auth:{user:username,pass:password},
});
    // return transporter;

module.exports = transport;