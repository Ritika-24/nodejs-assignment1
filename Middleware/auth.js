const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (request, response, next) => {
  try {
    //get token
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"];

    //validating token
    if (!token) {
      return response
        .status(403)
        .send("A token is required for authentication");
    } else {
      //verify token
      await jwt.verify(token, process.env.JWTPRIVATEKEY, (err) => {
        if (err) {
          response
            .status(401)
            .send({ message: "Token Expired or Authorization failed" });
        } else {
          response.status(200).send({ message: "Token Verified Successfully" });
        }
      });
    }
  } catch (err) {
    response.status(400).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
