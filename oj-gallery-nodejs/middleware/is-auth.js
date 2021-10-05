require("dotenv").config();
const jwt = require("jsonwebtoken");
const locale = require("../configurations/locale.json");

/**
 * Method to check if authentication header is present int the request
 * and if it is valid to process the request
 * @param req 
 * @param res 
 * @param next 
 */
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error(locale.VALIDATION.ERROR.UNAUTHORIZED);
    error.statusCode = locale.SERVER.HTTP_CODES.UNAUTHORIZED;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.AUTH_SECRET);
  } catch (error) {
    error.statusCode = locale.SERVER.HTTP_CODES.SERVER_ERROR;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error(locale.VALIDATION.ERROR.UNAUTHORIZED);
    error.statusCode = locale.SERVER.HTTP_CODES.UNAUTHORIZED;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
