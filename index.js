const http = require('http');
const app = require('./app');

const httpserver = http.createServer(app);

httpserver.listen(process.env.PORT, ()=>{
    console.log(`Server running at port ${process.env.PORT}`);
})