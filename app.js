const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const childProcess = require('child_process');

const db = require('./db.js');
const users = require('./routes/api/users');
const products = require('./routes/api/products');

const app = express();

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
app.use('/images', express.static('/opt/kdk-shop/static/images/full'))

//body parser middleware
app.use(bodyParser.urlencoded({
  extends: false
}));
app.use(bodyParser.json());

function deploy (res) {
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
