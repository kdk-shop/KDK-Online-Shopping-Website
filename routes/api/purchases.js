const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Product = require('../../models/Product');
const Purchase = require('../../models/Purchase');

/**
 * Get paginated purchase information sorted by -purchaseDate
 *@route  {GET} /api/purchases
 *@name   Get Purchases
 *@queryparam {Number} [pagesize=10] Number of purchases to return
 *@queryparam {Number} [page=1] Number of page
 *@queryparam {Date} [startDate] Optional date range specifier
 *@queryparam {Date} [endDate] Optional date range specifier
 */
router.get('',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {
    let pageSize = Number(req.query.pagesize);
    let currentPage = Number(req.query.page);

    let queryString = {};

    const defaultPageSize = 10;
    const defaultPage = 1;

    if (isNaN(pageSize)) {
      pageSize = defaultPageSize;
    }
    if (isNaN(currentPage)) {
      currentPage = defaultPage;
    }

    if (req.query.startDate !== undefined) {
      if (req.query.endDate !== undefined) {
        queryString = {
          'purchaseDate': {
            '$gte': new Date(req.query.startDate),
            '$lte': new Date(req.query.endDate)
          }
        }
      } else {
        queryString = {
          'purchaseDate': {
            '$gte': new Date(req.query.startDate)
          }
        }
      }
    } else if (req.query.endDate !== undefined) {
      queryString = {
        'purchaseDate': {
          '$lte': new Date(req.query.endDate)
        }
      }
    }

    Purchase.countDocuments(queryString)
      .then((count) => Purchase.find(queryString)
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort('-purchaseDate')
        .then((documents) => {
          res.status(200).json({
            message: "Page fetched successfuly",
            maxPurchases: count,
            purchases: documents
          });
        })
      )
  });

module.exports = router;
