const express = require("express");

const r = express.Router();
const accessController = require("../controllers/Access");
const auth = require("../middlewares/Auth");

r.get("/access",auth,accessController);

module.exports = r;