const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const db = require("../Config/database");
const oracledb = require("oracledb");


const router = express.Router();

//user login
router.post("/login", async(request, response) => {
  try {
    //get user input
    const input_user ={
      email: request.body.email.toLowerCase(),
      password: request.body.password
    }

    //validate user input
    if (!input_user) {
      response.status(400).send("Email & Password is required");
    }

    await oracledb.getConnection(db.database, (err, conn) => {
      if (err) {
        response.send("Database connection error - ", err);
      } else {

        oracleDB.outFormat = oracledb.OUT_FORMAT_OBJECT;
        
        //query for retriving data
        const query =
          "Select * from users where email = " + input_user.email;
        conn.execute(query, [], (err, results) => {
          if (err) {
            response.send(err);
          } else {

            const user = results.rows[0];

            //comparing the password
            bcrypt.compare(
              input_user.password,
              user.password,
              (err, pwd_Match) => {
                if (err) {
                  response.send(err);
                }

                if (!pwd_Match) {
                  response.status(401).send({ message: "Invalid Credentials" });
                  return;
                }

                payload = {
                  sub: user.email,
                };

                //return user
                response.status(200).json({
                  user: user,
                  token: jwt.sign(payload, process.env.JWTPRIVATEKEY, {
                    expiresIn: "1h",
                  }),
                });
              }
            );

            connection.release(function (err) {
              if (err) {
                console.error(err.message);
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("An error occured");
  }
});

module.exports = router;
