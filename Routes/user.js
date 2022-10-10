const db = require("../Config/database");
const oracledb = require("oracledb");
const bcrypt = require("bcrypt");
const express = require("express");
const auth_login = require("../Middleware/auth");
const { config } = require("dotenv");

const router = express.Router();

//user register
router.post("/register", async (request, response, next) => {
  try {
    //get user input
    const user = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      email: request.body.email,
      password: request.body.password,
    };

    //validate user input
    if (!user) {
      response.status(400).send("All input is required");
    }

    //Encrypt password
    await bcrypt.genSalt(Number(process.env.SALT), (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        email.hashedPassword = hash;

        //insert user details
        insertUser(user, (err) => {
          let payload;
          if (err) {
            return next(err);
          }

          payload = {
            sub: user.email,
          };

          response.status(200).json({
            user: user,
            token: jwt.sign(payload, process.env.JWTPRIVATEKEY, {
              expiresIn: "1h",
            }),
          });
        });
      });
    });

  } catch (err) {
    console.log(err);
    response.send("An error occured");
  }
});

//Get authenticated user details
router.get('/register/get', auth_login, (request, response) => {

  try {
    oracledb.getConnection(db.database, async (err, connection) => {
      if (err) {
        response.send("Database connection error - ", err);
      }

      const result = await connection.execute(
        "select * from users",
        { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT },
        (err) => {
          if (err) {
            console.error(err.message);
          }
        }
      );

      response.status(200).send(result);
      connection.release((err) => {
        if (err) {
          console.error(err.message);
        }
      });
    });
  } catch (err) {
    console.error(err);
    response.send("An error occured");
  }
});

function insertUser(user, err) {
    oracledb.getConnection(db.database, (err, connection) => {
      if (err) {
        response.send("Database connection error - ", err);
      }

      connection.execute(
        `Insert into users values(${user.first_name},${user.last_name},${user.email},${user.password})`,
        [],
        {
          autoCommit: true,
        },
        (err)=>{
          if (err) {
            console.error(err.message);
          }
        }
      );
      connection.release((err) => {
        if (err) {
          console.error(err.message);
        }
      });
    });
}

module.exports = router;
