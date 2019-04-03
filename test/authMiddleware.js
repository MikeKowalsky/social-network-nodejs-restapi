const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middleware/is-auth");

describe("Auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: () => null
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("No token.");
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: () => "xyz"
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yeald a userId after decoding the token", () => {
    const req = {
      get: () => "Bearer wopqwoepoqiwpeoiqw"
    };

    //stub the function and later after test restore oryginal functionality
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    // // manually stubbing / mocking verify function
    // jwt.verify = () => ({ userId: "abc" });

    authMiddleware(req, {}, () => {});

    //stub is giving use also another possibilities
    //it register all calls so we can check
    expect(jwt.verify.called).to.be.true;

    expect(req).to.have.property("userId");

    // it makes no sens here but we can use second arg here
    expect(req).to.have.property("userId", "abc");

    jwt.verify.restore();
  });

  it("should thorw an error if the token cannot be veryfied", () => {
    const req = {
      get: () => "xyz"
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
