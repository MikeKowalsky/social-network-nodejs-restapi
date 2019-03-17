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
  if (!errors.isEmpty())
    return res.status(422).json({
      message: "Validation failed, enered data is incorrect",
      errors: errors.array()
    });

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
    .catch(err => console.log(err));
};
