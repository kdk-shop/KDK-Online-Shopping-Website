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
const passport = require('passport');
const multer = require('multer');
const staticsPath = require('../../config/storage').staticsPath;
const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');

//load validators
const validateProductInfo =
  require('../../validation/product/validateProductInfo.js')

//load product model
const Product = require('../../models/Product');

//Utility functions
function imageFilter(req, file, cb) {
  //accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    console.error('Invalid file format! Only .jpg/jpeg/png/gif allowed.')
    console.error('file name: ' + file.originalname)

    return cb(null, false);
  }
  cb(null, true);
}

function updateProducts(res) {
  childProcess.exec('/root/update_products.py', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Could not update products availability"
      });
    }
    res.status(200).json({
      message: "Products updated succesfully"
    });
  });
}

//Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(staticsPath, 'images', 'full'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

let upload = multer({
  storage,
  fileFilter: imageFilter
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

router.get('/recent', (req, res) => {
  let count = Number(req.query.count);
  let sortBy = '-date'

  const defaultCount = 10;

  if (isNaN(count)) {
    count = defaultCount;
  }

  return Product.find({})
    .sort(sortBy)
    .limit(count)
    .then((documents) => {
      res.status(200).json({
        message: "Page fetched successfuly",
        products: documents
      });
    })
    .catch((err) => {
      console.error(err);

      return res.status(500).json({
        message: 'Could not query database'
      });
    });
});

router.get('/amazing', (req, res) => {
  let count = Number(req.query.count);
  let sortBy = '-date'

  const defaultCount = 10;

  if (isNaN(count)) {
    count = defaultCount;
  }

  return Product.find({
      discountedPrice: {
        '$exists': true
      }
    })
    .sort(sortBy)
    .limit(count)
    .then((documents) => {
      res.status(200).json({
        message: "Page fetched successfuly",
        products: documents
      });
    })
    .catch((err) => {
      console.error(err);

      return res.status(500).json({
        message: 'Could not query database'
      });
    });
});

/**
 * POST     create new product
 *@route  {POST} /api/products/create/
 *@bodyparam title
 *@bodyparam price
 *@bodyparam description
 *@bodyparam category
 *@bodyparam brand
 *@bodyparam image
 */
router.post("/create/",
  passport.authenticate('admin-auth', {
    session: false
  }),
  upload.single('image'),
  (req, res) => {
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
        imagePaths: req.file === undefined ? [
          'http://kdkshop.ir/images/not-found.png'
        ] : ['http://kdkshop.ir/images/' + req.file.filename],
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
 *@bodyparam title
 *@bodyparam price
 *@bodyparam description
 *@bodyparam category
 *@bodyparam brand
 *@bodyparam image
 */
router.put("/update/:product_id",
  passport.authenticate('admin-auth', {
    session: false
  }),
  upload.single('image'),
  (req, res) => {

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

    if (req.file !== undefined) {
      updatedProduct.imagePaths = [
        'http://kdkshop.ir/images/' + req.file.filename
      ];
    }
    Product.findOneAndUpdate({
        _id: req.params.product_id
      }, {
        "$set": updatedProduct
      }, {},
      (err, doc) => {
        if (doc === null) {
          return res.status(404).json({
            message: "Product not found"
          })
        }
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Could not update product in database"
          });
        }

        let oldImageName = doc.imagePaths[0].split('/');

        oldImageName = oldImageName[oldImageName.length - 1];
        if (req.file !== undefined && oldImageName !== 'not-found.png') {

          let oldImagePath = path.join(staticsPath,
            'images', 'full', oldImageName);

          fs.unlinkSync(oldImagePath);
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
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {

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
      let oldImageName = product.imagePaths[0].split('/');

      oldImageName = oldImageName[oldImageName.length - 1];

      if (oldImageName !== 'not-found.png') {

        let oldImagePath = path.join(staticsPath,
          'images', 'full', oldImageName);

        fs.unlinkSync(oldImagePath);
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

    let reviews = product.reviews;
    let prevReview = null;

    for (let i = 0; i < reviews.length; i += 1) {
      if (String(reviews[i].creatorId) === String(req.params.user_id)) {
        prevReview = reviews[i];
        break;
      }
    }

    if (prevReview === null) {
      let score = parseInt(req.body.score, 10);
      let currentScore = product.rating.score;
      let currentCount = product.rating.count;
      let totalScore = currentScore * currentCount;

      let newReview = {
        creatorId: req.params.user_id,
        creatorName: req.body.name,
        review: req.body.text,
        recommended: req.body.recommended,
        score
      };

      product.rating.count = currentCount + 1;
      product.rating.score = (totalScore + score) / product.rating.count;

      product.reviews.push(newReview);

      return product.save()
        .then((product) => res.status(201).json({
          message: 'Review added successfully',
          product
        }))
        .catch((err) => {
          console.error(err);

          return res.status(500).json({
            message: "Server could not save product on database"
          });
        });
    }

    let newScore = parseInt(req.body.score, 10);
    let prevScore = prevReview.score;
    let currentScore = product.rating.score;
    let totalScore = currentScore * product.rating.count;

    prevReview.review = req.body.text;
    prevReview.recommended = req.body.recommended;
    prevReview.score = newScore;

    product.rating.score =
      (totalScore + newScore - prevScore) / product.rating.count;

    return product.save()
      .then((product) => res.status(200).json({
        message: 'Review updated successfully',
        product
      }))
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: "Server could not save product on database"
        });
      });
  });
})

router.post('/product_availability', passport.authenticate('admin-auth', {
  session: false
}), (req, res) => {
  if (process.env.NODE_ENV === "PRODUCTION") {
    console.log("Calling update products availability script");
    updateProducts(res);
  }
});

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
