const express = require("express");
const route = express();
const {
  createProject,
  getProjects,
  updateProjects,
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");

route.post("/create", [authMiddleware], createProject);
route.get("/user-project", [authMiddleware], getProjects);
route.post("/update/:projectId", [authMiddleware], updateProjects);

module.exports = route;
