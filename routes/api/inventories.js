const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load validators

const Storage = require('../../models/Storage');
const Inventory = require('../../models/Inventory');
const Product = require('../../models/Product');
const Update = require('../../models/Update');

/**
 * Get products not in inventory
 *@route  {GET} /api/inventories/:storage_id/products_not_in
 *@name   Get Products not in inventory
 *@queryparam {String} [title] String to search for in titles
 */
router.get('/:storage_id/products_not_in',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => Storage.findOne({
    _id: req.params.storage_id
  }).then((storage) => {

    let queryParam = {};

    if (req.query.title) {
      queryParam.title = new RegExp(req.query.title, 'i')
    }

    if (storage) {
      Inventory.findOne({
          _id: storage.inventory
        })
        .then(async (inventory) => {
          let productsInInventory = {};
          let productsNotIn = [];

          for (let i = 0; i < inventory.products.length; i += 1) {
            productsInInventory[inventory.products[i].product] = true;
          }

          let i = 0;

          while (productsNotIn.length < 20) {
            let fetchedProduct;

            try {
              fetchedProduct = await Product.findOne(queryParam).skip(i)
                .exec();
            } catch (err) {

              return res.status(500).json({
                message: 'Could not querry products'
              });
            }
            if (fetchedProduct === null) {
              break;
            }

            if (productsInInventory[fetchedProduct._id] !== true) {
              productsNotIn.push(fetchedProduct);
            }

            i += 1;
          }

          res.status(200).json({
            message: "Page fetched successfuly",
            products: productsNotIn
          });
        })
        .catch((err) => {
          console.error(err);

          return res.status(500).json({
            message: "Server could not retrieve inventory from database"
          });
        });
    } else {
      return res.status(404).json({
        message: 'Storage not found'
      });
    }
  })
  .catch((err) => {
    console.error(err);

    return res.status(500).json({
      message: "Server could not retrieve storage from database"
    })
  }));

//Retrieve list of products in inventory
router.get('/:storage_id/',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {
    let pageSize = Number(req.query.pagesize);
    let currentPage = Number(req.query.page);
    let sortBy = 'title';

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
        if (storage) {
          Inventory.countDocuments({
              _id: storage.inventory
            }).then((count) => {
              Inventory.findOne({
                  _id: storage.inventory
                }).skip(pageSize * (currentPage - 1))
                .limit(pageSize)
                .sort(sortBy)
                .populate('products.product')
                .then((documents) => {
                  res.status(200).json({
                    message: "Page fetched successfuly",
                    maxProducts: count,
                    inventory: documents.products
                  });
                })
            })
            .catch((err) => {
              console.error(err);

              return res.status(500).json({
                message: "Server could not retrieve inventory from database"
              })
            });
        } else {
          return res.status(404).json({
            message: "Storage not found"
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: "Server could not retrieve storage from database"
        })
      });
  });

