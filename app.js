const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const keys = require("./utils/keys");

const MONGODB_URI = `mongodb+srv://${keys.MONGO_USER}:${
  keys.MONGO_PASSWORD
}@cluster0-idsge.mongodb.net/social-node?retryWrites=true`;

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()} - ${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json
app.use(multer({ storage, fileFilter }).single("image"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// general error handling middleware
app.use((err, req, res, next) => {
  console.log(err);

  //
  // destructurization
  //

  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(c => {
    console.log("***** MongoDB connected *****");
    const server = app.listen(8080, () =>
      console.log("* Server is working on 8080 *")
    );
    const io = require("./socket").init(server);
    io.on("connection", socket => {
      console.log("Client connected");
    });
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
