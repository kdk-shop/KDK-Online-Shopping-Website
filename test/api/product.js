//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const assert = require("assert");
const mongoose = require("mongoose");
const Product = require('../../models/Product');
const User = require('../../models/User');
const Admin = require('../../models/Admin');
const staticsPath = require('../../config/storage').staticsPath;

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
describe('Products', () => {
  let testProductId;
  let testUserId;
  let newUserId;

  beforeEach((done) => {
    //Make sure users collection is empty except for test user
    User.deleteMany({}, (err) => {
      let testUser = new User({
        name: "test",
        email: "test@example.com",
        password: "$2a$10$U2axE8DVGi2m/BAt4RDFZeMG" +
          "t0OPSkRf8T0oec5KFVIBy5Y4fGBUa",
        address: "Test address",
        phoneNumber: 989120000000
      });
      let newUser = new User({
        name: "newUser",
        email: "new@example.com",
        password: "$2a$10$U2axE8DVGi2m/BAt4RDFZeMG" +
          "t0OPSkRf8T0oec5KFVIBy5Y4fGBUa",
        address: "Test address",
        phoneNumber: 989120000000
      });

      testUser.save((err, usr) => {
        testUserId = usr._id;
        //Make sure products collection is empty except for test product
        Product.deleteMany({}, (err) => {
          let testProduct = new Product({
            title: "Test product",
            price: 1.0,
            description: "Test description",
            category: "Test",
            brand: "Misc.",
            imagePaths: ["test.jpg"],
            rating: {
              score: 4,
              count: 1
            },
            reviews: [{
              creatorId: usr._id,
              creatorName: usr.name,
              review: "Test review",
              recommended: true,
              score: 4
            }]
          });

          testProduct.save((err, prod) => {
            testProductId = prod._id;
            newUser.save((err, doc) => {
              newUserId = doc._id;
              done();
            });
          })
        });
      });
    });
  });
  //Again make sure users collection is empty after tests

  afterEach((done) => {
    User.deleteMany({}, (err) => {
      Product.deleteMany({}, (err) => {
        done();
      });
    });
  });

  /*
   * Register test user
   */
  describe('Product admin CRUD operations', () => {
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

    it('it should retrieve an existing product', (done) => {
      chai.request(server)
        .get('/api/products/' + testProductId)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testProduct = res.body;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product');
          testProduct.should.have.property('price', 1);
          testProduct.should.have.property('description', 'Test description');
          testProduct.should.have.property('category', 'Test');
          testProduct.imagePaths.should.be.a('array');
          testProduct.imagePaths[0].should.eql('test.jpg');
          testProduct.should.have.property('brand', 'Misc.');

          testProduct.rating.should.have.property("score", 4);
          testProduct.rating.should.have.property("count", 1);

          testProduct.reviews.should.be.a('array');
          testProduct.reviews[0].should.have.property('creatorId');
          testProduct.reviews[0].should.have.property('creatorName', 'test');
          testProduct.reviews[0].should.have.property('review', 'Test review');
          testProduct.reviews[0].should.have.property('recommended', true);
          done();
        });
    });

    it('it should create a new product', (done) => {
      chai.request(server)
        .post('/api/products/create/')
        .set("Authorization", "Bearer " + jwebtoken)
        .field('title', 'New product')
        .field('price', '1.5')
        .field('description', 'New description')
        .field('category', 'Test')
        .field('brand', 'Misc.')
        .attach('image', fs.readFileSync(path.join(__dirname, '..',
          'files', 'test-image.jpg')), 'test-image.jpg')
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          let testProduct = res.body;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'New product');
          testProduct.should.have.property('price', 1.5);
          testProduct.should.have.property('description', 'New description');
          testProduct.should.have.property('category', 'Test');
          testProduct.should.have.property('brand', 'Misc.');

          testProduct.imagePaths.should.be.a('array');
          testProduct.imagePaths.length.should.equal(1);

          testProduct.rating.should.have.property("score", 0);
          testProduct.rating.should.have.property("count", 0);

          testProduct.reviews.should.be.a('array');
          testProduct.reviews.length.should.equal(0);
          done();
        });
    });

    it('it should update an existing product', (done) => {
      let createStream = fs.createWriteStream(path.join(
        staticsPath, 'images', 'full', "test.jpg"));

      createStream.end();

      chai.request(server)
        .put('/api/products/update/' + testProductId)
        .set("Authorization", "Bearer " + jwebtoken)
        .field('title', 'Updated product')
        .field('price', 3)
        .field('description', 'Updated description')
        .field('category', 'Updated')
        .field('brand', 'Updated Misc.')
        .attach('image', fs.readFileSync(path.join(__dirname, '..',
          'files', 'test-image.jpg')), 'test-image.jpg')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testProduct = res.body;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Updated product');
          testProduct.should.have.property('price', 3);
          testProduct.should.have.property(
            'description',
            'Updated description'
          );

          testProduct.imagePaths.should.be.a('array');
          testProduct.imagePaths.length.should.equal(1);

          testProduct.should.have.property('category', 'Updated');
          testProduct.imagePaths.should.be.a('array');
          testProduct.should.have.property('brand', 'Updated Misc.');

          testProduct.rating.should.have.property("score", 4);
          testProduct.rating.should.have.property("count", 1);

          testProduct.reviews.should.be.a('array');
          testProduct.reviews.length.should.equal(1);
          done();
        });
    });

    it('it should delete an existing product', (done) => {
      let createStream = fs.createWriteStream(path.join(
        staticsPath, 'images', 'full', "test.jpg"));

      createStream.end();
      chai.request(server)
        .delete('/api/products/delete/' + testProductId)
        .set("Authorization", "Bearer " + jwebtoken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testProduct = res.body;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product');
          done();
        });
    });

    it('it should not retrieve a non-existent product', (done) => {
      chai.request(server)
        .get('/api/products/5c12dce373b0ec340612f359')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('it should not create a new product with empty title field', (done) => {
      chai.request(server)
        .post('/api/products/create/')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          brand: 'test',
          category: 'test',
          price: -2
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;

          let errors = res.body;

          errors.should.have.property('title', 'Title field is required');
          done();
        });
    });

    it('it should not create a new product with empty brand field', (done) => {
      chai.request(server)
        .post('/api/products/create/')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          title: 'test 2',
          category: 'test',
          price: -2
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;

          let errors = res.body;

          errors.should.have.property('brand', 'Brand field is required');
          done();
        });
    });

    it('it should not create a new product with empty category field',
      (done) => {
        chai.request(server)
          .post('/api/products/create/')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            title: 'test 2',
            brand: 'test',
            price: -2
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;

            let errors = res.body;

            errors.should.have.property(
              'category', 'Category field is required');
            done();
          });
      });

    it('it should not create a new product with empty price field', (done) => {
      chai.request(server)
        .post('/api/products/create/')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          brand: 'test',
          category: 'test',
          test: 'test 2'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;

          let errors = res.body;

          errors.should.have.property('price', 'Price field is required');
          done();
        });
    });

    it('it should not create a new product with invalid price', (done) => {
      chai.request(server)
        .post('/api/products/create/')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          title: 'Test product 2',
          brand: 'test',
          category: 'test',
          price: -2
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;

          let errors = res.body;

          errors.should.have.property('price', 'Price field is invalid');
          done();
        });
    });

    it('it should not create a new product with duplicate title',
      (done) => {
        chai.request(server)
          .post('/api/products/create/')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            title: 'Test product',
            price: 1.5,
            description: 'New description',
            category: 'Test',
            brand: 'Misc.'
          })
          .end((err, res) => {
            res.should.have.status(409);
            res.should.be.json;

            let errors = res.body;

            errors.should.have.property('title',
              'Product with this title already exists');
            done();
          });
      });

    it('it should not update a product with empty fields', (done) => {
      chai.request(server)
        .put('/api/products/update/' + testProductId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;

          let errors = res.body;

          errors.should.have.property('title', 'Title field is required');
          errors.should.have.property('price', 'Price field is required');
          errors.should.have.property('category', 'Category field is required');
          done();
        });
    });

    it('it should not update a non-existent product', (done) => {
      chai.request(server)
        .put('/api/products/update/5c12dce373b0ec340612f359')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          title: 'Updated product',
          price: 3,
          description: 'Updated description',
          category: 'Updated',
          brand: 'Updated Misc.'
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          done();
        });
    });

    it('it should not delete a non-existent product', (done) => {
      chai.request(server)
        .delete('/api/products/delete/5c12dce373b0ec340612f359')
        .set("Authorization", "Bearer " + jwebtoken)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          done();
        });
    });

    it('it should not create a new ' +
      'product without admin privilages', (done) => {
        chai.request(server)
          .post('/api/products/create/')
          .field('title', 'New product')
          .field('price', '1.5')
          .field('description', 'New description')
          .field('category', 'Test')
          .field('brand', 'Misc.')
          .attach('image', fs.readFileSync(path.join(__dirname, '..',
            'files', 'test-image.jpg')), 'test-image.jpg')
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

    it('it should not update an existing' +
      ' product without admin privilages', (done) => {
        chai.request(server)
          .put('/api/products/update/' + testProductId)
          .send({
            title: 'Updated product',
            price: 3,
            description: 'Updated description',
            category: 'Updated',
            brand: 'Updated Misc.'
          })
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

    it('it should not delete an existing' +
      'product without admin privilages', (done) => {
        chai.request(server)
          .delete('/api/products/delete/' + testProductId)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
  });

  describe('Product review CRUD operations', () => {
    it("it should add a new review to a product", (done) => {
      chai.request(server)
        .put('/api/products/review/' + testProductId + '/' + newUserId)
        .send({
          name: "newUser",
          text: "Test review 2",
          recommended: false,
          score: 2
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          let testProduct = res.body.product;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product');
          testProduct.reviews.should.be.a('array');

          testProduct.rating.should.have.property("score", 3);
          testProduct.rating.should.have.property("count", 2);

          let testReview = testProduct.reviews[1];

          testReview.should.have.property('creatorId');
          testReview.should.have.property('creatorName', 'newUser');
          testReview.should.have.property('review', 'Test review 2');
          testReview.should.have.property('recommended', false);
          done();
        });
    });

    it("it should update an existing review on a product", (done) => {
      chai.request(server)
        .put('/api/products/review/' + testProductId + '/' + testUserId)
        .send({
          name: "test",
          text: "Test review 3",
          recommended: true,
          score: 2
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testProduct = res.body.product;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product');
          testProduct.reviews.should.be.a('array');

          testProduct.rating.should.have.property("score", 2);
          testProduct.rating.should.have.property("count", 1);

          let testReview = testProduct.reviews[0];

          testReview.should.have.property('creatorId');
          testReview.should.have.property('creatorName', 'test');
          testReview.should.have.property('review', 'Test review 3');
          testReview.should.have.property('recommended', true);
          done();
        });
    });
  });

  describe('Product queries', () => {
    beforeEach((done) => {
      User.deleteMany({}, (err) => {
        let i;
        let products = [];

        for (i = 0; i < 5; i += 1) {
          let newProduct = new Product({
            title: "Test product " + i,
            price: i * 4 + 2,
            description: "Test description " + i,
            category: "Test" + i % 2,
            brand: "Misc." + i % 3,
            imagePaths: ["test.jpg"],
            'date': new Date('2015-03-2' + (5 - i)),
            available: i % 2 === 0,

            rating: {
              score: i + 1,
              count: 1
            }
          });

          if (i % 2 === 1) {
            newProduct.discountedPrice = 2 * i + 1;
          }
          products.push(newProduct);
        }
        Product.insertMany(products, (err, docs) => {
          if (err) {
            console.error(err);
          }
          done();
        });
      });
    });

    it('it should retrieve all products', (done) => {
      chai.request(server)
        .get('/api/products/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');
          let testProduct = res.body.products[1];

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product 0');
          testProduct.should.have.property('price', 2);
          testProduct.should.have.property('description', 'Test description 0');
          testProduct.should.have.property('category', 'Test0');
          testProduct.imagePaths.should.be.a('array');
          testProduct.imagePaths[0].should.eql('test.jpg');
          testProduct.should.have.property('brand', 'Misc.0');

          testProduct.rating.should.have.property("score", 1);
          testProduct.rating.should.have.property("count", 1);

          done();
        });
    });

    it('it should retrieve recent products', (done) => {
      chai.request(server)
        .get('/api/products/recent')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length - 1; i += 1) {
            assert(res.body.products[i].date <= res.body.products[i + 1])
          }
          done();
        });
    });

    it('it should retrieve discounted products', (done) => {
      chai.request(server)
        .get('/api/products/amazing')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            assert(res.body.products[i].discountedPrice !== undefined)
          }
          done();
        });
    });

    it('it should retrieve products by title', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'title': '3'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');
          let testProduct = res.body.products[0];

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product 3');

          done();
        });
    });
    it('it should retrieve products by category', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'category': 'Test0'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            res.body.products[i].should.be.a('object');
            res.body.products[i].should.have.property('category', 'Test0');
          }
          done();
        });
    });

    it('it should retrieve products by brand', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'brand': 'Misc.1'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            res.body.products[i].should.be.a('object');
            res.body.products[i].should.have.property('brand', 'Misc.1');
          }
          done();
        });
    });

    it('it should retrieve products by availability', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'available': true
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            res.body.products[i].should.be.a('object');
            res.body.products[i].should.have.property('available', true);
          }
          done();
        });
    });

    it('it should retrieve products by min price', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'minPrice': 4.5
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            res.body.products[i].should.be.a('object');
            res.body.products[i].price.should.be.above(4.5);
          }
          done();
        });
    });

    it('it should retrieve products by max price', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'maxPrice': 7.5
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            res.body.products[i].should.be.a('object');
            res.body.products[i].price.should.be.below(7.5);
          }
          done();
        });
    });

    it('it should retrieve products by a range of prices', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'minPrice': 3.5,
          'maxPrice': 7.5
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            res.body.products[i].should.be.a('object');
            res.body.products[i].price.should.be.above(3.5);
            res.body.products[i].price.should.be.below(7.5);
          }
          done();
        });
    });

    it('it should retrieve products by min score', (done) => {
      chai.request(server)
        .get('/api/products/')
        .query({
          'minScore': 3
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');

          for (let i = 0; i < res.body.products.length; i += 1) {
            res.body.products[i].should.be.a('object');
            res.body.products[i].rating.score.should.be.above(2.9);
          }
          done();
        });
    });

  })
});
