const { OK, BAD_REQUEST } = require("../constants/statusCodes");
const { prisma } = require("../utils/prisma");
const response = require("../utils/responseObject");
const { todoValidation } = require("../validations/todoValidation");
const _ = require("lodash");

async function createTodo(req, res) {
  const payload = _.pick(req.body, [
    "title",
    "description",
    "priority",
    "status",
    "expiresAt",
    "todoId",
  ]);

  try {
    await todoValidation(payload);
  } catch (err) {
    console.log(err);
    return res.status(BAD_REQUEST).json(
      response({
        message: err.errors[0],
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  const createTodo = await prisma.todo.create({
    data: payload,
  });
  console.log(createTodo);
  if (createTodo.id) {
    res.status(OK).json(
      response({
        message: "Todo created successfully",
        status: OK,
        success: true,
        data: createTodo,
      })
    );
  }
}

module.exports = { createTodo };
