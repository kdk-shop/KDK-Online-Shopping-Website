//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const mongoose = require("mongoose");
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

chai.use(chaiHttp);
describe('Storages', () => {
  let testStorageId;

  beforeEach((done) => {
    //Make sure users collection is empty except for test user
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
        }
      });

      testProduct.save((err, product) => {
        Inventory.deleteMany({}, (err) => {
          let testInventory = new Inventory({
            products: [{
              product: product._id,
              qty: 1
            }]
          });

          testInventory.save((err, inventory) => {
            Storage.deleteMany({}, (err) => {
              let testStorage = new Storage({
                name: "Test storage",
                address: "Test address",
                inventory: inventory._id
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

    it('it should retrieve list of existing storages', (done) => {
      chai.request(server)
        .get('/api/storages/')
        .set("Authorization", "Bearer " + jwebtoken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testStorages = res.body.storages;

          testStorages.should.be.a('array');
          testStorages[0].should.be.a('object');
          testStorages[0].should.have.property('name', 'Test storage');
          testStorages[0].should.have.property('address', 'Test address');
          testStorages[0].should.have.property('inventory');

          done();
        });
    });

    it('it should create a new storage', (done) => {
      chai.request(server)
        .post('/api/storages/create/')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          name: 'Test storage 2',
          address: 'Test address 2'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          let testStorage = res.body;

          testStorage.should.be.a('object');
          testStorage.should.have.property('name', 'Test storage 2');
          testStorage.should.have.property('address', 'Test address 2');
          testStorage.should.have.property('inventory');

          done();
        });
    });

    it('it should update an existing storage', (done) => {
      chai.request(server)
        .put('/api/storages/update/' + testStorageId)
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          name: 'Test storage 2',
          address: 'Test address 2'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          let testStorage = res.body;

          testStorage.should.be.a('object');
          testStorage.should.have.property('name', 'Test storage 2');
          testStorage.should.have.property('address', 'Test address 2');
          testStorage.should.have.property('inventory');

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
          testStorage.should.have.property('name', 'Test storage');
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

    it('it should not create a new storage with duplicate name',
      (done) => {
        chai.request(server)
          .post('/api/storages/create/')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            name: 'Test storage'
          })
          .end((err, res) => {
            res.should.have.status(409);
            res.should.be.json;

            res.body.errors.should.have.property('name',
              'Storage with this name already exists');
            done();
          });
      });

    it('it should not update a non-existent storage', (done) => {
      chai.request(server)
        .put('/api/storages/update/5c12dce373b0ec340612f359')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          name: 'Updated name'
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
          .send({
            name: 'Test storage 2',
            address: 'Test address 2'
          })
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
            name: 'Updated storage'
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
});
