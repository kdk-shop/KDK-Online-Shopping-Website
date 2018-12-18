const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load validators
const validationLoginInput = require('../../validation/admin/login')
const validationChangePwdInput = require('../../validation/admin/change_pwd')

//load user model
const Admin = require('../../models/Admin');

router.post('/login', (req, res) => {
  const {
    errors,
    isValid
  } = validationLoginInput(req.body);
  //check validation

  if (!isValid) {
    return res.status(400).json(errors)
  }
  const name = req.body.name;
  const password = req.body.password;
  //Find user by email

  Admin.findOne({
      name: name.toLowerCase()
    })
    .then((user) => {
      //check for user
      if (!user) {
        errors.password = 'Username or password incorrect';

        return res.status(401).json(errors)
      }
      //check password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {

            /*
             *user matched
             *create jwt payload
             */
            const payload = {
              id: user.id,
              name: user.name
            }
            //sign token

            jwt.sign(payload, keys.secretOrKey, {
              expiresIn: '1d'
            }, (err, token) => {
              res.json({
                success: true,
                token,
                redirect: '/admin/panel'
              })
            });
          } else {
            errors.password = 'Username or password incorrect'

            return res.status(401).json(errors)
          }
        })
    })
})

router.post(
  '/change_pwd',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {
    const {
      errors,
      isValid
    } = validationChangePwdInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors)
    }
    Admin.findById(req.user.id, (err, user) => {
      if (err) {
        console.error(err);

        return res.status(500).json(err);
      }

      //check old password
      bcrypt.compare(req.body.currentPassword, user.password)
        .then((isMatch) => {
          if (isMatch) {
            const newUser = {
              password: req.body.password
            }

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                  throw err;
                }
                newUser.password = hash;
                Admin.updateOne({
                  _id: req.user.id
                }, {
                  $set: newUser
                }, {}, (err, doc) => {
                  if (err) {
                    console.error(err);

                    return res.status(500).json(err);
                  }

                  return res.status(200).json({
                    redirect: '/profile'
                  });
                })
              })
            });
          } else {
            return res.status(401).json({
              errors: {
                currentPassword: "Current password is incorrect"
              }
            });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json(err);
        });

    });

  }
)

module.exports = router;
