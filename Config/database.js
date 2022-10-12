
module.exports = {
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString:"localhost:1521/xe"
      //"(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)))",
  }
};
