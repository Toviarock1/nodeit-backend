const express = require("express");
const route = express();
const { getUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

route.get("/profile", [authMiddleware], getUser);

module.exports = route;
