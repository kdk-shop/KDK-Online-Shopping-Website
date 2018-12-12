//During the test the env variable is set to test
process.env.NODE_ENV = 'TEST';

let mongoose = require("mongoose");
let Product = require('../../models/Product');
let User = require('../../models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();

chai.use(chaiHttp);
describe('Products', () => {
  let testProductId;
  let testUserId;

  beforeEach((done) => {
    //Make sure users collection is empty except for test user
    User.remove({}, (err) => {
      let testUser = new User({
        name: "test",
        email: "test@example.com",
        password: "$2a$10$U2axE8DVGi2m/BAt4RDFZeMG" +
          "t0OPSkRf8T0oec5KFVIBy5Y4fGBUa",
        address: "Test address",
        phoneNumber: 989120000000
      });

      testUser.save((err, usr) => {
        testUserId = usr._id;
        //Make sure products collection is empty except for test product
        Product.remove({}, (err) => {
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
            done();
          })
        });
      });
    });
  });
  //Again make sure users collection is empty after tests

  afterEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  /*
   * Register test user
   */
  describe('Product valid CRUD operations', () => {

    it('it should retrieve list of all products', (done) => {
      chai.request(server)
        .get('/api/products/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.products.should.be.a('array');
          let testProduct = res.body.products[0];

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product');
          testProduct.should.have.property('price', 1);
          testProduct.should.have.property('description', 'Test description');
          testProduct.should.have.property('category', 'Test');
          testProduct.imagePaths.should.be.a('array');
          testProduct.imagePaths[0].should.eql('test.jpg');
          testProduct.should.have.property('brand', 'Misc.');

          testProduct.rating.should.have.property("score",4);
          testProduct.rating.should.have.property("count",1);

          testProduct.reviews.should.be.a('array');
          testProduct.reviews[0].should.have.property('creatorId');
          testProduct.reviews[0].should.have.property('creatorName', 'test');
          testProduct.reviews[0].should.have.property('review', 'Test review');
          testProduct.reviews[0].should.have.property('recommended', true);
          done();
        });
    });

    it('it should retrieve a specific product', (done) => {
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

          testProduct.rating.should.have.property("score",4);
          testProduct.rating.should.have.property("count",1);

          testProduct.reviews.should.be.a('array');
          testProduct.reviews[0].should.have.property('creatorId');
          testProduct.reviews[0].should.have.property('creatorName', 'test');
          testProduct.reviews[0].should.have.property('review', 'Test review');
          testProduct.reviews[0].should.have.property('recommended', true);
          done();
        });
    });
  });
  describe('Product valid CRUD operations', () => {
    it("it should add a review to a product", (done) => {
      chai.request(server)
        .put('/api/products/review/' + testProductId + '/' + testUserId)
        .send({
          name: "test",
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

          testProduct.rating.should.have.property("score",3);
          testProduct.rating.should.have.property("count",2);

          let testReview = testProduct.reviews[1];

          testReview.should.have.property('creatorId');
          testReview.should.have.property('creatorName', 'test');
          testReview.should.have.property('review', 'Test review 2');
          testReview.should.have.property('recommended', false);
          done();
        });

    });
  });
});
