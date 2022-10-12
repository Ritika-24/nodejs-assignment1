require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const post_login = require('./Routes/login');
const post_user = require('./Routes/user');
const get_user = require('./Routes/user');
//const test = require('./Routes/test');
const insert_user = require('./Routes/insert_user');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//login or authenticate user
app.use('/api',post_login);

//register user
app.use('/api',post_user);

//user authorization
app.use('/api',get_user);

module.exports = app;