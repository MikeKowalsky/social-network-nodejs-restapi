const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
// const Post = require("../models/post");
const feedController = require("../controllers/feed");

const keys = require("../utils/keys");
const MONGODB_URI = `mongodb+srv://${keys.MONGO_USER}:${
  keys.MONGO_PASSWORD
}@cluster0-idsge.mongodb.net/social-node-test?retryWrites=true`;

describe("Feed-Controller", () => {
  before(done => {
    mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true })
      .then(result => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "5c9755a897e4aaaf8c71103f"
        });
        return user.save();
      })
      .then(() => done())
      .catch(err => console.log(err));
  });
  it("should add created post to the posts of creator", done => {
    const req = {
      body: {
        title: "Test Post",
        content: "A test post."
      },
      file: {
        path: "abc"
      },
      userId: "5c9755a897e4aaaf8c71103f"
    };

    const res = {
      status: function() {
        return this;
      },
      json: function() {
        return this;
      }
    };

    feedController
      .createPost(req, res, () => {})
      .then(savedUser => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      });
  });

  after(done => {
    User.deleteMany({})
      .then(() => mongoose.disconnect())
      .then(() => {
        done();
      })
      .catch(err => console.log(err));
  });
});
