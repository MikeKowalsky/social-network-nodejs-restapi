const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const User = require("../models/user");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        email,
        password: hashedPassword,
        name
      });

      return newUser.save();
    })
    .then(result =>
      res.status(201).json({ message: "User created!", userId: result._id })
    )
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error("User with taht email not found!");
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Password incorrect!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        "secretword",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch(er => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
