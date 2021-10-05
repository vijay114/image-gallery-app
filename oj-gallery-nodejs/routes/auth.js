const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");
const locale = require("../configurations/locale.json");

const router = express.Router();

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

/**
 * Route for signing up user which route the request to auth controller
 * for signing up user and also performs
 * Validating of email, passsword and name received in request 
 * before sending to controller for futher processing
 */
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage(locale.VALIDATION.ERROR.REQUIRED.EMAIL)
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(locale.VALIDATION.ERROR.EMAIL_EXIST);
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .matches(PASSWORD_REGEX)
      .withMessage(locale.VALIDATION.ERROR.INVALID.PASSWORD),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage(locale.VALIDATION.ERROR.REQUIRED.NAME),
  ],
  authController.signup
);

/**
 * Route for login in user which route the request to auth controller
 * for user logins and also performs
 * Validating of email and passsword received in request 
 * before sending to controller for futher processing
 */

router.post(
  "/login",
  [
    body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage(locale.VALIDATION.ERROR.REQUIRED.EMAIL)
      .normalizeEmail(),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage(locale.VALIDATION.ERROR.REQUIRED.PASSWORD),
  ],
  authController.login
);

module.exports = router;
