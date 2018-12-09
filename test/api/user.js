//During the test the env variable is set to test
process.env.NODE_ENV = 'TEST';

let mongoose = require("mongoose");
let User = require('../../models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();

chai.use(chaiHttp);
describe('Users', () => {
  before((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  /*
   *after((done) => {
   * User.remove({}, (err) => {
   * done();
   * });
   * });
   */
  /*
   * Register test user
   */
  describe('Valid user authentication and profile management requests', () => {
    let jwt;

    it('it should register user', (done) => {
      chai.request(server)
        .post('/api/users/register')
        .send({
          "name": "Test",
          "email": "test@example.com",
          "password": "123456",
          "password2": "123456"
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.user.should.have.property("name", "Test");
          res.body.user.should.have.property("email", "test@example.com");
          res.body.user.should.have.property("password");
          res.body.user.should.have.property("date");
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
          jwt = res.body.token;
          done();
        });
    });

    it('it should update user profile', (done) => {
      chai.request(server)
        .post('/api/users/profile')
        .set("Authorization", "Bearer " + jwt)
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
        .set("Authorization", "Bearer " + jwt)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property("name", "Test2");
          res.body.should.have.property("email", "test2@example.com");
          res.body.should.have.property("address", "Test address");
          res.body.should.have.property("tel", 989120000000);
          done();
        });
    });

    it('it should change user password', (done) => {
      chai.request(server)
        .post('/api/users/change_pwd')
        .set("Authorization", "Bearer " + jwt)
        .send({
          oldPassword: "123456",
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
          email: "test2@example.com"
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Invalid user authentication and' +
    ' profile management requests', () => {
      let jwt;

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
            "name": "Test2",
            "email": "test2@example.com",
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
            email: "test2@example.com",
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
});
