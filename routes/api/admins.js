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
              name: user.name,
              accessLevel: 'Admin'
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
module.exports = router;
