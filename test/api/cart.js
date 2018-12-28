//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const mongoose = require("mongoose");

const Product = require('../../models/Product');
const User = require('../../models/User');
const Inventory = require('../../models/Inventory');
const Update = require('../../models/Update');
const Purchase = require('../../models/Purchase');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const assert = require('assert');


chai.use(chaiHttp);
describe('Carts', () => {
  let testUserId;
  let testProductId;
  let testProduct2Id;
  let newProductId;
  let jwebtoken;

  beforeEach((done) => {
    //Make sure users collection is empty except for test user
    Product.deleteMany({}, (err) => {
      let testProduct = new Product({
        title: "Test product",
        price: 1.0,
        description: "Test description",
        category: "Test",
        brand: "Misc.",
        available: true,
        imagePaths: ["test.jpg"],
        rating: {
          score: 4,
          count: 1
        }
      });

      let testProduct2 = new Product({
        title: "Test product 2",
        price: 1.0,
        description: "Test description",
        category: "Test",
        brand: "Misc.",
        available: false,
        imagePaths: ["test.jpg"],
        rating: {
          score: 4,
          count: 1
        }
      });

      let newProduct = new Product({
        title: "New product",
        price: 1.0,
        description: "New description",
        category: "Test",
        brand: "Misc.",
        available: true,
        imagePaths: ["test.jpg"],
        rating: {
          score: 4,
          count: 1
        }
      });

      testProduct.save((err, product) => {
        testProductId = product._id;
        testProduct2.save((err, product2) => {
          testProduct2Id = product2._id;
          Update.deleteMany({}, (err) => {
            if (err) {
              console.error(err);
            }
          });
          User.deleteMany({}, (err) => {
            let testUser = new User({
              name: "test",
              email: "test@example.com",
              password: "$2a$10$U2axE8DVGi2m/BAt4RDFZeMG" +
                "t0OPSkRf8T0oec5KFVIBy5Y4fGBUa",
              address: "Test address",
              phoneNumber: 989120000000,
              shoppingCart: [{
                product: testProductId,
                qty: 1
              }]
            });

            testUser.save((err, user) => {
              testUserId = user._id;
              const payload = {
                id: user._id,
                name: 'test'
              };

              jwt.sign(payload, keys.secretOrKey, {
                expiresIn: '1d'
              }, (err, token) => {
                jwebtoken = token;
                newProduct.save((err, product) => {
                  newProductId = product._id;
                  Inventory.deleteMany({}, (err) => {
                    Purchase.deleteMany({}, (err) => {
                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  //Again make sure users collection is empty after tests
  /*
   * afterEach((done) => {
   * User.deleteMany({}, (err) => {
   * Product.deleteMany({}, (err) => {
   * Update.deleteMany({}, (err) => {
   * done();
   * });
   * });
   * });
   * });
   *
   * /*
   * Register test user
   */
  describe('Cart user CRUD operations', () => {

    it('it should retrieve list of existing items in user cart',
      (done) => {
        chai.request(server)
          .get('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            let testCart = res.body.cart;

            testCart.should.be.a('array');
            testCart.length.should.eql(1);
            testCart[0].should.be.a('object');
            testCart[0].should.have.property('product');
            testCart[0].product.should.have.property('title',
              'Test product');
            testCart[0].should.have.property('qty', 1);

            done();
          });
      });

    it('it should add a product to user cart',
      (done) => {
        chai.request(server)
          .post('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: newProductId,
            qty: 2
          })
          .end((err, res) => {
            res.should.have.status(201);
            res.should.be.json;
            let testCart = res.body.user.shoppingCart;

            testCart.should.be.a('array');
            testCart.length.should.eql(2);
            testCart[1].should.be.a('object');
            testCart[1].should.have.property('product', String(newProductId));
            testCart[1].should.have.property('qty', 2);

            done();
          });
      });

    it('it should update a product in user cart',
      (done) => {
        chai.request(server)
          .patch('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: testProductId,
            qty: 2
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            let testCart = res.body.user.shoppingCart;

            testCart.should.be.a('array');
            testCart.length.should.eql(1);
            testCart[0].should.be.a('object');
            testCart[0].should.have.property('product', String(testProductId));
            testCart[0].should.have.property('qty', 2);

            done();
          });
      });

    it('it should delete a product from user cart',
      (done) => {
        chai.request(server)
          .delete('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: testProductId
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            let testCart = res.body.user.shoppingCart;

            testCart.should.be.a('array');
            testCart.length.should.eql(0);

            done();
          });
      });

    it('it should not add an unavailable product to user cart',
      (done) => {
        chai.request(server)
          .post('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: testProduct2Id,
            qty: 2
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.message.should.eql('Product not available');

            done();
          });
      });

    it('it should checkout a single item in user cart' +
      ' when there is more than enough quantity in stock',
      (done) => {
        Inventory.insertMany([{
          products: [{
            product: testProductId,
            qty: 2
          }]
        }]).then((inv) => {
          chai.request(server)
            .post('/api/users/cart/checkout')
            .set("Authorization", "Bearer " + jwebtoken)
            .send({})
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.user.shoppingCart.length.should.eql(0);

              res.body.purchase.should.have.property('user');
              res.body.purchase.should.have.property('purchaseDate');
              res.body.purchase.products[0].product.title.should.eql(
                'Test product');
              res.body.purchase.products[0].qty.should.eql(1);

              Inventory.find({
                products: {
                  '$elemMatch': {
                    product: testProductId
                  }
                }
              }).then((inventory) => {
                for (let i = 0; i < inventory[0].products.length; i += 1) {
                  if (String(inventory[0].products[i].product) ===
                    String(testProductId)) {
                    assert(inventory[0].products[i].qty === 1);
                    done();
                  }
                }
              });
            });
        })
      });

    it('it should checkout a single item in user cart' +
      ' when there is exactly enough quantity in stock',
      (done) => {
        Inventory.insertMany([{
          products: [{
            product: testProductId,
            qty: 1
          }]
        }]).then(() => {
          chai.request(server)
            .post('/api/users/cart/checkout')
            .set("Authorization", "Bearer " + jwebtoken)
            .send({})
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.user.shoppingCart.length.should.eql(0);

              Inventory.find({
                products: {
                  '$elemMatch': {
                    product: testProductId
                  }
                }
              }).then((inventory) => {
                if (inventory.length !== 0) {
                  throw new Error(
                    'it should delete product document from inventory')
                }
                Update.findOne({
                  productId: testProductId
                }).then((doc) => {
                  if (doc === null) {
                    throw new
                    Error("Product not queued for availability update")
                  }
                  done();
                });
              });
            });
        })
      });

    it('it should checkout multiple items in user cart' +
      ' when there is more than enough quantity in stock for each' +
      ' of them in a single inventory',
      (done) => {
        User.updateOne({
          _id: testUserId
        }, {
          shoppingCart: [{
              product: testProductId,
              qty: 2
            },
            {
              product: testProduct2Id,
              qty: 1
            }
          ]
        }).then(() => {
          Inventory.insertMany([{
            products: [{
                product: testProductId,
                qty: 4
              },
              {
                product: testProduct2Id,
                qty: 22
              }
            ]
          }]).then(() => {
            chai.request(server)
              .post('/api/users/cart/checkout')
              .set("Authorization", "Bearer " + jwebtoken)
              .send({})
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.user.shoppingCart.length.should.eql(0);

                res.body.purchase.should.have.property('user');
                res.body.purchase.should.have.property('purchaseDate');
                res.body.purchase.products[0].product.title.should.eql(
                  'Test product');
                res.body.purchase.products[0].qty.should.eql(2);

                res.body.purchase.products[1].product.title.should.eql(
                  'Test product 2');
                res.body.purchase.products[1].qty.should.eql(1);

                Inventory.find({
                  '$or': [{
                      products: {
                        '$elemMatch': {
                          product: testProductId
                        }
                      }
                    },
                    {
                      products: {
                        '$elemMatch': {
                          product: testProduct2Id
                        }
                      }
                    }
                  ]
                }).then((inventory) => {
                  assert(inventory[0].products[0].qty === 2);
                  assert(inventory[0].products[1].qty === 21);
                  done();
                });
              });
          })
        });
      });

    it('it should checkout multiple items in user cart' +
      ' when there is exactly enough quantity in stock for each' +
      ' of them in a single inventory',
      (done) => {
        User.updateOne({
          _id: testUserId
        }, {
          shoppingCart: [{
              product: testProductId,
              qty: 1
            },
            {
              product: testProduct2Id,
              qty: 2
            }
          ]
        }).then(() => {
          Inventory.insertMany([{
            products: [{
                product: testProductId,
                qty: 1
              },
              {
                product: testProduct2Id,
                qty: 2
              }
            ]
          }]).then(() => {
            chai.request(server)
              .post('/api/users/cart/checkout')
              .set("Authorization", "Bearer " + jwebtoken)
              .send({})
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.user.shoppingCart.length.should.eql(0);
                Inventory.find({
                  '$or': [{
                      products: {
                        '$elemMatch': {
                          product: testProductId
                        }
                      }
                    },
                    {
                      products: {
                        '$elemMatch': {
                          product: testProduct2Id
                        }
                      }
                    }
                  ]
                }).then((inventory) => {
                  if (inventory.length !== 0) {
                    throw new Error(
                      'it should delete product document from inventory')
                  }
                  Update.findOne({
                    "$or": [{
                        productId: testProductId
                      },
                      {
                        productId: testProduct2Id
                      }
                    ]
                  }).then((doc) => {
                    if (doc[0] === null || doc[1] === null) {
                      throw new
                      Error("Product not queued for availability update")
                    }
                    done();
                  });
                });
              });
          })
        });
      });

    it('it should checkout multiple items in user cart' +
      ' when there is more than enough quantity in stock for each' +
      ' of them in multiple inventories',
      (done) => {
        User.updateOne({
          _id: testUserId
        }, {
          shoppingCart: [{
              product: testProductId,
              qty: 1
            },
            {
              product: testProduct2Id,
              qty: 2
            }
          ]
        }).then(() => {
          Inventory.insertMany([{
              products: [{
                product: testProductId,
                qty: 2
              }]
            },
            {
              products: [{
                product: testProduct2Id,
                qty: 3
              }]
            }
          ]).then(() => {
            chai.request(server)
              .post('/api/users/cart/checkout')
              .set("Authorization", "Bearer " + jwebtoken)
              .send({})
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.user.shoppingCart.length.should.eql(0);

                Inventory.find({
                  '$or': [{
                      products: {
                        '$elemMatch': {
                          product: testProductId
                        }
                      }
                    },
                    {
                      products: {
                        '$elemMatch': {
                          product: testProduct2Id
                        }
                      }
                    }
                  ]
                }).then((inventory) => {
                  assert(inventory[0].products[0].qty === 1);
                  assert(inventory[1].products[0].qty === 1);
                  done();
                });
              });
          })
        });
      });

    it('it should checkout multiple items in user cart' +
      ' when there is exactly enough quantity in stock for each' +
      ' of them in multiple inventories',
      (done) => {
        User.updateOne({
          _id: testUserId
        }, {
          shoppingCart: [{
              product: testProductId,
              qty: 1
            },
            {
              product: testProduct2Id,
              qty: 2
            }
          ]
        }).then(() => {
          Inventory.insertMany([{
            products: [{
                product: testProductId,
                qty: 1
              },
              {
                product: testProduct2Id,
                qty: 2
              }
            ]
          }]).then(() => {
            chai.request(server)
              .post('/api/users/cart/checkout')
              .set("Authorization", "Bearer " + jwebtoken)
              .send({})
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.user.shoppingCart.length.should.eql(0);

                Inventory.find({
                  '$or': [{
                      products: {
                        '$elemMatch': {
                          product: testProductId
                        }
                      }
                    },
                    {
                      products: {
                        '$elemMatch': {
                          product: testProduct2Id
                        }
                      }
                    }
                  ]
                }).then((inventory) => {
                  if (inventory.length !== 0) {
                    throw new Error(
                      'it should delete product document from inventory')
                  }
                  Update.findOne({
                    "$or": [{
                        productId: testProductId
                      },
                      {
                        productId: testProduct2Id
                      }
                    ]
                  }).then((doc) => {
                    if (doc[0] === null || doc[1] === null) {
                      throw new
                      Error("Product not queued for availability update")
                    }
                    done();
                  });
                });
              });
          })
        });
      });

    it('it should not add a duplicate product to user cart',
      (done) => {
        chai.request(server)
          .post('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: testProductId,
            qty: 2
          })
          .end((err, res) => {
            res.should.have.status(409);
            res.should.be.json;
            res.body.should.have.property('message',
              'Product already exists in cart')

            done();
          });
      });

    it('it should not add a product to user cart without jwt',
      (done) => {
        chai.request(server)
          .post('/api/users/cart')
          .send({
            productId: testProductId,
            qty: 2
          })
          .end((err, res) => {
            res.should.have.status(401);

            done();
          });
      });

    it('it should not add a product to user cart with invalid qty',
      (done) => {
        chai.request(server)
          .post('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: newProductId,
            qty: -1
          })
          .end((err, res) => {
            res.should.have.status(400);

            done();
          });
      });

    it('it should not update a non-existent product in user cart',
      (done) => {
        chai.request(server)
          .patch('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: newProductId,
            qty: 2
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.should.be.json;
            res.body.should.have.property('message',
              'Product not found')

            done();
          });
      });

    it('it should not update a product in user cart without jwt',
      (done) => {
        chai.request(server)
          .patch('/api/users/cart')
          .send({
            productId: testProductId,
            qty: 2
          })
          .end((err, res) => {
            res.should.have.status(401);

            done();
          });
      });

    it('it should update add a product in user cart with invalid qty',
      (done) => {
        chai.request(server)
          .patch('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: testProductId,
            qty: -1
          })
          .end((err, res) => {
            res.should.have.status(400);

            done();
          });
      });

    it('it should not delete a non-existent product from user cart',
      (done) => {
        chai.request(server)
          .delete('/api/users/cart')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: newProductId
          })
          .end((err, res) => {
            res.should.have.status(404);
            res.should.be.json;
            res.body.should.have.property('message',
              'Product not found')

            done();
          });
      });

    it('it should not delete a product from user cart without jwt',
      (done) => {
        chai.request(server)
          .delete('/api/users/cart')
          .send({
            productId: testProductId
          })
          .end((err, res) => {
            res.should.have.status(401);

            done();
          });
      });

    it('it should not checkout a single item in user cart' +
      ' when there is not enough quantity in stock for it',
      (done) => {
        User.updateOne({
          _id: testUserId
        }, {
          shoppingCart: [{
            product: testProductId,
            qty: 5
          }]
        }).then(() => {
          Inventory.insertMany([{
            products: [{
                product: testProductId,
                qty: 4
              },
              {
                product: testProduct2Id,
                qty: 2
              }
            ]
          }]).then(() => {
            chai.request(server)
              .post('/api/users/cart/checkout')
              .set("Authorization", "Bearer " + jwebtoken)
              .send({})
              .end((err, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.message.should.eql(
                  "No inventory found with requested product and quantity");

                done();
              });
          })
        });
      });


    it('it should not checkout multiple items in user cart' +
      ' when there is not enough quantity in stock for one' +
      ' of them in any inventory',
      (done) => {
        User.updateOne({
          _id: testUserId
        }, {
          shoppingCart: [{
              product: testProductId,
              qty: 2
            },
            {
              product: testProduct2Id,
              qty: 5
            }
          ]
        }).then(() => {
          Inventory.insertMany([{
            products: [{
                product: testProductId,
                qty: 4
              },
              {
                product: testProduct2Id,
                qty: 2
              }
            ]
          }]).then(() => {
            chai.request(server)
              .post('/api/users/cart/checkout')
              .set("Authorization", "Bearer " + jwebtoken)
              .send({})
              .end((err, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.message.should.eql(
                  "No inventory found with requested product and quantity");

                done();
              });
          })
        });
      });
  });
});
