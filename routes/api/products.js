/**
 * Express router providing product related routes
 * @module routes/api/product
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
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load product model
const Product = require('../../models/Product');

/**
 * Get product information
 *@route  {GET} /api/products/:product_id
 *@name   Get Product
 */
router.get('/:product_id', (req, res) => {
  Product.findById(req.params.product_id).then((product) => {
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({
        message: "Product not found!"
      })
    }
  })
})

module.exports = router;
