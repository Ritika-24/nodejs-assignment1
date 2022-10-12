const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const db = require("../Config/database");
const oracleDB = require("oracledb");

const router = express.Router();

//user login
router.post("/login", async (request, response) => {
  try {
    //get user input
    const input_user = {
      email: request.body.email,
      password: request.body.password,
    };

    //validate user input
    if (!input_user) {
      response.status(400).send("Email & Password is required");
    }

    //db connection
    await oracleDB.getConnection(db.database, (err, connection) => {
      if (err) {
        response.send("Database connection error - ", err);
      } else {
        //query for retriving data
        const query =
          'select first_name as "first_name", ' +
          '   last_name as "last_name", ' +
          '   email as "email", ' +
          '   password as "password" ' +
          "from users " +
          "where email = :email";
        connection.execute(
          query,
          {
            email: request.body.email.toLowerCase(),
          },
          {
            outFormat: oracleDB.OUT_FORMAT_OBJECT,
          },
          (err, results) => {
            if (err) {
              console.error(err.message);
            } else {
              const user = results.rows[0];

              //comparing the password
              const pwd_Match = bcrypt.compare(
                input_user.password,
                user.password
              );

              //validating passwords
              if (!pwd_Match) {
                response.status(401).send({ message: "Invalid Credentials" });
              }

              payload = {
                sub: input_user.email,
              };

              // return user details
              response.status(200).send({
                message: "LoggedIn successfully",
                user: {
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                },
                token: jwt.sign(payload, process.env.JWTPRIVATEKEY, {
                  expiresIn: "1h",
                }),
              });
            }
          }
        );
        connection.release(function (err) {
          if (err) {
            console.error(err.message);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    response.send("An error occured");
  }
});

module.exports = router;
