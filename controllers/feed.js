const { validationResult } = require("express-validator/check");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({ message: "Feched posts successfully", posts });
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found.");
        error.statusCode = 404;
        // here I can throw an error because in the ind it will finish in catch
        // and from there will be passed by next to general error handlig mw
        throw error;
      }
      res.status(200).json({ message: "Post fetched.", post });
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
