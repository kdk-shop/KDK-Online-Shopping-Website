//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const mongoose = require("mongoose");
const Admin = require('../../models/Admin');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

chai.use(chaiHttp);
describe('Admins', () => {
  //Make sure admins collection is empty except for test admin before each test
  let jwebtoken;

  beforeEach((done) => {
    Admin.deleteMany({}, (err) => {
      let testAdmin = new Admin({
        name: "admin",
        password: "$2a$10$97ZkW030N4hX5E5Fdl4uguIAAtjPUoHpQevZ2eof.8xZiSF8XVX6O"
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

    it('it should change admin password', (done) => {
      chai.request(server)
        .post('/api/admins/change_pwd')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          currentPassword: "admin",
          password: "nimda",
          password2: "nimda"
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('it should not login admin with wrong password', (done) => {
      chai.request(server)
        .post('/api/admins/login')
        .send({
          name: "admin",
          password: "21368"
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('it should not login non-existent admin', (done) => {
      chai.request(server)
        .post('/api/admins/login')
        .send({
          name: "nidma",
          password: "admin"
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('it should not change admin password without jwt', (done) => {
      chai.request(server)
        .post('/api/admins/change_pwd')
        .send({
          currentPassword: "admin",
          password: "nimda",
          password2: "nimda"
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('it should not change admin password with' +
      ' wrong current password', (done) => {
        chai.request(server)
          .post('/api/admins/change_pwd')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            currentPassword: "kalsa",
            password: "nimda",
            password2: "nimda"
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('currentPassword',
              'Current password is incorrect');
            done();
          });
      });
  });
});
