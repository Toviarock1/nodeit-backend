const yup = require("yup");

function todoValidation(payload) {
  let todoSchema = yup.object({
    title: yup.string().required().label("Title"),
    description: yup.string().required().label("Description"),
    priority: yup.string().required().label("Priority"),
    status: yup.string().label("status"),
    expiresAt: yup.string().required().label("expiresAt"),
    todoId: yup.string().required().label("TodoId"),
  });

  return todoSchema.validate(payload);
}

module.exports = { todoValidation };
