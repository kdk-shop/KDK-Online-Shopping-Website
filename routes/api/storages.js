const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load validators
const validateStorageInfo =
  require('../../validation/storage/validateStorageInfo');

const Storage = require('../../models/Storage');
const Inventory = require('../../models/Inventory');

router.get('',
  passport.authenticate('admin-auth', {
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

  return Storage.countDocuments()
    .then((count) => Storage.find()
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort(sortBy)
      .then((documents) => {
        res.status(200).json({
          message: "Page fetched successfuly",
          maxStorages: count,
          storages: documents
        });
      }));
});

router.post("/create/",
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {

    const {
      errors,
      isValid
    } = validateStorageInfo(req.body);
    //check validation

    if (!isValid) {
      return res.status(400).json(errors)
    }
    Storage.findOne({
      name: req.body.name
    }, (err, storage) => {
      if (storage) {

        return res.status(409).json({
          errors: {
            name: 'Storage with this name already exists'
          }
        });
      }

      const newInventory = new Inventory();

      newInventory.save()
        .then((inventory) => {
          let newStorage = new Storage({
            name: req.body.name,
            inventory: inventory._id
          });

          if (req.body.address !== null) {
            newStorage.address = req.body.address;
          }

          return newStorage.save()
            .then((storage) => res.status(201).json(storage))
            .catch((err) => {
              console.error(err);

              return res.status(500).json({
                message: "Server could not save storage on database"
              })
            });
        })
        .catch((err) => {
          console.error(err);

          return res.status(500).json({
            message: "Server could not save inventory on database"
          })
        });

    });

  });

/**
 * PUT     update existing storage
 *@route  {PUT} /api/storages/update/:storage_id
 */
router.put("/update/:storage_id",
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {

    const {
      errors,
      isValid
    } = validateStorageInfo(req.body);
    //check validation

    if (!isValid) {
      return res.status(400).json(errors)
    }
    let updatedProduct = {
      name: req.body.name
    };

    if (req.body.address !== null) {
      updatedProduct.address = req.body.address;
    }

    Storage.findOneAndUpdate({
        _id: req.params.storage_id
      }, {
        "$set": updatedProduct
      }, {},
      (err, doc) => {
        if (doc === null) {
          return res.status(404).json({
            message: "Storage not found"
          })
        }
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Could not update storage in database"
          });
        }

        Storage.findById(
          req.params.storage_id,
          (err, storage) => res.status(200).json(storage)
        );
      }
    )
  });

router.delete("/delete/:storage_id",
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {

    Storage.findOneAndDelete({
      _id: req.params.storage_id
    }, (err, storage) => {
      if (storage === null) {
        return res.status(404).json({
          message: "Storage not found"
        })
      }
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Could not delete storage from database"
        })
      }
      Inventory.findOneAndDelete({
        _id: storage.inventory
      }, (err, inventory) => {
        if (inventory === null) {
          return res.status(404).json({
            message: "Storage's inventory not found"
          })
        }
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Could not delete inventory from database"
          })
        }

        return res.status(200).json(storage)
      });
    });
  });

router.get('/:storage_id', (req, res) => {
  Storage.findById(req.params.storage_id).then((storage) => {
      if (storage) {
        res.status(200).json(storage);
      } else {
        res.status(404).json({
          error: {
            message: "Storage not found"
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
