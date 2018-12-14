const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const childProcess = require('child_process');
const morgan = require('morgan');

const db = require('./db.js');
const users = require('./routes/api/users');
const products = require('./routes/api/products');
const staticsPath = require('./config/storage').staticsPath;

const app = express();

//log using morgan
if (process.env.NODE_ENV !== "PRODUCTION") {
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
    "GET, POST, PUT, DELETE"
  );
  next();
});
//Serve static images
app.use('/images', express.static(path.join(staticsPath, 'images', 'full')));

//body parser middleware
app.use(bodyParser.urlencoded({
  extended: false,
  limit:'5mb'
}));
app.use(bodyParser.json({
  limit:'5mb'
}));

//run deply script and return response for github
function deploy(res) {
  childProcess.exec('/home/dark0ne/deploy.sh', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (err) {
      console.error(err);

      return res.send(500);
    }
    res.send(200);
  });
}

//Router for git webhook autodeployment on tag pushes starting with 'v'
app.post("/webhooks/github", (req, res) => {
  if (process.env.NODE_ENV === "PRODUCTION" &&
    (/^.*tags\/v[0-9.]*$/).test(req.body.ref)) {
    console.log("Deploying new version");
    deploy(res);
  }
})

//passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

//User Routes
app.use('/api/users', users);
app.use('/api/products', products);

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

module.exports = app;
