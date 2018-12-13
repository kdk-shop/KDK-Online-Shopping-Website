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
    User.deleteMany({}, (err) => {
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
            done();
          })
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
        .send({
          title: 'New product',
          price: 1.5,
          description: 'New description',
          category: 'Test',
          brand: 'Misc.'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          let testProduct = res.body;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'New product');
          testProduct.should.have.property('price', 1.5);
          testProduct.should.have.property('description', 'New description');
          testProduct.should.have.property('category', 'Test');
          testProduct.imagePaths.should.be.a('array');
          testProduct.should.have.property('brand', 'Misc.');

          testProduct.rating.should.have.property("score", 0);
          testProduct.rating.should.have.property("count", 0);

          testProduct.reviews.should.be.a('array');
          testProduct.reviews.length.should.equal(0);
          done();
        });
    });

    it('it should update an existing product', (done) => {
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
      chai.request(server)
        .delete('/api/products/delete/' + testProductId)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testProduct = res.body;

          testProduct.should.be.a('object');
          testProduct.should.have.property('title', 'Test product');
          done();
        });
    });
  });

  describe('Product Invalid CRUD operations', () => {

    it('it should not retrieve a non-existent product', (done) => {
      chai.request(server)
        .get('/api/products/5c12dce373b0ec340612f359')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('it should not create a new product with empty fields', (done) => {
      chai.request(server)
        .post('/api/products/create/')
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

    it('it should not create a new product with duplicate title',
      (done) => {
        chai.request(server)
          .post('/api/products/create/')
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
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          done();
        });
    });
  });

  describe('Product review valid CRUD operations', () => {
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

          testProduct.rating.should.have.property("score", 3);
          testProduct.rating.should.have.property("count", 2);

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
