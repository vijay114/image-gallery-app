const express = require("express");
const galleryController = require("../controllers/gallery");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

/**
 * Route to upload picture, this routes the request to gallery controller
 * It also validates if user is authenticated or not
 */
router.post('/upload', isAuth, galleryController.uploadPicture);

/**
 * Route to get all pictures, this routes the request to galley controller
 * It also validates if user is authenticated on not
 */
router.get('/list', isAuth, galleryController.getPictures)

/**
 * Route to delete a picture with picture id, this routes the request to galley controller
 * It also validates if user is authenticated on not
 */
 router.delete('/delete/:pictureId', isAuth, galleryController.deletePicture)

module.exports = router;

