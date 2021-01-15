'use strict';

var expect = require('chai').expect;
var supertest = require('supertest');

module.exports = function(url){
  var api = supertest(url);
  describe('Signup Login Flow Test Cases', function() {
    it('Admin Login', function(done) {
      api.post('/People/login')
        .send({realm:'admin', email: 'advocosoft3@gmail.com', password:"123nandani456" })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var people = res.body.success;
          
          expect(people.id.length).to.be.above(1);
          done();
        });
    });

    it('vender signup test', function(done) {
      api.get('/clients/findOne')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var client = res.body;

          expect(Array.isArray(client)).to.be.false;
          done();
        });
    });
  });

}

