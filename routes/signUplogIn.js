const express = require("express");

const r = express.Router();

const {signUp,login} = require("../controllers/signUpLoginIn");

r.post("/signUp" , signUp);
r.post('/logIn', login);

module.exports = r;
