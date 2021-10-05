const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const locale = require("../configurations/locale.json");


/**
 * Method to get current user details
 * @param req
 * @param res
 * @param next
 */
exports.getCurrentUserDetails = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  const userId = req.userId;
  // finding user by id
  User.findById(userId)
    .then((user) => {
      // if user does not exist throw error
      if (!user) {
        const error = new Error(locale.VALIDATION.ERROR.USER_NOT_FOUND);
        error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
        throw error;
      }
      // send user details in response
      res.status(locale.SERVER.HTTP_CODES.SUCCESS).json({
        name: user.name,
        email: user.email,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
      }
      next(error);
    });
};

/**
 * Method to update the user
 * @param req
 * @param res
 * @param next
 */
exports.updateUser = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    error.data = error.array();
    throw error;
  }
  const userId = req.userId;
  let loadedUser;
  // find user by id
  User.findById(userId)
    .then((user) => {
      // if user is not found throw error
      if (!user) {
        const error = new Error(locale.VALIDATION.ERROR.USER_NOT_FOUND);
        error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
        throw error;
      }
      loadedUser = user;
      // set user with updated name and save
      user.name = req.body.name;
      return user.save();
    })
    .then(() => {
      // send updated user details in the response
      res.status(locale.SERVER.HTTP_CODES.SUCCESS).json({
        name: loadedUser.name,
        email: loadedUser.email,
        message: locale.SUCCESS.USER.UPDATE,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
      }
      next(error);
    });
};

/**
 * Method to update password for the user
 * @param req
 * @param res
 * @param next
 */
exports.updatePassword = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.status = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  const userId = req.userId;
  const currentPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  // get user by id
  let loadedUser;
  User.findById(userId)
    .then((user) => {
      // if user not found throw error
      if (!user) {
        const error = new Error(locale.VALIDATION.ERROR.USER_NOT_FOUND);
        error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
        throw error;
      }
      loadedUser = user;
      // compare current password
      return bcrypt.compare(currentPassword, user.password);
    })
    .then((isEqual) => {
      // if current password does not match throw error
      if (!isEqual) {
        const error = new Error(locale.VALIDATION.ERROR.INCORRECT_PASSWORD);
        error.statusCode = locale.SERVER.HTTP_CODES.UNAUTHORIZED;
        throw error;
      }
      // encrypt new password
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      // save updated password
      loadedUser.password = hashedPassword;
      return loadedUser.save();
    })
    .then((result) => {
      // send password update success in the response
      res.status(locale.SERVER.HTTP_CODES.SUCCESS).json({
        message: locale.SUCCESS.USER.PASSWORD_UPDATE,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
      }
      next(error);
    });
};