//Add a product to inventory
router.post('/:storage_id/',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {
    let qty = Number(req.body.qty);

    if (qty === undefined || qty < 1) {
      return res.status(400).json({
        errors: {
          'qty': "Enter valid quantity (>= 1)"
        }
      });
    }
    Storage.findOne({
        _id: req.params.storage_id
      }).then((storage) => {
        if (storage) {
          //Check if product already exists in inventory
          Inventory.findOne({
              _id: storage.inventory
            }).then((inventory) => {
              let duplicateProduct = false;

              for (let i = 0; i < inventory.products.length; i += 1) {
                if (String(inventory.products[i].product) ===
                  req.body.productId) {
                  duplicateProduct = true;
                  break;
                }
              }
              if (duplicateProduct) {
                return res.status(409).json({
                  message: "Product already exists in inventory"
                });
              }

              //Look for product in database
              Product.findOne({
                  _id: req.body.productId
                }).then((product) => {
                  if (product) {
                    //Add product to inventory
                    inventory.products.push({
                      product: req.body.productId,
                      qty
                    })
                    inventory.save((err, doc) => {
                      if (err) {
                        console.error(err);

                        return res.status(500).json({
                          message: 'Could not save product to inventory'
                        });
                      }


                      Update.findOneAndUpdate({
                          'productId': req.body.productId
                        }, {
                          'productId': req.body.productId
                        }, {
                          upsert: true
                        }).then((prod) => res.status(201).json({
                          message: "Product added to inventory",
                          inventory: doc
                        }))
                        .catch((err) => {
                          console.error(err);

                          return res.status(500).json({
                            message: 'Could not queue product ' +
                              'availability update on database'
                          });
                        })

                    });
                  } else {
                    return res.status(404).json({
                      message: "Product not found"
                    });
                  }
                })
                .catch((err) => {
                  console.error(err);

                  return res.status(500).json({
                    message: "Could not look up for product in database"
                  });
                });

            })
            .catch((err) => {
              console.error(err);

              return res.status(500).json({
                message: "Could not look up for duplicate product in database"
              });
            });
        } else {
          return res.status(404).json({
            message: "Storage not found"
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: "Could not look up for storage in database"
        });
      })
  }
);

router.patch('/:storage_id/',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {
    let qty = Number(req.body.qty);

    if (qty === undefined || qty < 1) {
      return res.status(400).json({
        errors: {
          qty: "Enter valid quantity (>= 1)"
        }
      });
    }
    Storage.findOne({
        _id: req.params.storage_id
      }).then((storage) => {
        if (storage) {
          //Check if product exists in inventory
          Inventory.findOne({
              _id: storage.inventory,
              products: {
                '$elemMatch': {
                  product: req.body.productId
                }
              }
            }).then((inventory) => {
              if (inventory) {
                let currentInventory = inventory.products;
                let indexOfTarget = -1;

                for (let i = 0; i < currentInventory.length; i += 1) {
                  if (String(currentInventory[i].product) ===
                    req.body.productId) {
                    indexOfTarget = i;
                    break;
                  }
                }
                if (indexOfTarget === -1) {
                  return res.status(404).json({
                    message: 'Product not found in inventory'
                  });
                }
                currentInventory[indexOfTarget].qty = qty;

                inventory.save((err, doc) => {
                  if (err) {
                    console.error(err);

                    return res.status(500).json({
                      message: 'Could not save inventory on database'
                    });
                  }

                  return res.status(200).json({
                    messaage: 'Updated inventory',
                    inventory: doc
                  });
                });
              } else {
                return res.status(404).json({
                  message: 'Product not found'
                });
              }
            })
            .catch((err) => {
              console.error(err);

              return res.status(500).json({
                message: "Could not look up for inventory in database"
              });
            });
        } else {
          return res.status(404).json({
            message: "Storage not found"
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: "Could not look up for storage in database"
        });
      })
  }
);

router.delete('/:storage_id/',
  passport.authenticate('admin-auth', {
    session: false
  }),
  (req, res) => {
    Storage.findOne({
        _id: req.params.storage_id
      }).then((storage) => {
        if (storage) {
          //Check if product exists in inventory
          Inventory.findOne({
              _id: storage.inventory,
              products: {
                '$elemMatch': {
                  product: req.body.productId
                }
              }
            }).then((inventory) => {
              if (inventory) {
                let currentInventory = inventory.products;
                let indexOfTarget = -1;

                for (let i = 0; i < currentInventory.length; i += 1) {
                  if (String(currentInventory[i].product) ===
                    req.body.productId) {
                    indexOfTarget = i;
                    break;
                  }
                }
                if (indexOfTarget === -1) {
                  return res.status(404).json({
                    message: 'Product not found'
                  });
                }
                currentInventory.splice(indexOfTarget, 1);

                inventory.save((err, doc) => {
                  if (err) {
                    console.error(err);

                    return res.status(500).json({
                      message: 'Could not save inventory on database'
                    });
                  }

                  Update.findOneAndUpdate({
                      productId: req.body.productId
                    }, {
                      'productId': req.body.productId
                    }, {
                      upsert: true
                    }).then((prod) => res.status(200).json({
                      messaage: 'Deleted product from inventory',
                      inventory: doc
                    }))
                    .catch((err) => {
                      console.error(err);

                      return res.status(500).json({
                        message: 'Could not queue product ' +
                          'availability update on database'
                      });
                    })
                });
              }
            })
            .catch((err) => {
              console.error(err);

              return res.status(500).json({
                message: 'Could not look for inventories containing' +
                  ' specified product in database'
              });
            });
        } else {
          return res.status(404).json({
            message: "Storage not found"
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: "Could not look up for storage in database"
        });
      })
  }
);
module.exports = router;
