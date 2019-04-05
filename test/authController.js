const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const authController = require("../controllers/auth");

const keys = require("../utils/keys");
const MONGODB_URI = `mongodb+srv://${keys.MONGO_USER}:${
  keys.MONGO_PASSWORD
}@cluster0-idsge.mongodb.net/social-node-test?retryWrites=true`;

describe("Auth-Controller", () => {
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
  it("should throws an error when accessing the database fails", done => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "tester"
      }
    };
    // we are testing async function, so added return in the end of it's executions code
    // and now in then block will be testing status code
    authController
      .login(req, {}, () => {})
      .then(result => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });

    User.findOne.restore();
  });

  it("should send a respons with a valid user status for an existing user", done => {
    const req = { userId: "5c9755a897e4aaaf8c71103f" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        console.log(code);
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };

    authController
      .getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I am new!");
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
