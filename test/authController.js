const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const authController = require("../controllers/auth");

describe("Auth-Controller - Login", () => {
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
});
