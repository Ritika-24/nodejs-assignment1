const { response } = require("../app");

await oracleDB.getConnection(db.database, (err, conn) => {
  if (err) {
    response.send("Database connection error - ", err);
  } else {
    //query for retriving data
    const query = "Select * from users where email =" + input_user.email;
    const result = conn.execute(query, [], (err, res) => {
      if (err) {
        response.send(err);
      } else {
        response.send(res);
      }
      const user = results.rows[0];
    });

    //comparing the password
   const pwd_Match =  bcrypt.compare(input_user.password, result.password);

      if (!pwd_Match) {
        response.status(401).send({ message: "Invalid Credentials" });
      } else {
        payload = {
          sub: input_user.email,
        };

        //return user
        response.status(200).json({
          user: input_user,
          token: jwt.sign(payload, process.env.JWTPRIVATEKEY, {
            expiresIn: "1h",
          }),
        });

        //response.status(200).json(results);
      }

    connection.release(function (err) {
      if (err) {
        console.error(err.message);
      }
    });
    // }
    // }
    //);
  }
});
