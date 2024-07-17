const { OK, BAD_REQUEST } = require("../constants/statusCodes");
const { prisma } = require("../utils/prisma");
const response = require("../utils/responseObject");
const _ = require("lodash");

async function getUser(req, res) {
  console.log("from controller", req.user);

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    res.status(BAD_REQUEST).json(
      response({
        message: "no user found",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  console.log("user", user);

  if (user) {
    const payload = _.pick(user, [
      "id",
      "email",
      "firstname",
      "lastname",
      "isVerified",
    ]);
    res.status(OK).json(
      response({
        message: "get user endpoint working",
        status: OK,
        success: true,
        data: payload,
      })
    );
  }
}

module.exports = { getUser };
