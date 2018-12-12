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
 * Get paginated product information
 *@route  {GET} /api/products
 *@name   Get Products
 *@queryparam {Number} [pagesize=10] Number of products to return
 *@queryparam {Number} [page=1] Number of page
 */
router.get('', (req, res) => {
  let pageSize = Number(req.query.pagesize);
  let currentPage = Number(req.query.page);
  let search = req.query.search;

  let productQuery = Product.find();
  let fetchedProducts = [];
  //Default values

  if (isNaN(pageSize)) {
    pageSize = 10;
  }
  if (isNaN(currentPage)) {
    currentPage = 1;
  }
  if (search) {
    productQuery = Product.find({
      title: new RegExp(search, 'i')
    })
  }

  if (pageSize < 1 || pageSize > 100) {
    return res.status(400).json({
      message: "Invalid page size!"
    })
  }
  if (currentPage < 1) {
    return res.status(400).json({
      message: "Invalid page request!"
    })
  }

  productQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .sort('-title');

  return productQuery
    .then((documents) => {
      fetchedProducts = documents;

      return Product.countDocuments()
    })
    .then((count) => {
      if (fetchedProducts.length > 0) {
        res.status(200).json({
          message: "Page fetched successfuly!",
          maxProducts: count,
          products: fetchedProducts
        })
      } else {
        res.status(404).json({
          message: "Product not found!"
        });
      }
    });

})

/**
 * Put     product review and score
 *@route  {Put} /api/products/review/:product_id/:user_id
 */
router.put("/review/:product_id/:user_id", (req, res) => {
  Product.findById(req.params.product_id).then((product) => {

    let score = parseInt(req.body.score, 10);
    let review = {
      creatorId: req.params.user_id,
      creatorName: req.body.name,
      review: req.body.text,
      recommended: req.body.recommended,
      score
    };

    product.reviews.push(review);
    product.save()
      .then((product) => res.status(201).json({
        product
      }))
      .catch((err) => {
        res.status(500).json({
          message: "Server could not save review on db!"
        })
      })
  });
})


/**
 * Get    add product for testing purpose
 *@route  {GET} /api/products/add
 */
router.get('/add', (req, res) => {
  let newProduct = new Product({
    title: req.body.title,
    brand: req.body.brand,
    category: req.body.category,
    price: req.body.price
  })

  newProduct.save()
    .then((data) => {
      res.send({
        data
      })
    })
    .catch((err) => console.log(err))
})

/**
 * Get product information
 *@route  {GET} /api/products/:product_id
 *@name   Get Product_id
 */
router.get('/:product_id', (req, res) => {
  Product.findById(req.params.product_id).then((product) => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({
          error: {
            message: "Product not found"
          }
        })
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: {
          message: "Invalid object id format"
        }
      });
    })
})


module.exports = router;
