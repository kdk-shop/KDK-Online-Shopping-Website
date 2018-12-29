//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const assert = require("assert");
const mongoose = require("mongoose");
const Product = require('../../models/Product');
const Purchase = require('../../models/Purchase');
const Admin = require('../../models/Admin');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

chai.use(chaiHttp);
describe('Purchase History', () => {
  let testPurchases;
  let testPurchaseIds;
  let testProductId1;
  let testProductId2;

  beforeEach((done) => {
    let testPurchases = [];
    let testPurchaseIds = [];

    //Make sure collections are empty and add test data
    Product.deleteMany({}, (err) => {
      let testProduct1 = {
        title: "test product 1",
        price: 124,
        description: "test description 1",
        category: "test category",
        brand: "test brand"
      };
      let testProduct2 = {
        title: "test product 2",
        price: 50,
        description: "test description 2",
        category: "test category",
        brand: "test brand"
      };

      Product.insertMany([testProduct1,
        testProduct2
      ], (err, docs) => {
        testProductId1 = docs[0]._id;
        testProductId2 = docs[1]._id;
        Purchase.deleteMany({}, (err) => {
          if (err) {
            console.error(err);
          }
          testPurchases.push({
            'user': {
              'email': 'test@example.com',
              'name': 'test',
              'phoneNumber:': 21485,
              'address': 'test address'
            },
            'products': [{
              'product': {
                '_id': testProductId1,
                'title': 'test product 1',
                'category': 'test category',
                'brand': 'test brand',
                'price': 124
              },
              'qty': 2
            }],
            purchaseDate: new Date('2018-06-20')
          });
          testPurchases.push({
            'user': {
              'email': 'test@example.com',
              'name': 'test',
              'phoneNumber:': 21485,
              'address': 'test address'
            },
            'products': [{
                'product': {
                  '_id': testProductId1,
                  'title': 'test product 1',
                  'category': 'test category',
                  'brand': 'test brand',
                  'price': 124
                },
                'qty': 1
              },
              {
                'product': {
                  '_id': testProductId2,
                  'title': 'test product 2',
                  'category': 'test category',
                  'brand': 'test brand',
                  'price': 50
                },
                'qty': 5
              }
            ],
            purchaseDate: new Date('2018-04-12')
          });

          testPurchases.push({
            'user': {
              'email': 'test@example.com',
              'name': 'test',
              'phoneNumber:': 21485,
              'address': 'test address'
            },
            'products': [{
              'product': {
                '_id': testProductId2,
                'title': 'test product 2',
                'category': 'test category',
                'brand': 'test brand',
                'price': 124
              },
              'qty': 3
            }],
            purchaseDate: new Date('2018-08-05')
          });

          Purchase.insertMany(testPurchases, (err, docs) => {
            if (err) {
              console.error(err);
            }
            done();
          });
        });
      });
    });
  });
  //Make sure collections are empty after tests
  /*
   * afterEach((done) => {
   * Product.deleteMany({}, (err) => {
   * Purchase.deleteMany({}, (err) => {
   * done();
   * });
   * });
   * });
   *
   * /*
   * Register test user
   */
  describe('Purchase history query operations', () => {
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

    it('it should retrieve list of all purchases', (done) => {
      chai.request(server)
        .get('/api/purchases/')
        .set("Authorization", "Bearer " + jwebtoken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.maxPurchases.should.eql(3);

          let purchases = res.body.purchases;

          purchases.should.be.a('array');
          purchases.length.should.eql(3);

          purchases[1].user.should.be.a('object');
          purchases[1].user.should.have.property('name', 'test');

          purchases[1].products.should.be.a('array');
          purchases[1].products.length.should.eql(1);

          purchases[1].products[0].should.be.a('object');
          purchases[1].products[0].product.should.have.property('title',
            'test product 1');
          purchases[1].products[0].qty.should.eql(2);

          purchases[2].user.should.be.a('object');
          purchases[2].user.should.have.property('name', 'test');

          purchases[2].products.should.be.a('array');
          purchases[2].products.length.should.eql(2);

          purchases[2].products[0].should.be.a('object');
          purchases[2].products[0].product.should.have.property('title',
            'test product 1');
          purchases[2].products[0].qty.should.eql(1);

          purchases[2].products[1].should.be.a('object');
          purchases[2].products[1].product.should.have.property('title',
            'test product 2');
          purchases[2].products[1].qty.should.eql(5);

          done();
        });
    });

    it('it should retrieve list of purchases made after a date', (done) => {
      chai.request(server)
        .get('/api/purchases/')
        .set("Authorization", "Bearer " + jwebtoken)
        .query({
          startDate: new Date('2018-05-10')
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.maxPurchases.should.eql(2);

          let purchases = res.body.purchases;

          purchases.should.be.a('array');
          purchases.length.should.eql(2);

          purchases[0].purchaseDate.should.eql('2018-08-05T00:00:00.000Z');
          purchases[1].purchaseDate.should.eql('2018-06-20T00:00:00.000Z');

          done();
        });
    });

    it('it should retrieve list of purchases made before a date', (done) => {
      chai.request(server)
        .get('/api/purchases/')
        .set("Authorization", "Bearer " + jwebtoken)
        .query({
          endDate: new Date('2018-07-10')
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.maxPurchases.should.eql(2);

          let purchases = res.body.purchases;

          purchases.should.be.a('array');
          purchases.length.should.eql(2);

          purchases[0].purchaseDate.should.eql('2018-06-20T00:00:00.000Z');
          purchases[1].purchaseDate.should.eql('2018-04-12T00:00:00.000Z');

          done();
        });
    });

    it('it should retrieve list of purchases made between a range of dates',
      (done) => {
        chai.request(server)
          .get('/api/purchases/')
          .set("Authorization", "Bearer " + jwebtoken)
          .query({
            startDate: new Date('2018-05-10'),
            endDate: new Date('2018-07-10')
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.maxPurchases.should.eql(1);

            let purchases = res.body.purchases;

            purchases.should.be.a('array');
            purchases.length.should.eql(1);

            purchases[0].purchaseDate.should.eql('2018-06-20T00:00:00.000Z');

            done();
          });
      });
  });
});
