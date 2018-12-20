const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load validators
const validateStorageInfo =
  require('../../validation/storage/validateStorageInfo');

const User = require('../../models/User');
const Product = require('../../models/Product');

router.get('',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {
    let pageSize = Number(req.query.pagesize);
    let currentPage = Number(req.query.page);
    let sortBy = 'name'

    const defaultPageSize = 10;
    const defaultPage = 1;

    if (isNaN(pageSize)) {
      pageSize = defaultPageSize;
    }
    if (isNaN(currentPage)) {
      currentPage = defaultPage;
    }

    User.findOne({
        _id: req.user.id
      }).then((user) => {
        if (user) {
          return res.status(200).json({
            message: 'Cart fetched successfully',
            cart: user.shoppingCart.slice((currentPage - 1) * pageSize,
              currentPage * pageSize + 1)
          });
        }

        return res.status(404).json({
          message: 'User not found'
        });

      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

router.post('',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {
    let qty = -1;

    if (!isNaN(req.body.qty)) {
      qty = req.body.qty;
    }

    if (qty === undefined || qty < 1) {
      return res.status(400).json({
        errors: {
          qty: "Enter valid quantity (>= 1)"
        }
      });
    }

    User.findOne({
        _id: req.user.id
      }).then((user) => {
        if (user) {
          let cart = user.shoppingCart;
          let indexOfTarget = -1;

          for (let i = 0; i < cart.length; i += 1) {
            if (String(cart[i].product) === req.body.productId) {
              indexOfTarget = i;
              break;
            }
          }

          if (indexOfTarget !== -1) {
            return res.status(409).json({
              message: 'Product already exists in cart'
            })
          }

          cart.push({
            product: req.body.productId,
            qty
          });
          user.save((err, doc) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: 'Could not save product in user cart'
              });
            }

            return res.status(201).json({
              message: 'Product added to user cart',
              user: doc
            });
          });
        } else {

          return res.status(404).json({
            message: 'User not found'
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

router.patch('',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {
    let qty = -1;

    if (!isNaN(req.body.qty)) {
      qty = req.body.qty;
    }

    if (qty === undefined || qty < 1) {
      return res.status(400).json({
        errors: {
          qty: "Enter valid quantity (>= 1)"
        }
      });
    }

    User.findOne({
        _id: req.user.id
      }).then((user) => {
        if (user) {
          let cart = user.shoppingCart;
          let indexOfTarget = -1;

          for (let i = 0; i < cart.length; i += 1) {
            if (String(cart[i].product) === req.body.productId) {
              indexOfTarget = i;
              break;
            }
          }

          if (indexOfTarget === -1) {
            return res.status(404).json({
              message: 'Product not found'
            })
          }

          cart[indexOfTarget].qty = qty;
          user.save((err, doc) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: 'Could not save product in user cart'
              });
            }

            return res.status(200).json({
              message: 'Product added to user cart',
              user: doc
            });
          });
        } else {

          return res.status(404).json({
            message: 'User not found'
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

router.delete('',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {
    User.findOne({
        _id: req.user.id
      }).then((user) => {
        if (user) {
          let cart = user.shoppingCart;
          let indexOfTarget = -1;

          for (let i = 0; i < cart.length; i += 1) {
            if (String(cart[i].product) === req.body.productId) {
              indexOfTarget = i;
              break;
            }
          }

          if (indexOfTarget === -1) {
            return res.status(404).json({
              message: 'Product not found'
            })
          }
          cart.splice(indexOfTarget, 1);

          user.save((err, doc) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: 'Could not save product in user cart'
              });
            }

            return res.status(200).json({
              message: 'Product deleted from user cart',
              user: doc
            });
          });
        } else {

          return res.status(404).json({
            message: 'User not found'
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

module.exports = router;
