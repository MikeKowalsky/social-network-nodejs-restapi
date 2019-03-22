const express = require("express");
const { body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please eneter a valid email")
      .custom((value, { req }) =>
        User.findOne({ email: value }).then(userDoc => {
          if (userDoc) return Promise.reject("E-Mail address already exist.");
        })
      )
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 }),
    body("name")
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

module.exports = router;
