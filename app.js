require("dotenv").config();
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const error = require("./middlewares/errorMidddleware");
const bodyParser = require("body-parser");
const app = express();
const response = require("./utils/responseObject");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const todoRoutes = require("./routes/todo");
const { NOTFOUND } = require("./constants/statusCodes");

app.use(cors());
app.use(
  morgan("combined", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Happy Whale");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/todo", todoRoutes);
app.use("*", (req, res) => {
  console.log(req);
  res.status(NOTFOUND).json(
    response({
      message: `the following endpoint ${req.originalUrl} is not found. `,
      status: NOTFOUND,
      success: false,
      data: {},
    })
  );
});

app.use(error);
module.exports = app;
