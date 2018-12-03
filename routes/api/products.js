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
  console.log(req.query)
  let pageSize = Number(req.query.pagesize);
  let currentPage = Number(req.query.page);
  let search = req.query.search;
  console.log(search)
  let productQuery = Product.find();
  let fetchedProducts = [];
  //Default values
  if (isNaN(pageSize)) {
    pageSize = 10;
  }
  if (isNaN(currentPage)) {
    currentPage = 1;
  }
  if(search){
    productQuery = Product.find({title: new RegExp(search,'i')})
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
          message: "Products not found!"
        });
      }
    });

})

router.put("/review/:product_id/:user_id",(req,res)=>{
  Product.findById(req.params.product_id).then((product) => {
    let text = req.body.text;
    let recommended = req.body.recommended === 'true';
    review = {creatorId:req.params.user_id,review:text,recommended:recommended};
    product.reviews.push(review);
    product.save()
    .then((product) => res.status(201).json({
      product:product
    }))
    .catch((err) => {
      res.status(500).json({
        message: "Server could not save product on db!"
      })
    })
  });
})

router.put("/score/:product_id/:user_id",(req,res)=>{
  Product.findById(req.params.product_id).then((product) => {
    let score = parseInt(req.body.score);
    
    let rate = {userId:req.params.user_id,score:score};
    product.userRates.push(rate);
    product.save()
    .then((product) => res.status(201).json({
      product:product
    }))
    .catch((err) => {
      res.status(500).json({err:err,
        message: "Server could not save product on db!"
      })
    })
  });
})

router.get('/add',(req,res)=>{
  let newProduct = new Product({
    title: "N551ZW",
    brand : "Asus",
    category: "Laptop",
    price: "4000000"
  })

  newProduct.save()
  .then((data)=>{
    res.send({data:data})
  })
  .catch( err => console.log(err))
})

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

module.exports = router;
