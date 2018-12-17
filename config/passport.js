const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const keys = require('../config/keys');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {

  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    //console.log(jwtPayload);
    User.findById(jwtPayload.id)
      .then((user) => {
        if (user) {
          user.accessLevel = "User";

          return done(null, user)
        }
        Admin.findById(jwtPayload.id)
          .then((admin) => {
            if (admin) {
              admin.accessLevel = "Admin";

              return done(null, admin)
            }

            return done(null, false);
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  }))
}
