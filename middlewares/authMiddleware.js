const jwt = require("jsonwebtoken");
const { FORBIDEN, BAD_REQUEST } = require("../constants/statusCodes");
const response = require("../utils/responseObject");

module.exports = function (req, res, next) {
  const token = req.header("authorization") || req.header("Authorization");
  // console.log(req.header("authorization"));
  if (!token)
    return res.status(FORBIDEN).json(
      response({
        message: "access denied",
        status: FORBIDEN,
        success: false,
        data: {},
      })
    );
  try {
    const onlyToken = token.split(" ")[1];
    const dateNow = new Date();
    const decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
    if (decoded.exp < dateNow.getTime() / 1000) {
      res.status(FORBIDEN).json(
        response({
          message: "token expired",
          status: FORBIDEN,
          success: false,
          data: {},
        })
      );
    }
    req.user = decoded;
    // console.log("user", decoded);
    next();
  } catch (err) {
    res.status(BAD_REQUEST).json(
      response({
        message: "invalid token supply",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }
};
