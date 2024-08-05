const response = require("./../utils/responseObject");
const { OK, CREATED, BAD_REQUEST } = require("./../constants/statusCodes");
const {
  registerValidation,
  loginValidation,
} = require("./../validations/authValidations");
const _ = require("lodash");
const { prisma } = require("../utils/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

async function login(req, res) {
  // console.log(req.body);
  const payload = _.pick(req.body, ["email", "password"]);
  console.log("PAYLOAD", payload);
  try {
    await loginValidation(payload);
  } catch (error) {
    return res.status(BAD_REQUEST).json(
      response({
        message: "Please provide the following fields (email & password)",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  console.log(user);
  if (!user) {
    res.status(BAD_REQUEST).json(
      response({
        message: "Invalid email/password",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  const validPassword = await bcrypt.compare(payload.password, user.password);
  if (!validPassword) {
    res.status(BAD_REQUEST).json(
      response({
        message: "Invalid email/password",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  const token = await jwt.sign(
    {
      id: user.id,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRY_TIME }
  );
  const filteredUser = _.pick(user, ["id", "firstname", "lastname", "email"]);

  res.status(OK).json(
    response({
      message: "Login successful",
      status: OK,
      success: true,
      data: { ...filteredUser, token },
    })
  );
}

async function register(req, res) {
  const payload = _.pick(req.body, [
    "firstname",
    "lastname",
    "email",
    "password",
  ]);

  try {
    const success = await registerValidation(payload);
    // console.log(success);
  } catch (err) {
    console.log(err);
    res.status(BAD_REQUEST).json(
      response({
        message: err.errors[0],
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    res.status(BAD_REQUEST).json(
      response({
        message: "user already exist",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }
  const hashPassword = await bcrypt
    .hash(payload.password, saltRounds)
    .then(function (hash) {
      // console.log(hash);
      return hash;
    });
  // console.log("hashpassword", hashPassword);

  const newUser = await prisma.user.create({
    data: { ...payload, password: hashPassword },
  });
  // console.log(newUser);
  res.status(CREATED).json(
    response({
      message: "Create endpoint works",
      status: CREATED,
      success: true,
      data: payload,
    })
  );
}

module.exports = { login, register };
