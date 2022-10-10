const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (request, response, next) => {
  try {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"];

    if (!token) {
      return response
        .status(403)
        .send("A token is required for authentication");
    } else {
      const bearer = token.split(" ");
      const decoded = jwt.verify(token, bearer[1]);
      request.user = decoded;
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      response.status(401).send({ message: "Token Expired" });
    } else {
      response.status(401).send({ message: "Authentication failed" });
    }
  }

  return next();
};

module.exports = verifyToken;
