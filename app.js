require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const post_login = require('./Routes/login');
const post_user = require('./Routes/user');
const get_user = require('./Routes/user');
const test = require('./Routes/test');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//test api
app.use('/',test);

//login or authenticate user
app.use('/login',post_login);

//register user
app.use('/register',post_user);

//Get authenticated user details
app.use('/register/get',get_user);


module.exports = app;