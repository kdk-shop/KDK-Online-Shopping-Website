const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load validators

const Storage = require('../../models/Storage');
const Inventory = require('../../models/Inventory');
const Product = require('../../models/Product');

router.get('/',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {
    let pageSize = Number(req.query.pagesize);
    let currentPage = Number(req.query.page);
    let sortBy = 'title'

    const defaultPageSize = 10;
    const defaultPage = 1;

    if (isNaN(pageSize)) {
      pageSize = defaultPageSize;
    }
    if (isNaN(currentPage)) {
      currentPage = defaultPage;
    }

    return Storage.findOne({
      _id: req.params.storage_id
    }).then((storage) => {
      Inventory.countDocuments({
        _id: storage.inventory
      }).then((count) => {
        Inventory.findOne({
            _id: storage.inventory
          }).skip(pageSize * (currentPage - 1))
          .limit(pageSize)
          .sort(sortBy)
          .then((documents) => {
            res.status(200).json({
              message: "Page fetched successfuly",
              maxProducts: count,
              inventory: products.documents
            });
          })
      });
    });
  });

module.exports = router;
