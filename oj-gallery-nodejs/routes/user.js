const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const locale = require("../configurations/locale.json");

const router = express.Router();

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

/**
 * Route for user profile which route the request to user controller
 * it also check if user is authenticated to view these details
 */
router.get("/profile", isAuth, userController.getCurrentUserDetails);

/**
 * Route for user update which route the request to user controller
 * it also validate if user is authenticated and if required
 * field is present
 */
router.put(
  "/update",
  isAuth,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage(locale.VALIDATION.ERROR.REQUIRED.NAME),
  ],
  userController.updateUser
);

/**
 * Route for password update which route the request to user controller
 * it also validate if user is authenticated and if required
 * fields are present and valid
 */
router.put(
  "/updatePassword",
  isAuth,
  [
    body("oldPassword")
      .trim()
      .not()
      .isEmpty()
      .withMessage(locale.VALIDATION.ERROR.REQUIRED.OLD_PASSWORD),
    body("password")
      .trim()
      .matches(PASSWORD_REGEX)
      .withMessage(locale.VALIDATION.ERROR.INVALID.PASSWORD),
  ],
  userController.updatePassword
);

module.exports = router;
