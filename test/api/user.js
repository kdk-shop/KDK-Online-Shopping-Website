//During the test the env variable is set to test
if (process.env.NODE_ENV !== 'TRAVIS') {
  process.env.NODE_ENV = 'TEST';
}

const mongoose = require("mongoose");
const User = require('../../models/User');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

chai.use(chaiHttp);
describe('Users', () => {
  //Make sure users collection is empty except for test user before each test
  let userId;

  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      let testUser = new User({
        name: "test",
        email: "test@example.com",
        password: "$2a$10$U2axE8DVGi2m/BAt4RDFZeMG" +
          "t0OPSkRf8T0oec5KFVIBy5Y4fGBUa",
        address: "Test address",
        phoneNumber: 989120000000
      });

      testUser.save((err, user) => {
        userId = user._id;
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
  describe('User registrarion and authentication', () => {

    it('it should register new user', (done) => {
      chai.request(server)
        .post('/api/users/register')
        .send({
          "name": "Test2",
          "email": "test2@example.com",
          "password": "123456",
          "password2": "123456"
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.user.should.have.property("name", "Test2");
          res.body.user.should.have.property("email", "test2@example.com");
          res.body.user.should.have.property("password");
          res.body.user.should.have.property("date");
          res.body.user.should.have.property("shoppingCart");

          done();
        });
    });

    it('it should login user', (done) => {
      chai.request(server)
        .post('/api/users/login')
        .send({
          email: "test@example.com",
          password: "123456"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property("token");
          done();
        });
    });

    it('it should not register user with' +
      ' empty email/name/password/confirm fields', (done) => {
        chai.request(server)
          .post('/api/users/register')
          .send({})
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property("email", "Email field is required");
            res.body.should.have.property(
              "password",
              "Password field is required"
            );
            res.body.should.have.property(
              "password2",
              "Confirm password is required"
            );
            res.body.should.have.property("name", "Name field is required");
            done();
          });
      });

    it('it should not register user with' +
      ' invalid email/short name/short pwd', (done) => {
        chai.request(server)
          .post('/api/users/register')
          .send({
            email: "asdcwqo.asa",
            name: "a",
            password: "12"
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property("email", "Email is invalid");
            res.body.should.have.property(
              "password",
              "Password must be at least 6 characters"
            );
            res.body.should.have.property(
              "name",
              "Name must be between 2 and 30 characters"
            );
            done();
          });
      });

    it('it should not register user with' +
      ' incorrect confirm password', (done) => {
        chai.request(server)
          .post('/api/users/register')
          .send({
            email: "test@example.com",
            name: "test",
            password: "123456",
            password2: "123446"
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property(
              "password2",
              "Passwords must match"
            );
            done();
          });
      });

    it('it should not register existing user', (done) => {
      chai.request(server)
        .post('/api/users/register')
        .send({
          "name": "test",
          "email": "test@example.com",
          "password": "123456",
          "password2": "123456"
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property("name", "Username already exists");
          res.body.should.have.property("email", "Email already exists");
          done();
        });
    });

    it('it should not login user with empty fields', (done) => {
      chai.request(server)
        .post('/api/users/login')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property(
            "email",
            "Email field is required"
          );
          res.body.should.have.property(
            "password",
            "Password field is required"
          );
          done();
        });
    });

    it('it should not login user with incorrect credintials', (done) => {
      chai.request(server)
        .post('/api/users/login')
        .send({
          email: "test@example.com",
          password: "492123"
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property("password", "Password incorrect");
          done();
        });
    });
  });

  describe('User profile', () => {
    let jwebtoken;

    beforeEach((done) => {
      const payload = {
        id: userId,
        name: 'test'
      };

      jwt.sign(payload, keys.secretOrKey, {
        expiresIn: '1d'
      }, (err, token) => {
        jwebtoken = token;
        done();
      });
    });
    it('it should update user profile', (done) => {
      chai.request(server)
        .post('/api/users/profile')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          name: "Test2",
          email: "test2@example.com",
          address: "Test address",
          tel: 989120000000
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('it should retrieve user profile', (done) => {
      chai.request(server)
        .get('/api/users/profile')
        .set("Authorization", "Bearer " + jwebtoken)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property("name", "test");
          res.body.should.have.property("email", "test@example.com");
          res.body.should.have.property("address", "Test address");
          res.body.should.have.property("tel", 989120000000);
          done();
        });
    });

    it('it should change user password', (done) => {
      chai.request(server)
        .post('/api/users/change_pwd')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({
          currentPassword: "123456",
          password: "654321",
          password2: "654321"
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('it should reset user password', (done) => {
      chai.request(server)
        .patch('/api/users/reset_pwd')
        .send({
          email: "test@example.com"
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('it should not change user password without jwt', (done) => {
      chai.request(server)
        .post('/api/users/change_pwd')
        .send({
          currentPassword: "123456",
          password: "492123",
          password2: "492123"
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('it should not change user password with empty fields', (done) => {
      chai.request(server)
        .post('/api/users/change_pwd')
        .set("Authorization", "Bearer " + jwebtoken)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property(
            "password",
            "New password is required"
          );
          res.body.should.have.property(
            "password2",
            "Confirm password is required"
          );
          res.body.should.have.property(
            "currentPassword",
            "Current password is required"
          );
          done();
        });
    });

    it('it should not change user password with' +
      'wrong current password', (done) => {
        chai.request(server)
          .post('/api/users/change_pwd')
          .set("Authorization", "Bearer " + jwebtoken)
          .send({
            currentPassword: "1235543",
            password: "492123",
            password2: "492123"
          })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.errors.should.have.property('currentPassword',
              'Current password is incorrect');
            done();
          });
      });
  });
});
