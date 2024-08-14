const express = require("express");
const route = express();
const {
  createProject,
  getProjects,
  updateProjects,
  deleteProjects,
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");

route.post("/create", [authMiddleware], createProject);
route.get("/user-project", [authMiddleware], getProjects);
route.patch("/update/:projectId", [authMiddleware], updateProjects);
route.delete("/delete/:projectId", [authMiddleware], deleteProjects);

module.exports = route;
