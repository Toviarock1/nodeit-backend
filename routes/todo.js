const express = require("express");
const route = express();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

route.post("/create", [authMiddleware], createTodo);
route.get("/project-todos/:projectid", [authMiddleware], getTodos);
route.patch("/update", [authMiddleware], updateTodo);
route.delete("/delete/:todoid", [authMiddleware], deleteTodo);

module.exports = route;
