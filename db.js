const mongoose = require('mongoose');

//DB config
const db = require('./config/keys').mongoURI;

//Config Mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//connect to MongoDB
mongoose
  .connect(db, {
    autoIndex: false
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));
