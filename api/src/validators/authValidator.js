const { body } = require("express-validator");

// REGISTER: nume, prenume, email, parola
// array de reguli pentru fiecare camp completat de user 
const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("Campul pentru PRENUME trebuie completat!"),

  body("lastName")
    .trim()
    .notEmpty().withMessage("Campul pentru NUME trebuie completat!"),

  body("email")
    .isEmail().withMessage("Campul pentru EMAIL trebuie completat!")
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith("@gmail.com") && !value.endsWith("@yahoo.com")) {
        throw new Error("Sunt permise doar adresele de email cu formatul: @gmail.com sau @yahoo.com");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 8 }).withMessage("Parola trebuie sa contina minim 8 caractere pentru a fi validata!")
    .trim(),
];

// LOGIN: email + parola
const loginValidation = [
  body("email")
    .isEmail().withMessage("Completati campul cu un email valid!")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Completati campul cu parola corecta!")
    .trim(),
];

module.exports = { registerValidation, loginValidation };