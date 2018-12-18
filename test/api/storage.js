//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const mongoose = require("mongoose");
const Storage = require('../../models/Storage');
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
describe.skip('Storages', () => {
  let testStorageId;

  beforeEach((done) => {
    //Make sure users collection is empty except for test user
    Storage.deleteMany({}, (err) => {
      let testStorage = new Storage({
        name: "Test storage",
        address: "Test address"
      });

      testStorage.save((err, prod) => {
        testStorageId = prod._id;
        done();
      })
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

    it('it should retrieve an existing storage', (done) => {
      chai.request(server)
        .get('/api/storages/' + testStorageId)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testStorage = res.body;

          testStorage.should.be.a('object');
          testStorage.should.have.property('title', 'Test storage');
          testStorage.should.have.property('price', 1);
          testStorage.should.have.property('description', 'Test description');
          testStorage.should.have.property('category', 'Test');
          testStorage.imagePaths.should.be.a('array');
          testStorage.imagePaths[0].should.eql('test.jpg');
          testStorage.should.have.property('brand', 'Misc.');

          testStorage.rating.should.have.property("score", 4);
          testStorage.rating.should.have.property("count", 1);

          testStorage.reviews.should.be.a('array');
          testStorage.reviews[0].should.have.property('creatorId');
          testStorage.reviews[0].should.have.property('creatorName', 'test');
          testStorage.reviews[0].should.have.property('review', 'Test review');
          testStorage.reviews[0].should.have.property('recommended', true);
          done();
        });
    });

    it('it should create a new storage', (done) => {
      chai.request(server)
        .post('/api/storages/create/')
        .set("Authorization", "Bearer " + jwebtoken)
        .field('title', 'New storage')
        .field('price', '1.5')
        .field('description', 'New description')
        .field('category', 'Test')
        .field('brand', 'Misc.')
        .attach('image', fs.readFileSync(path.join(__dirname, '..',
          'files', 'test-image.jpg')), 'test-image.jpg')
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          let testStorage = res.body;

          testStorage.should.be.a('object');
          testStorage.should.have.property('title', 'New storage');
          testStorage.should.have.property('price', 1.5);
          testStorage.should.have.property('description', 'New description');
          testStorage.should.have.property('category', 'Test');
          testStorage.should.have.property('brand', 'Misc.');

          testStorage.imagePaths.should.be.a('array');
          testStorage.imagePaths.length.should.equal(1);

          testStorage.rating.should.have.property("score", 0);
          testStorage.rating.should.have.property("count", 0);

          testStorage.reviews.should.be.a('array');
          testStorage.reviews.length.should.equal(0);
          done();
        });
    });

    it('it should update an existing storage', (done) => {
      chai.request(server)
        .put('/api/storages/update/' + testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          title: 'Updated storage',
          price: 3,
          description: 'Updated description',
          category: 'Updated',
          brand: 'Updated Misc.'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testStorage = res.body;

          testStorage.should.be.a('object');
          testStorage.should.have.property('title', 'Updated storage');
          testStorage.should.have.property('price', 3);
          testStorage.should.have.property(
            'description',
            'Updated description'
          );
          testStorage.should.have.property('category', 'Updated');
          testStorage.imagePaths.should.be.a('array');
          testStorage.should.have.property('brand', 'Updated Misc.');

          testStorage.rating.should.have.property("score", 4);
          testStorage.rating.should.have.property("count", 1);

          testStorage.reviews.should.be.a('array');
          testStorage.reviews.length.should.equal(1);
          done();
        });
    });

    it('it should delete an existing storage', (done) => {
      chai.request(server)
        .delete('/api/storages/delete/' + testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testStorage = res.body;

          testStorage.should.be.a('object');
          testStorage.should.have.property('title', 'Test storage');
          done();
        });
    });

    it('it should not retrieve a non-existent storage', (done) => {
      chai.request(server)
        .get('/api/storages/5c12dce373b0ec340612f359')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('it should not create a new storage with empty fields', (done) => {
      chai.request(server)
        .post('/api/storages/create/')
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

    it('it should not create a new storage with duplicate title',
      (done) => {
        chai.request(server)
          .post('/api/storages/create/')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            title: 'Test storage',
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
              'Storage with this title already exists');
            done();
          });
      });

    it('it should not update a storage with empty fields', (done) => {
      chai.request(server)
        .put('/api/storages/update/' + testStorageId)
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

    it('it should not update a non-existent storage', (done) => {
      chai.request(server)
        .put('/api/storages/update/5c12dce373b0ec340612f359')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          title: 'Updated storage',
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

    it('it should not delete a non-existent storage', (done) => {
      chai.request(server)
        .delete('/api/storages/delete/5c12dce373b0ec340612f359')
        .set("Authorization", "Bearer " + jwebtoken)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          done();
        });
    });

    it('it should not create a new ' +
      'storage without admin privilages', (done) => {
        chai.request(server)
          .post('/api/storages/create/')
          .field('title', 'New storage')
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
      ' storage without admin privilages', (done) => {
        chai.request(server)
          .put('/api/storages/update/' + testStorageId)
          .send({
            title: 'Updated storage',
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
      'storage without admin privilages', (done) => {
        chai.request(server)
          .delete('/api/storages/delete/' + testStorageId)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
  });

  describe('Storage review CRUD operations', () => {
    it("it should add a review to a storage", (done) => {
      chai.request(server)
        .put('/api/storages/review/' + testStorageId + '/' + testUserId)
        .send({
          name: "test",
          text: "Test review 2",
          recommended: false,
          score: 2
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          let testStorage = res.body.storage;

          testStorage.should.be.a('object');
          testStorage.should.have.property('title', 'Test storage');
          testStorage.reviews.should.be.a('array');

          testStorage.rating.should.have.property("score", 3);
          testStorage.rating.should.have.property("count", 2);

          let testReview = testStorage.reviews[1];

          testReview.should.have.property('creatorId');
          testReview.should.have.property('creatorName', 'test');
          testReview.should.have.property('review', 'Test review 2');
          testReview.should.have.property('recommended', false);
          done();
        });

    });
  });

  describe('Storage queries', () => {
    beforeEach((done) => {
      User.deleteMany({}, (err) => {
        let i;
        let storages = [];

        for (i = 0; i < 5; i += 1) {
          let newStorage = new Storage({
            title: "Test storage " + i,
            price: i * 4 + 2,
            description: "Test description " + i,
            category: "Test" + i % 2,
            brand: "Misc." + i % 3,
            imagePaths: ["test.jpg"],
            available: i % 2 === 0,

            rating: {
              score: i + 1,
              count: 1
            }
          });

          storages.push(newStorage);
        }
        Storage.insertMany(storages, (err, docs) => {
          if (err) {
            console.error(err);
          }
          done();
        });
      });
    });

    it('it should retrieve all storages', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');
          let testStorage = res.body.storages[1];

          testStorage.should.be.a('object');
          testStorage.should.have.property('title', 'Test storage 0');
          testStorage.should.have.property('price', 2);
          testStorage.should.have.property('description', 'Test description 0');
          testStorage.should.have.property('category', 'Test0');
          testStorage.imagePaths.should.be.a('array');
          testStorage.imagePaths[0].should.eql('test.jpg');
          testStorage.should.have.property('brand', 'Misc.0');

          testStorage.rating.should.have.property("score", 1);
          testStorage.rating.should.have.property("count", 1);

          done();
        });
    });

    it('it should retrieve storages by title', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'title': '3'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');
          let testStorage = res.body.storages[0];

          testStorage.should.be.a('object');
          testStorage.should.have.property('title', 'Test storage 3');

          done();
        });
    });
    it('it should retrieve storages by category', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'category': 'Test0'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');

          for (let i = 0; i < res.body.storages.length; i += 1) {
            res.body.storages[i].should.be.a('object');
            res.body.storages[i].should.have.property('category', 'Test0');
          }
          done();
        });
    });

    it('it should retrieve storages by brand', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'brand': 'Misc.1'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');

          for (let i = 0; i < res.body.storages.length; i += 1) {
            res.body.storages[i].should.be.a('object');
            res.body.storages[i].should.have.property('brand', 'Misc.1');
          }
          done();
        });
    });

    it('it should retrieve storages by availability', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'available': true
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');

          for (let i = 0; i < res.body.storages.length; i += 1) {
            res.body.storages[i].should.be.a('object');
            res.body.storages[i].should.have.property('available', true);
          }
          done();
        });
    });

    it('it should retrieve storages by min price', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'minPrice': 4.5
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');

          for (let i = 0; i < res.body.storages.length; i += 1) {
            res.body.storages[i].should.be.a('object');
            res.body.storages[i].price.should.be.above(4.5);
          }
          done();
        });
    });

    it('it should retrieve storages by max price', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'maxPrice': 7.5
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');

          for (let i = 0; i < res.body.storages.length; i += 1) {
            res.body.storages[i].should.be.a('object');
            res.body.storages[i].price.should.be.below(7.5);
          }
          done();
        });
    });

    it('it should retrieve storages by a range of prices', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'minPrice': 3.5,
          'maxPrice': 7.5
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');

          for (let i = 0; i < res.body.storages.length; i += 1) {
            res.body.storages[i].should.be.a('object');
            res.body.storages[i].price.should.be.above(3.5);
            res.body.storages[i].price.should.be.below(7.5);
          }
          done();
        });
    });

    it('it should retrieve storages by min score', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .query({
          'minScore': 3
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.storages.should.be.a('array');

          for (let i = 0; i < res.body.storages.length; i += 1) {
            res.body.storages[i].should.be.a('object');
            res.body.storages[i].rating.score.should.be.above(2.9);
          }
          done();
        });
    });

  })
});
