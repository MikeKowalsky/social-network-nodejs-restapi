const { validationResult } = require("express-validator/check");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First post",
        content: "This is my first post",
        imageUrl: "images/book.jpg",
        creator: {
          name: "Mike"
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, enered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title,
    imageUrl: "images/book.jpg",
    content,
    creator: { name: "Mike" }
  });

  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Post created succesfully!",
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // in async code throw err will be not catched be general
      // error handling middleware
      next(err);
    });
};
