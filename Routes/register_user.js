const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const auth_login = require("../Middleware/auth");
const { config } = require("dotenv");

const router = express.Router();

//user registration
router.post("/register", async (request, response) => {
  try {
    //get user input
    const user = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      email: request.body.email.toLowerCase(),
      password: request.body.password,
    };

    //validate user input
    if (!user) {
      response.status(400).send("All input is required");
    }

    //Encrypt password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashed_password = await bcrypt.hash(user.password, salt);
    user.password = hashed_password;

    //Query for inserting the data
    const query = `insert into users values ('${user.first_name}','${user.last_name}','${user.email}','${user.password}')`;

    //Query executing
    await connection.execute(query, [], { autoCommit: true });

    let payload;
    payload = {
      sub: user.email,
    };

    //returning user details
    response.status(200).json({
      message: "User registered successfully",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
      },
      token: jwt.sign(payload, process.env.JWTPRIVATEKEY, {
        expiresIn: "1h",
      }),
    });
  } catch (err) {
    console.log(err);
    response.send("An error occured");
  }
});

//user authorization
router.get("/get-auth", auth_login, (request, response) => {
  console.log("User authorized successfully");
});

module.exports = router;
