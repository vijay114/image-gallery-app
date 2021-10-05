require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const locale = require("../configurations/locale.json");

/**
 * Controller method to register the user
 * @param req
 * @param res
 * @param next
 */
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // encrypt password
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });
      // save user
      return user.save();
    })
    .then((result) => {
      // send user created response
      res.status(locale.SERVER.HTTP_CODES.CREATED).json({
        message: locale.SUCCESS.USER.REGISTRATION,
        userId: result._id,
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
 * Controller method to login the user
 * @param req
 * @param res
 * @param next
 */
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const expiresIn = process.env.AUTH_TOKEN_EXPIRY || 7200000;
  let loadedUser;
  // get user by email
  User.findOne({ email: email })
    .then((user) => {
      // if user not found return error
      if (!user) {
        const error = new Error(locale.VALIDATION.ERROR.USER_NOT_FOUND);
        error.statusCode = locale.SERVER.HTTP_CODES.UNAUTHORIZED;
        throw error;
      }
      loadedUser = user;
      // compare encrypted password
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      // if passwords are not equal throw error
      if (!isEqual) {
        const error = new Error(locale.VALIDATION.ERROR.INCORRECT_PASSWORD);
        error.statusCode = locale.SERVER.HTTP_CODES.UNAUTHORIZED;
        throw error;
      }
      // create signed json web token with email and user id and a secret
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.AUTH_SECRET,
        { expiresIn: expiresIn }
      );
      // send successfull login response
      res.status(locale.SERVER.HTTP_CODES.SUCCESS).json({
        message: locale.SUCCESS.USER.LOGIN,
        token: token,
        expiresIn: expiresIn,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
      }
      next(error);
    });
};
