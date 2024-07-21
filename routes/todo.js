const express = require("express");
const route = express();
const authMiddleware = require("../middlewares/authMiddleware");
const { createTodo } = require("../controllers/todoController");

route.post("/create", [authMiddleware], createTodo);

module.exports = route;
