const { validationResult } = require("express-validator/check");

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

  // Create post in db

  res.status(201).json({
    message: "Post created succesfully!",
    post: {
      _id: new Date().toISOString().toString(),
      title,
      content,
      creator: { name: "Mike" },
      createdAt: new Date()
    }
  });
};
