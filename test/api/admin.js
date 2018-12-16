//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

let mongoose = require("mongoose");
let Admin = require('../../models/Admin');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();

chai.use(chaiHttp);
describe('Admins', () => {
  //Make sure admins collection is empty except for test admin before each test

  beforeEach((done) => {
    Admin.deleteMany({}, (err) => {
      let testAdmin = new Admin({
        name: "admin",
        password: "$2a$10$97ZkW030N4hX5E5Fdl4uguIAAtjPUoHpQevZ2eof.8xZiSF8XVX6O"
      });

      testAdmin.save((err) => {
        done();
      })
    });
  });
  //Again make sure users collection is empty after tests
  afterEach((done) => {
    Admin.deleteMany({}, (err) => {
      done();
    });
  });

  /*
   * Register test user
   */
  describe('Admin authentication and change password', () => {

    it('it should login admin', (done) => {
      chai.request(server)
        .post('/api/admins/login')
        .send({
          name: "admin",
          password: "admin"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property("token");
          done();
        });
    });
  });
});
