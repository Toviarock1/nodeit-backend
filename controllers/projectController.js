const { OK, BAD_REQUEST, NOTFOUND } = require("../constants/statusCodes");
const { prisma } = require("../utils/prisma");
const response = require("../utils/responseObject");
const { createValidation } = require("../validations/projectValidation");
const _ = require("lodash");
// create project
async function createProject(req, res) {
  const payload = _.pick(req.body, ["title", "about", "expiresAt"]);

  try {
    const success = await createValidation(payload);
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
  console.log("we got here");
  const userProjects = await prisma.project.findMany({
    where: {
      title: payload.title,
      userId: req.user.id,
    },
  });
  if (userProjects.length <= 0) {
    console.log(req.user);
    const createProject = await prisma.project.create({
      data: {
        ...payload,
        userId: req.user.id,
      },
    });
    // prisma.$disconnect();
    console.log(createProject);
    res.status(OK).json(
      response({
        message: "project created successfully",
        status: OK,
        success: true,
        data: {},
      })
    );
  }
  res.status(BAD_REQUEST).json(
    response({
      message: "project already exist",
      status: BAD_REQUEST,
      success: false,
      data: {},
    })
  );
}

// get projects
async function getProjects(req, res) {
  const userProjects = await prisma.project.findMany({
    where: {
      userId: req.user.id,
    },
  });

  if (userProjects.length > 0) {
    return res.status(OK).json(
      response({
        message: "user projects",
        status: OK,
        success: true,
        data: userProjects,
      })
    );
  }
  return res.status(BAD_REQUEST).json(
    response({
      message: "no projects for current user",
      status: BAD_REQUEST,
      success: false,
      data: {},
    })
  );
}
// update projects
async function updateProjects(req, res) {
  const payload = _.pick(req.body, [
    "title",
    "about",
    "expiresAt",
    "completed",
  ]);
  const { projectId } = req.params;
  console.log(req.params);
  let updatePayload = {};
  // if (!payload.title) {
  //   res.status(BAD_REQUEST).json(
  //     response({
  //       message: "title is required",
  //       status: BAD_REQUEST,
  //       success: false,
  //       data: {},
  //     })
  //   );
  // }
  if (payload.about) {
    updatePayload.about = payload.about;
  }
  if (payload.expiresAt) {
    updatePayload.expiresAt = payload.expiresAt;
  }
  if (payload.completed === true || payload.completed === false) {
    updatePayload.completed = payload.completed;
  }
  if (payload.title) {
    updatePayload.title = payload.title;
  }

  console.log(updatePayload);
  // if (Object.keys(payload).includes("completed")) {
  //   updatePayload.completed = payload.completed;
  //   console.log()
  // }
  console.log(Object.keys(payload));
  if (Object.keys(payload).length <= 0) {
    res.status(BAD_REQUEST).json(
      response({
        message:
          "Please provide atleast one of the field required(completed,about,title,expiresAt)",
        status: BAD_REQUEST,
        success: false,
        data: {},
      })
    );
  }

  const projectInDatabase = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!projectInDatabase) {
    res.status(NOTFOUND).json(
      response({
        message: `no projects correspond with the given ${projectId}`,
        status: NOTFOUND,
        success: false,
        data: {},
      })
    );
  }
  console.log(projectInDatabase);
  const updateUserProject = await prisma.project.update({
    where: {
      id: projectInDatabase.id,
    },
    data: updatePayload,
  });
  if (!updateUserProject.id) {
    res.status(NOTFOUND).json(
      response({
        message: `sorry they was a problem updating this project`,
        status: NOTFOUND,
        success: false,
        data: {},
      })
    );
  }
  res.status(OK).json(
    response({
      message: `Project updated successfully`,
      status: OK,
      success: true,
      data: updateUserProject,
    })
  );
  console.log(updateUserProject);
}
// delete project
async function deleteProjects(req, res) {
  const { projectId } = req.params;

  const projectExist = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!projectExist) {
    return res.status(NOTFOUND).json(
      response({
        message: `no projects correspond with the given id(${projectId})`,
        status: NOTFOUND,
        success: false,
        data: {},
      })
    );
  }

  const deleteTodos = await prisma.todo.deleteMany({
    where: {
      todoId: projectExist.id,
    },
  });

  const deleteProject = await prisma.project.delete({
    where: {
      id: projectExist.id,
    },
  });
  return res.status(OK).json(
    response({
      message: `Project deleted successfully`,
      status: OK,
      success: true,
      data: {},
    })
  );
}

module.exports = { createProject, getProjects, updateProjects, deleteProjects };
