const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const keys = require("./utils/keys");

const MONGODB_URI = `mongodb+srv://${keys.MONGO_USER}:${
  keys.MONGO_PASSWORD
}@cluster0-idsge.mongodb.net/social-node?retryWrites=true`;

const app = express();

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(c => {
    console.log("***** MongoDB connected *****");
    app.listen(8080, () => console.log("* Server is working on 8080 *"));
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
