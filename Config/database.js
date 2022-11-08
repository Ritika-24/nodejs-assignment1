const oracleDB = require("oracledb");

const database = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: "localhost:1521/xe",
};

const dbConnection = async () => {
  try {
    const conn = await oracleDB.getConnection(database);
    console.log("Database Connected successfully!!");
    return conn;
  } catch (err) {
    console.log("Database Connection error occured!!");
    console.error(err.message);
  }
};

module.exports = dbConnection ;

