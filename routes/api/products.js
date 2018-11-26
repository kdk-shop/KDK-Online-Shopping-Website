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
 *@name   Get Product_id
 */
router.get('/:product_id', (req, res) => {
  Product.findById(req.params.product_id).then((product) => {
    if (product) {
      const imageFiles = product.imageFiles;
      let imagePaths = [];

      for (let i = 0; i < imageFiles.length; i += 1) {
        const url = req.protocol + "://" + req.get("host");
        const imagePath = url + "/images/" + imageFiles[i];

        imagePaths.push(imagePath);
      }
      let resProduct = JSON.parse(JSON.stringify(product));

      resProduct.imagePaths = imagePaths;
      delete resProduct.imageFiles;

      res.status(200).json(resProduct)
    } else {
      res.status(404).json({
        message: "Product not found!"
      })
    }
  })
})

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
  const productQuery = Product.find();
  let fetchedProducts = [];

  //Default values
  if (isNaN(pageSize)) {
    pageSize = 10;
  }
  if (isNaN(currentPage)) {
    currentPage = 1;
  }
  console.log(pageSize)
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
    .limit(pageSize);

  return productQuery
    .then((documents) => {
      fetchedProducts = documents;

      return Product.count()
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
          message: "Products not found!"
        });
      }
    });

})
module.exports = router;
