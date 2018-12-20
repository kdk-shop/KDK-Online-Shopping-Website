//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const mongoose = require("mongoose");
const Product = require('../../models/Product');
const User = require('../../models/User');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');


chai.use(chaiHttp);
describe('Carts', () => {
  let testUserId;
  let testProductId;
  let newProductId;
  let jwebtoken;

  beforeEach((done) => {
    //Make sure users collection is empty except for test user
    Product.deleteMany({}, (err) => {
      let testProduct = new Product({
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
      });

      let newProduct = new Product({
        title: "New product",
        price: 1.0,
        description: "New description",
        available: true,
        category: "Test",
        brand: "Misc.",
        imagePaths: ["test.jpg"],
        rating: {
          score: 4,
          count: 1
        }
      });

      testProduct.save((err, product) => {
        testProductId = product._id;
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
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /*
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
            testCart[0].should.have.property('product', String(testProductId));
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

  });
});
