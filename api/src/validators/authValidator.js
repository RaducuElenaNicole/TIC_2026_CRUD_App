const { body } = require("express-validator");

// REGISTER: nume, prenume, email, parola
const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required"),

  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required"),

  body("email")
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith("@gmail.com") && !value.endsWith("@yahoo.com")) {
        throw new Error("Only gmail.com or yahoo.com emails are allowed");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 8 }).withMessage("Password should have at least 8 chars")
    .trim(),
];

// LOGIN: email + parola
const loginValidation = [
  body("email")
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .trim(),
];

module.exports = { registerValidation, loginValidation };