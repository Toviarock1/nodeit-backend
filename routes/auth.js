const express = require("express");
const route = express();
const { login, register } = require("./../controllers/authController");

route.post("/login", login);
route.post("/register", register);

module.exports = route;
