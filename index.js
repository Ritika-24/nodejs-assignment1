const http = require('http');
const app = require('./app');
const dbConnection = require("./Config/database");

const httpserver = http.createServer(app);

httpserver.listen(process.env.PORT, async()=>{
    global.connection = await dbConnection();
    console.log(`Server running at port ${process.env.PORT}`);
})

module.exports = httpserver;