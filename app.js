const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const childProcess = require('child_process');
const morgan = require('morgan');

const db = require('./db.js');
const users = require('./routes/api/users');
const products = require('./routes/api/products');
const admins = require('./routes/api/admins');
const staticsPath = require('./config/storage').staticsPath;

const app = express();

//log using morgan
if (process.env.NODE_ENV !== "TRAVIS" &&
  process.env.NODE_ENV !== "TEST" && process.env.NODE_ENV !== "PRODUCTION") {
  app.use(morgan('dev'));
}
//Set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  next();
});
//Serve static images
app.use('/images', express.static(path.join(staticsPath, 'images', 'full')));

//body parser middleware
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb'
}));
app.use(bodyParser.json({
  limit: '5mb'
}));

//passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

//User Routes
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/admins', admins);

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

module.exports = app;
