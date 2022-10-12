const express = require('express');
const  router = express.Router();
const oracleDB = require('oracledb');
const db = require('../Config/database');

router.post('/reg-user',(request,response,next)=>{
    //get user input
    const {first_name,last_name, email,password}= request.body;

    //connection with db
    oracleDB.getConnection(db.database,(err,connection)=>{
        if(err){
            response.send("Database connection error...")
        }
        else{
            const query = "insert into users values('"+first_name+"','"+last_name+"','"+email+"','"+password+"')";
            connection.execute(query,[],{autoCommit:true},(err,result)=>{
                if(err){
                    response.send(err);
                }
                else{
                    response.send(result);
                }
            })
        }
    })
})


module.exports = router;