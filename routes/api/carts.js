const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

//load validators
const validateStorageInfo =
  require('../../validation/storage/validateStorageInfo');

const User = require('../../models/User');
const Product = require('../../models/Product');
const Inventory = require('../../models/Inventory');
const Update = require('../../models/Update');
const Purchase = require('../../models/Purchase');

router.get('',
  passport.authenticate('user-auth', {
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

    User.findOne({
        _id: req.user.id
      }).populate('shoppingCart.product')
      .then((user) => {
        if (user) {
          return res.status(200).json({
            message: 'Cart fetched successfully',
            cart: user.shoppingCart.slice((currentPage - 1) * pageSize,
              currentPage * pageSize + 1)
          });
        }

        return res.status(404).json({
          message: 'User not found'
        });

      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

/*
 *Add product to users cart
 *body params:
 *productId: added product's id
 *qty: quantity of requested product
 */

router.post('',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {
    let qty = -1;

    if (!isNaN(req.body.qty)) {
      qty = req.body.qty;
    }

    if (qty === undefined || qty < 1) {
      return res.status(400).json({
        errors: {
          qty: "Enter valid quantity (>= 1)"
        }
      });
    }

    User.findOne({
        _id: req.user.id
      }).then((user) => {
        if (user) {
          let cart = user.shoppingCart;
          let indexOfTarget = -1;

          for (let i = 0; i < cart.length; i += 1) {
            if (String(cart[i].product) === req.body.productId) {
              indexOfTarget = i;
              break;
            }
          }

          if (indexOfTarget !== -1) {
            return res.status(409).json({
              message: 'Product already exists in cart'
            })
          }

          Product.findOne({
              _id: req.body.productId
            }).then((product) => {
              if (product === undefined || product.available !== true) {
                return res.status(400).json({
                  message: 'Product not available'
                });
              }
              cart.push({
                product: req.body.productId,
                qty
              });
              user.save((err, doc) => {
                if (err) {
                  console.error(err);

                  return res.status(500).json({
                    message: 'Could not save product in user cart'
                  });
                }

                return res.status(201).json({
                  message: 'Product added to your cart',
                  user: doc
                });
              });
            })
            .catch((err) => {
              console.error(err);

              return res.status(500).json({
                message: 'Could not query product on database'
              });
            });
        } else {

          return res.status(404).json({
            message: 'User not found'
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

router.patch('',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {
    let qty = -1;

    if (!isNaN(req.body.qty)) {
      qty = req.body.qty;
    }

    if (qty === undefined || qty < 1) {
      return res.status(400).json({
        errors: {
          qty: "Enter valid quantity (>= 1)"
        }
      });
    }

    User.findOne({
        _id: req.user.id
      }).then((user) => {
        if (user) {
          let cart = user.shoppingCart;
          let indexOfTarget = -1;

          for (let i = 0; i < cart.length; i += 1) {
            if (String(cart[i].product) === req.body.productId) {
              indexOfTarget = i;
              break;
            }
          }

          if (indexOfTarget === -1) {
            return res.status(404).json({
              message: 'Product not found'
            })
          }

          cart[indexOfTarget].qty = qty;
          user.save((err, doc) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: 'Could not save product in user cart'
              });
            }

            return res.status(200).json({
              message: 'Product quantity updated',
              user: doc
            });
          });
        } else {

          return res.status(404).json({
            message: 'User not found'
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

router.delete('',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {
    User.findOne({
        _id: req.user.id
      }).then((user) => {
        if (user) {
          let cart = user.shoppingCart;
          let indexOfTarget = -1;

          for (let i = 0; i < cart.length; i += 1) {
            if (String(cart[i].product) === req.body.productId) {
              indexOfTarget = i;
              break;
            }
          }

          if (indexOfTarget === -1) {
            return res.status(404).json({
              message: 'Product not found'
            })
          }
          cart.splice(indexOfTarget, 1);

          user.save((err, doc) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: 'Could not save product in your cart'
              });
            }

            return res.status(200).json({
              message: 'Product deleted from your cart',
              user: doc
            });
          });
        } else {

          return res.status(404).json({
            message: 'User not found'
          });
        }
      })
      .catch((err) => {
        console.error(err);

        return res.status(500).json({
          message: 'Could not look for user in database'
        });
      });
  });

//Purchase products in user cart and update inventories
router.post('/checkout',
  passport.authenticate('user-auth', {
    session: false
  }),
  (req, res) => {

    User.findOne({
      _id: req.user.id
    }).then((user) => {
      let productQueries = [];
      let productsInCart = [];
      let promises = [];
      let inventoriesToUpdate = {};
      let purchasedProducts = [];

      if (user.shoppingCart.length === 0) {
        return res.status(400).json({
          message: "No items in user cart"
        });
      }
      //Construct quries for checking each item in inventory
      for (let i = 0; i < user.shoppingCart.length; i += 1) {
        productQueries.push(Inventory.findOne({
          products: {
            '$elemMatch': {
              product: user.shoppingCart[i].product,
              qty: {
                '$gte': user.shoppingCart[i].qty
              }
            }
          }
        }));

        productsInCart.push({
          product: user.shoppingCart[i].product,
          qty: user.shoppingCart[i].qty
        });
      }

      //Check if all items exist in inventories
      Promise.all(productQueries).then(async (inventories) => {
        for (let i = 0; i < inventories.length; i += 1) {
          if (inventories[i] === null) {
            return res.status(404).json({
              message: "No inventory found with requested product and quantity"
            });
          }
        }

        //Update inventories and product availabilities

        for (let k = 0; k < productsInCart.length; k += 1) {
          let item = productsInCart[k];

          try {
            let inventory = await Inventory.findOne({
              products: {
                '$elemMatch': {
                  product: item.product,
                  qty: {
                    '$gte': item.qty
                  }
                }
              }
            }).exec();
            let currentInventory = inventory.products;
            let targetProduct = null;
            let indexOfTarget = -1;

            if (inventoriesToUpdate[inventory._id] !== undefined) {
              currentInventory = inventoriesToUpdate[inventory._id];
            }
            for (let i = 0; i < currentInventory.length; i += 1) {
              if (String(currentInventory[i].product) ===
                String(item.product)) {
                targetProduct = currentInventory[i];
                indexOfTarget = i;
                break;
              }
            }

            if (targetProduct.qty - item.qty > 0) {
              targetProduct.qty -= item.qty;
            } else {
              currentInventory.splice(indexOfTarget, 1);
              promises.push(Update.findOneAndUpdate({
                productId: targetProduct.product
              }, {
                'productId': targetProduct.product
              }, {
                upsert: true
              }).exec());
            }

            let retrievedProduct

            try {
              retrievedProduct = await Product.findOne({
                _id: item.product
              }).exec();
            } catch (err) {
              console.error(err);

              return res.status(500).json({
                message: "Could not query product on database"
              });
            }
            purchasedProducts.push({
              product: {
                _id: retrievedProduct._id,
                title: retrievedProduct.title,
                category: retrievedProduct.category,
                brand: retrievedProduct.brand,
                price: retrievedProduct.price
              },
              qty: item.qty
            });
            //Queue up inventory update
            if (inventoriesToUpdate[inventory._id] === undefined) {
              inventoriesToUpdate[String(inventory._id)] = currentInventory;
            }
            //Last round of loop: update users and inventories here
            if (k === productsInCart.length - 1) {
              for (let key in inventoriesToUpdate) {
                if (inventoriesToUpdate.hasOwnProperty(key)) {
                  //Update inventory
                  promises.push(Inventory.findOneAndUpdate({
                    _id: key
                  }, {
                    'products': inventoriesToUpdate[key]
                  }).exec());
                }
              }
              user.shoppingCart = [];
              promises.push(user.save())

              Promise.all(promises).then(async (promiseReturn) => {
                purchaseUser = {
                  email: user.email,
                  name: user.name,
                  phoneNumber: user.phoneNumber,
                  address: user.address
                };

                let purchase = new Purchase({
                  'user': purchaseUser,
                  'products': purchasedProducts
                });

                try {
                  purchase = await purchase.save();
                } catch (err) {
                  console.error(err);

                  return res.status(500).json({
                    message: 'Could not save purchase on database'
                  });
                }

                return res.status(200).json({
                  message: 'Items purchased successfuly',
                  user,
                  purchase
                })
              }, (err) => {
                console.error(err);

                return res.status(500).json({
                  message: 'Could not save user on database'
                });
              });
            }
          } catch (err) {
            console.error(err);

            return rest.status(500).json({
              message: 'Could not query inventories on database'
            });
          }
        }
      });
    });
  });

module.exports = router;
