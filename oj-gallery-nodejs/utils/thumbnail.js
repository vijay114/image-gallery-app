const Jimp = require("jimp");
const path = require("path");

/**
 * Method to generate thumbnail for an imagepath
 * by reducing the size and quality
 * @param imageFilePath 
 * @param fileName 
 */
async function createThumbnail(imageFilePath, fileName) {
  // reads the image
  const image = await Jimp.read(path.join(__dirname ,"..", "/") + imageFilePath);
  // resizes the image to width 400.
  await image.resize(400, Jimp.AUTO);
  // set quality to 60
  await image.quality(60);
  // saves the image on the file system
  await image.writeAsync(path.join(__dirname, "..", "/") + fileName);
}

module.exports.createThumbnail = createThumbnail;
