const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const thumbnail = require("../utils/thumbnail");
const Picture = require("../models/picture");
const locale = require("../configurations/locale.json");
const User = require("../models/user");


/**
 * Method to upload picture, save details in Picture model
 * @param req
 * @param res
 * @param next
 */
exports.uploadPicture = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  // check if request has file
  if (!req.file) {
    const error = new Error(locale.VALIDATION.ERROR.REQUIRED.IMAGE);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  // define thumbnail path and name
  const thumbnailImageName = `images/${Date.now()}_thumbnail.jpg`;
  let picture;
  // create thumbnail of the image
  thumbnail
    .createThumbnail(req.file.path, thumbnailImageName)
    .then(() => {
      // initialize value to picture
      picture = new Picture({
        thumbnailImageUrl: thumbnailImageName,
        imageUrl: req.file.path,
        creator: req.userId,
      });
      // save picture
      return picture.save();
    })
    .then(() => {
      // get current user by id
      return User.findById(req.userId);
    })
    .then((user) => {
      // save the picture reference in user as well
      user.pictures.push(picture);
      return user.save();
    })
    .then(() => {
      // send user details in response
      res.status(locale.SERVER.HTTP_CODES.CREATED).json({
        message: locale.SUCCESS.IMAGE.UPLOAD,
        picture: picture,
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
 * Method to get all pictures of the user
 * and sort them by uploaded date
 * @param req
 * @param res
 * @param next
 */
exports.getPictures = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  // getting parameters for pagination
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 100;
  let totalItems;
  // get all documents total count
  Picture.find({ creator: req.userId })
    .countDocuments()
    .then((count) => {
      totalItems = count;
      // get all pictures sorted by created date
      // and apply pagination
      return Picture.find()
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((pictures) => {
      // send response with pictures details and total pictures count
      res
        .status(locale.SERVER.HTTP_CODES.SUCCESS)
        .json({ pictures: pictures, totalItems: totalItems });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

/**
 * Method to delete picture
 * @param req 
 * @param res 
 * @param next 
 */
exports.deletePicture = (req, res, next) => {
  const errors = validationResult(req);
  // check if no validation error occurred
  if (!errors.isEmpty()) {
    const error = new Error(locale.VALIDATION.ERROR.GENERIC);
    error.statusCode = locale.SERVER.HTTP_CODES.UNPROCESSABLE_ENTITY;
    throw error;
  }
  const pictureId = req.params.pictureId;
  // find picture by id
  Picture.findById(pictureId)
    .then((picture) => {
      // if picture not found then throw error
      if (!picture) {
        const error = new Error(locale.VALIDATION.ERROR.IMAGE_NOT_FOUND);
        error.statusCode(locale.SERVER.HTTP_CODES.NOT_FOUND);
        throw error;
      }
      // if picture creator is not same as current user then throw error
      if (picture.creator.toString() !== req.userId) {
        const error = new Error(locale.VALIDATION.ERROR.UNAUTHORIZED);
        error.statusCode(locale.SERVER.HTTP_CODES.FORBIDDEN);
        throw error;
      }
      // delete picture and its thumbnail from storage
      clearImage(picture.imageUrl);
      clearImage(picture.thumbnailImageUrl);
      // find and remove the picture
      return Picture.findByIdAndRemove(pictureId);
    })
    .then(() => {
      // find the current user
      return User.findById(req.userId);
    })
    .then((user) => {
      // remove deleted picture refernce from user
      user.pictures.pull(pictureId);
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Picture Deleted!" });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

/**
 * Method to delete image
 * @param filePath
 */
const clearImage = (filePath) => {
  console.log(filePath);
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => console.log(error));
};
