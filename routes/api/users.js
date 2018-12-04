/**
 * Express router providing user related routes
 * @module routes/api/users
 * @requires express
 * @requires gravatar
 * @requires bcrypt
 * @requires jwt
 * @requires passport
 * @requires generator
 * @requires nodemailer
 * @requires /validation/user
 * @requires /models/User
 */
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const generator = require('generate-password');
const nodemailer = require('nodemailer');

//load validators
const validationRegisterInput = require('../../validation/user/register')
const validationLoginInput = require('../../validation/user/login')
const validationProfileInput = require('../../validation/user/profile')
const validationChangePwdInput = require('../../validation/user/change_pwd')
const validationResetPasswordInput = require('../../validation/user/reset_pwd')

//load user model
const User = require('../../models/User');

/**
 * Register new user
 *@route  {POST} /api/users/register
 *@name   Register User
 *@bodyparam {String} name New user name
 *@bodyparam {String} email New user email
 *@bodyparam {String} address New user address
 *@bodyparam {String} tel New user telphone number
 *@bodyparam {String} password New user password
 *which has to be atleast 6 chars long
 *@bodyparam {String} password2 Password confirmation
 */
router.post('/register', (req, res) => {

  const {
    errors,
    isValid
  } = validationRegisterInput(req.body);
  //check validation

  if (!isValid) {
    return res.status(400).json(errors)
  }
  User.findOne({
      $or: [{
          email: req.body.email
        },
        {
          name: req.body.name
        }
      ]
    })
    .then((user) => {
      if (user) {
        if (user.email === req.body.email) {
          errors.email = 'Email already exists'
        }
        if (user.name === req.body.name) {
          errors.name = 'Username already exists'
        }

        return res.status(409).json(errors)
      }
      const avatar = gravatar.url(req.body.email, {
        //size
        s: '200',
        //rating
        r: 'pg',
        //default
        d: 'mm'
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        address: '',
        phoneNumber: null
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser.save()
            .then((user) => res.status(201).json({
              user,
              redirect: '/login'
            }))
            .catch((err) => {
              console.log(err)
              res.status(500).json({
                message: "Server could not save user on db!"
              })
            })
        })
      })
    })
})

/**
 * Login existing user
 *@route  {GET} /api/users/login
 *@name   Login User
 *@authentication This route requires HTTP Basic Authentication.
 *If authentication fails returns either 401 or 404 HTTP error.
 */
router.post('/login', (req, res) => {
  const {
    errors,
    isValid
  } = validationLoginInput(req.body);
  //check validation

  if (!isValid) {
    return res.status(400).json(errors)
  }
  const email = req.body.email;
  const password = req.body.password;
  //Find user by email

  User.findOne({
      email
    })
    .then((user) => {
      //check for user
      if (!user) {
        errors.email = 'User not found'

        return res.status(404).json(errors)
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
              avatar: user.avatar
            }
            //sign token

            jwt.sign(payload, keys.secretOrKey, {
              expiresIn: '1d'
            }, (err, token) => {
              res.json({
                success: true,
                token,
                redirect: '/profile'
              })
            });
          } else {
            errors.password = 'Password incorrect'

            return res.status(401).json(errors)
          }
        })
    })

})

/**
 * Retrieve requested user profile
 *@route  {GET} /api/users/profile/:user_id
 *@routerparam {String} :user_id Requested user's id
 *@name   Get requested user profile
 */
router.get(
  '/profile/:user_id',
  (req, res) => {
    User.findById(req.param.user_id, (err, user) => {
      if (err) {
        console.log("err");

        return res.status(400).json(err);
      }
      if (!user) {
        return res.status(404).send("User not found!");
      }

      return res.status(200).json({
        name: user.name,
        email: user.email,
        address: user.address,
        tel: user.phoneNumber
      })


    })
  }
)

/**
 *@route  {GET} /api/users/profile
 *@name   Get current user profile
 *@headerparam Authentication jwt token with bearer strategy.
 */
router.get(
  '/profile',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    User.findById(req.user.id, (err, user) => {
      if (err) {
        return res.status(500).json(err)
      }

      res.json({
        name: user.name,
        email: user.email,
        address: user.address,
        tel: user.phoneNumber
      })

    })
  }
)

/**
 * Update current user profile
 *@route  {POST} /api/users/profile
 *@name   Update user profile
 *@bodyparam {String} name New user name
 *@bodyparam {String} email New user email
 *@bodyparam {String} address New user address
 *@bodyparam {String} tel New user telphone number
 */
router.post(
  '/profile',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const {
      errors,
      isValid
    } = validationProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors)
    }
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phoneNumber: req.body.tel
    }

    User.update({
      _id: req.user.id
    }, {
      $set: newUser
    }, {}, (err, doc) => {
      if (err) {
        return res.status(400).json(err)
      }

      return res.json({
        redirect: '/profile'
      });
    })
  }
)

/**
 * Change current user password
 *@route  {PATCH} /api/users/change_pwd
 *@name   Change user password
 *@bodyparam {String} password New user password
 *which has to be atleast 6 chars long
 *@bodyparam {String} password2 Password confirmation
 */
router.post(
  '/change_pwd',
  passport.authenticate('jwt', {
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
    const newUser = {
      password: req.body.password
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        User.update({
          _id: req.user.id
        }, {
          $set: newUser
        }, {}, (err, doc) => {
          if (err) {
            return res.status(500).json(err)
          }

          return res.json({
            redirect: '/profile'
          });
        })
      })
    });
  }
)

/**
 * Reset user password and inform them via email
 *@route  {PATCH} /api/users/reset_pwd
 *@name   Reset password
 *@bodyparam {String} email User's email
 */
router.patch(
  '/reset_pwd',
  (req, res) => {
    const {
      errors,
      isValid
    } = validationResetPasswordInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors)
    }
    const rawPassword = generator.generate({
      length: 20,
      numbers: true
    })
    const newUser = {
      password: rawPassword
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        User.update({
          email: req.body.email
        }, {
          $set: newUser
        }, {}, (err, doc) => {
          if (err) {
            return res.status(500).json(err)
          }
          if (doc.n === 0) {
            errors.email = 'User not found'

            return res.status(404).json(errors)

          }
          const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 25,
            secure: false
          });
          //setup email data with unicode symbols
          const mailOptions = {
            from: '"KDK Shop"<support@kdkshop.ir>',
            to: req.body.email,
            subject: 'Password Reset',
            text: `Dear user your password has been reset.
              Your new password is: ${rawPassword}`,
            html: `<p>Dear user your password has been reset. 
              Your new password is: ${rawPassword}</p>`
          };

          //send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }

            return res.status(303).json({
              redirect:'/login'
            });
          });

        })
      })
    });
  }
)

/**
 *Logout user
 *@route  {GET} /api/users/logout
 *@test   Logout
 */
router.get('/logout', (req, res) => {
  req.logout();

  return res.json({
    redirect: '/'
  });
});

module.exports = router;
