const mongoose = require('mongoose');

//DB config
const db = require('./config/keys').mongoURI;

//connect to MongoDB
mongoose
  .connect(db, {
    autoIndex: false
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));
