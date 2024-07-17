const yup = require("yup");

function createValidation(payload) {
  let createSchema = yup.object({
    title: yup.string().required().label("Title"),
    about: yup.string().required().label("About"),
    expiresAt: yup.date().required().label("Expires At"),
  });

  return createSchema.validate(payload);
}

module.exports = { createValidation };
