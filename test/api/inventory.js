//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const mongoose = require("mongoose");
const assert = require("assert");
const Storage = require('../../models/Storage');
const Inventory = require('../../models/Inventory');
const Product = require('../../models/Product');
const Admin = require('../../models/Admin');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//utility dependencies
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);
describe('Storages', () => {
  let testStorageId;
  let testProductId;
  let newProductId;
  let testInventoryId;

  beforeEach((done) => {
    //Make sure users collection is empty except for test user
    Product.deleteMany({}, (err) => {
      let testProduct = {
        title: "Test product",
        price: 1.0,
        description: "Test description",
        available: true,
        category: "Test",
        brand: "Misc.",
        imagePaths: ["test.jpg"],
        rating: {
          score: 4,
          count: 1
        }
      };

      let newProduct = {
        title: "New product",
        price: 1.0,
        description: "New description",
        category: "Test",
        brand: "Misc.",
        imagePaths: ["test.jpg"],
        rating: {
          score: 4,
          count: 1
        }
      };

      Product.insertMany([testProduct,
        newProduct
      ], (err, docs) => {
        testProductId = docs[0]._id;
        newProductId = docs[1]._id;
        Inventory.deleteMany({}, (err) => {
          let testInventory = new Inventory({
            products: [{
              product: docs[0]._id,
              qty: 1
            }]
          });

          let testInventory2 = new Inventory({
            products: [{
              product: docs[1]._id,
              qty: 1
            }]
          });

          Inventory.insertMany([testInventory,
            testInventory2
          ], (err, docs) => {
            testInventoryId = docs[0]._id;
            Storage.deleteMany({}, (err) => {
              let testStorage = new Storage({
                name: "Test storage",
                address: "Test address",
                inventory: docs[0]._id
              });

              testStorage.save((err, storage) => {
                testStorageId = storage._id;
                done();
              });
            });
          });
        });
      });
    });
  });
  //Again make sure users collection is empty after tests

  afterEach((done) => {
    Product.deleteMany({}, (err) => {
      Inventory.deleteMany({}, (err) => {
        Storage.deleteMany({}, (err) => {
          done();
        });
      });
    });
  });

  /*
   * Register test user
   */
  describe('Storage admin CRUD operations', () => {
    let jwebtoken;

    beforeEach((done) => {
      Admin.deleteMany({}, (err) => {
        let testAdmin = new Admin({
          name: "admin",
          password: "$2a$10$U2axE8DVGi2m/BAt4RDFZeMG" +
            "t0OPSkRf8T0oec5KFVIBy5Y4fGBUa"
        });

        testAdmin.save((err, admin) => {
          const payload = {
            id: admin._id,
            name: 'admin'
          };

          jwt.sign(payload, keys.secretOrKey, {
            expiresIn: '1d'
          }, (err, token) => {
            jwebtoken = token;
            done();
          });
        });
      });
    });

    it('it should retrieve list of' +
      ' existing products in inventory', (done) => {
        chai.request(server)
          .get('/api/inventories/' + testStorageId)
          .set("Authorization", "Bearer " + jwebtoken)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            let testInventory = res.body.inventory;

            testInventory.should.be.a('array');
            testInventory[0].should.be.a('object');
            testInventory[0].product.should.have.property('title',
              'Test product');
            testInventory[0].should.have.property('qty', 1);

            done();
          });
      });

    it('it should add a product to inventory', (done) => {
      chai.request(server)
        .post('/api/inventories/' + testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          productId: newProductId,
          qty: 2
        })
        .end((err, res) => {
          res.should.have.status(201);
          let products = res.body.inventory.products;
          let indexOfTarget = -1;

          for (let i = 0; i < products.length; i += 1) {
            if (String(products[i].product) === String(newProductId)) {
              indexOfTarget = i;
              break;
            }
          }
          products[indexOfTarget].should.have.property('product',
            String(newProductId));
          products[indexOfTarget].should.have.property('qty', 2);

          Product.findOne({
              _id: newProductId
            }).then((product) => {
              assert(product.available);
              done();
            })
            .catch((err) => {
              throw err;
            });
        });
    });

    it('it should update a product quantity in inventory', (done) => {
      chai.request(server)
        .patch('/api/inventories/' + testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          productId: testProductId,
          qty: 2
        })
        .end((err, res) => {
          res.should.have.status(200);
          let updatedProductRec = res.body.inventory.products[0];

          updatedProductRec.should.have.property('qty', 2);
          updatedProductRec.should.have.property('product');
          done();
        });
    });

    it('it should delete a product from inventory', (done) => {
      chai.request(server)
        .delete('/api/inventories/' + testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          productId: testProductId
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          let products = res.body.inventory.products;
          let indexOfTarget = -1;

          for (let i = 0; i < products.length; i += 1) {
            if (String(products[i].product) === String(testProductId)) {
              indexOfTarget = i;
              break;
            }
          }
          assert(indexOfTarget === -1);

          Product.findOne({
              _id: testProductId
            }).then((product) => {
              assert(!product.available);
              done();
            })
            .catch((err) => {
              throw err;
            });
        });
    });

    it('it should not add a duplicate product to inventory', (done) => {
      chai.request(server)
        .post('/api/inventories/' + testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          productId: testProductId,
          qty: 2
        })
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });

    it('it should not add a product to a non-existent storage', (done) => {
      chai.request(server)
        .post('/api/inventories/5c12dce373b0ec340612f359')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          productId: newProductId,
          qty: 2
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message',
            'Storage not found');
          done();
        });
    });

    it('it should not add a non-existent product to an inventory', (done) => {
      chai.request(server)
        .post('/api/inventories/'+testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          productId: '5c12dce373b0ec340612f359',
          qty: 2
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message',
            'Product not found');
          done();
        });
    });

    it('it should not add a product with incorrect' +
      ' quantity to an inventory', (done) => {
        chai.request(server)
          .post('/api/inventories/'+testStorageId)
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            productId: newProductId,
            qty: -1
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.errors.should.have.property('qty');
            done();
          });
      });
  });
});
