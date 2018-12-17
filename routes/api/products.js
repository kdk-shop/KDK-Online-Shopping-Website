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
const multer = require('multer');
const staticsPath = require('../../config/storage').staticsPath;
const path = require('path');

//load validators
const validateProductInfo =
  require('../../validation/product/validateProductInfo.js')

//load product model
const Product = require('../../models/Product');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(staticsPath, 'images', 'full'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

let upload = multer({
  storage
});

/**
 * Get paginated product information
 *@route  {GET} /api/products
 *@name   Get Products
 *@queryparam {Number} [pagesize=10] Number of products to return
 *@queryparam {Number} [page=1] Number of page
 *@queryparam {String} [title] String to search for in titles
 *@queryparam {String} [category] Cateogry to search for
 *@queryparam {String} [brand] Brand to search for
 *@queryparam {Number} [minPrice] Minimum product price
 *@queryparam {Number} [maxPrice] Maximum product price
 *@queryparam {Boolean} [available]
 *@queryparam {Number} [minScore] Minimum rating score
 *@queryparam {String} [sortBy=title] Specify which field to sort by
 */
router.get('', (req, res) => {
  let pageSize = Number(req.query.pagesize);
  let currentPage = Number(req.query.page);
  let sortBy = 'title'

  let queryParams = [];
  //Default values

  const defaultPageSize = 12;
  const defaultPage = 1;

  if (isNaN(pageSize)) {
    pageSize = defaultPageSize;
  }
  if (isNaN(currentPage)) {
    currentPage = defaultPage;
  }
  //Set up query parameters
  if (req.query.title) {
    queryParams.push({
      'title': new RegExp(req.query.title, 'i')
    });
  }

  if (req.query.category) {
    queryParams.push({
      'category': req.query.category
    });
  }

  if (req.query.brand) {
    queryParams.push({
      'brand': req.query.brand
    });
  }

  if (req.query.minPrice) {
    queryParams.push({
      'price': {
        '$gte': req.query.minPrice
      }
    });
  }

  if (req.query.maxPrice) {
    queryParams.push({
      'price': {
        '$lte': req.query.maxPrice
      }
    });
  }

  if (req.query.available) {
    queryParams.push({
      'available': req.query.available
    });
  }

  if (req.query.minScore) {
    queryParams.push({
      'rating.score': {
        '$gte': req.query.minScore
      }
    });
  }

  if (req.query.sortBy) {
    sortBy = req.query.sortBy;
  }

  if (pageSize < 1 || pageSize > 100) {
    pageSize = defualtPageSize;
  }

  if (currentPage < 1) {
    page = defaultPage;
  }

  const queryString = queryParams.length === 0 ? {} : {
    '$and': queryParams
  };

  return Product.countDocuments(queryString)
    .then((count) => Product.find(queryString)
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort(sortBy)
      .then((documents) => {
        res.status(200).json({
          message: "Page fetched successfuly",
          maxProducts: count,
          products: documents
        });
      }));
});

/**
 * POST     create new product
 *@route  {POST} /api/products/create/
 */
router.post("/create/",
  passport.authenticate('jwt', {
    session: false
  }),
  upload.single('image'),
  (req, res) => {

    if (req.user.accessLevel !== 'Admin') {
      return res.status(401).json({
        message: "You do not have privilages for this action"
      });
    }

    const {
      errors,
      isValid
    } = validateProductInfo(req.body);
    //check validation

    if (!isValid) {
      return res.status(400).json(errors)
    }
    Product.findOne({
      title: req.body.title
    }, (err, product) => {
      if (product) {

        return res.status(409).json({
          title: 'Product with this title already exists'
        });
      }

      const newProduct = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        brand: req.body.brand,

        available: false,
        imagePaths: req.file === undefined ? [] : [
          'http://kdkshop.ir/images/' + req.file.filename
        ],
        rating: {
          score: 0,
          count: 0
        },
        reviews: []

      });

      return newProduct.save().then((product) => res.status(201).json(product))
        .catch((err) => {
          console.error(err);

          return res.status(500).json({
            message: "Server could not save product on database"
          })
        });
    });

  });

/**
 * PUT     update existing product
 *@route  {PUT} /api/products/update/:product_id
 */
router.put("/update/:product_id",
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {

    if (req.user.accessLevel !== 'Admin') {
      return res.status(401).json({
        message: "You do not have privilages for this action"
      });
    }

    const {
      errors,
      isValid
    } = validateProductInfo(req.body);
    //check validation

    if (!isValid) {
      return res.status(400).json(errors)
    }
    const updatedProduct = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand
    };

    Product.findOneAndUpdate({
        _id: req.params.product_id
      }, {
        "$set": req.body
      }, {},
      (err, doc) => {
        if (doc === null) {
          return res.status(404).json({
            message: "Product not found!"
          })
        }
        if (err) {
          return res.status(500).json({
            message: "Could not update product!"
          });
        }

        Product.findById(
          req.params.product_id,
          (err, product) => res.status(200).json(product)
        );
      }
    )
  });

/**
 * DELETE     delete existing product
 *@route  {DELETE} /api/products/delete/:product_id
 */
router.delete("/delete/:product_id",
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {

    if (req.user.accessLevel !== 'Admin') {
      return res.status(401).json({
        message: "You do not have privilages for this action"
      });
    }

    Product.findOneAndDelete({
      _id: req.params.product_id
    }, (err, product) => {
      if (product === null) {
        return res.status(404).json({
          message: "Product not found"
        })
      }
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Could not delete product from database"
        })
      }

      return res.status(200).json(product)
    });
  });

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

    let currentScore = product.rating.score;
    let currentCount = product.rating.count;
    let totalScore = currentScore * currentCount;

    product.rating.count = currentCount + 1;
    product.rating.score = (totalScore + score) / product.rating.count;

    product.reviews.push(review);
    product.save()
      .then((product) => res.status(201).json({
        product
      }))
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          message: "Server could not save review on db"
        })
      })
  });
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
    .catch((err) => {
      console.error(err)
      res.status(400).json({
        message: "Invalid object id format"
      });
    })
})


module.exports = router;
