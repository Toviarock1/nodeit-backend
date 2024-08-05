const {
  OK,
  BAD_REQUEST,
  NOTFOUND,
  FORBIDEN,
} = require("../constants/statusCodes");
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

// get todos for a specific project
async function getTodos(req, res) {
  const { projectid } = req.params;
  const { status } = req.query;
  console.log("status", status);

  const allowedStatus = ["pending", "inprogress", "completed"];

  if (!status) {
    return res.status(BAD_REQUEST).json(
      response({
        message: "Please provide the status query",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  if (projectid === ":projectid") {
    // console.log("false", projectid);
    return res.status(BAD_REQUEST).json(
      response({
        message: "Please provide the projectid params",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectid,
    },
  });

  if (!project) {
    return res.status(NOTFOUND).json(
      response({
        message: `no projects correspond with the given id(${projectid})`,
        status: NOTFOUND,
        success: false,
        data: {},
      })
    );
  }
  console.log("status val", allowedStatus.includes(status));
  if (!allowedStatus.includes(status)) {
    return res.status(BAD_REQUEST).json(
      response({
        message:
          "your status is invalid only input(pending | inprogress | completed)",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }
  const todos = await prisma.todo.findMany({
    where: {
      todoId: projectid,
      status: status,
    },
  });
  console.log("todos", todos);

  if (todos.length > 0) {
    return res.status(OK).json(
      response({
        message: "user project todos",
        status: OK,
        success: true,
        data: todos,
      })
    );
  }

  return res.status(OK).json(
    response({
      message: "no todos for current project",
      status: OK,
      success: true,
      data: {},
    })
  );

  // console.log(todos);
}
// update todos
async function updateTodo(req, res) {
  const payload = _.pick(req.body, [
    "title",
    "description",
    "priority",
    "status",
    "completed",
    "completedAt",
    "expiresAt",
  ]);
  const { projectid, todoid } = req.query;
  let updatePayload = {};
  console.log(req.query, payload);
  const statusTypes = ["pending", "inprogress", "completed"];
  // console.log(statusTypes.includes(payload.status));

  if (payload.title) {
    updatePayload.title = payload.title;
  }
  if (payload.description) {
    updatePayload.description = payload.description;
  }
  if (payload.priority) {
    updatePayload.priority = payload.priority;
  }
  if (payload.status) {
    updatePayload.status = payload.status;
  }
  if (payload.completed === false || payload.completed === true) {
    updatePayload.completed = payload.completed;
  }
  if (payload.completedAt) {
    updatePayload.completedAt = payload.completedAt;
  }
  if (payload.expiresAt) {
    updatePayload.expiresAt = payload.expiresAt;
  }
  console.log("updatePayload", updatePayload);

  if (!statusTypes.includes(updatePayload.status)) {
    return res.status(BAD_REQUEST).json(
      response({
        message: "Invalid status",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  const projectExist = await prisma.project.findUnique({
    where: {
      id: projectid,
    },
  });

  console.log("projectExist", projectExist);

  if (!projectExist) {
    return res.status(NOTFOUND).json(
      response({
        message: `Project with id(${projectid}) does not exist`,
        status: NOTFOUND,
        success: false,
        data: {},
      })
    );
  }

  if (projectExist.userId !== req.user.id) {
    return res.status(FORBIDEN).json(
      response({
        message: "Inavlid access",
        status: FORBIDEN,
        success: false,
        data: {},
      })
    );
  }

  const todos = await prisma.todo.update({
    where: {
      id: todoid,
      todoId: projectExist.id,
    },
    data: updatePayload,
  });

  if (!todos.id) {
    res.status(NOTFOUND).json(
      response({
        message: `Sorry they was a problem updating this todo`,
        status: NOTFOUND,
        success: false,
        data: {},
      })
    );
  }

  return res.status(OK).json(
    response({
      message: "Todo updated successfully",
      status: OK,
      success: true,
      data: todos,
    })
  );
}
// delete todo
async function deleteTodo(req, res) {
  const { todoid } = req.params;
  // console.log(todoid);

  const todoExist = await prisma.todo.findUnique({
    where: {
      id: todoid,
    },
  });

  if (!todoExist) {
    return res.status(NOTFOUND).json(
      response({
        message: "Todo does not exist",
        status: NOTFOUND,
        success: false,
        data: {},
      })
    );
  }

  const userProject = await prisma.project.findUnique({
    where: {
      id: todoExist.todoId,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userProject.userId,
    },
  });

  if (user.id !== req.user.id) {
    return res.status(FORBIDEN).json(
      response({
        message: "Access denied. this todo does not belong to this user",
        status: FORBIDEN,
        success: false,
        data: {},
      })
    );
  }

  const deleteTodo = await prisma.todo.delete({
    where: {
      id: todoExist.id,
    },
  });

  if (!deleteTodo) {
    return res.status(BAD_REQUEST).json(
      response({
        message: "Todo could not be deleted",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  return res.status(OK).json(
    response({
      message: "Todo deleted successfully",
      status: OK,
      success: true,
      data: {},
    })
  );
}

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
