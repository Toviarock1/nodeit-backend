const yup = require("yup");

function registerValidation(payload) {
  let registerSchema = yup.object({
    firstname: yup.string().required().label("First name"),
    lastname: yup.string().required().label("Last name"),
    email: yup.string().email().max(255).required().label("Email"),
    password: yup.string().required().min(8).max(255).label("Password"),
  });

  return registerSchema.validate(payload);
}

function loginValidation(payload) {
  let loginSchema = yup.object({
    email: yup.string().email().max(255).required().label("Email"),
    password: yup.string().required().min(8).max(255).label("Password"),
  });

  return loginSchema.validate(payload);
}

module.exports = { registerValidation, loginValidation };
