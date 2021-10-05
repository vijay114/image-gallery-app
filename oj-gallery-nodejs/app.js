require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const locale = require("./configurations/locale.json");


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const galleryRoutes = require("./routes/gallery");
const swaggerRoutes = require("./routes/swagger");

const app = express();

// using fileStorage
// can be replaced with exteral storage service like AWS S3 buckets
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// file filter for supporting only image files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/heic" ||
    file.mimetype == "image/heif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// allowing API request from external application
// '*' should be replaced by client application IPs,
// currently allowed for all for demo purpose
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// routers
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/gallery", galleryRoutes);
app.use("/swagger", swaggerRoutes);

// error handler which send appropriate response
// to client application in case
// errors are thrown by process requests
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || locale.SERVER.HTTP_CODES.SERVER_ERROR;
  const message = error.message || locale.VALIDATION.ERROR.GENERIC;
  res.status(status).json({ message: message });
});

// connecting mongo db server using and
// once mongo connection is established
// node application will start listening on port
mongoose
  .connect(process.env.DATABASE_URL)
  .then((result) => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.log(err));
