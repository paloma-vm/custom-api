
require('dotenv').config()
const app = require("./../server");
const mongoose = require('mongoose');
const chai = require("chai");
const chaiHttp = require("chai-http");
const { ObjectId } = require('mongodb'); // added this because the test was getting _id as hexidecimal (help from ChatGPT)
const expect = chai.expect
const should = chai.should();

chai.use(chaiHttp);

const User = require('../models/user')
const Bulletin = require('../models/bulletin');

// code from chai testing challenges
/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_USER_ID = 'uuuuuuuuuuuu' // 12 byte string
const SAMPLE_BULLETIN_ID = 'bbbbbbbbbbbb'

describe("API Tests", function() {
  // sample bulletin for use in tests
  beforeEach((done) => {
    const sampleUser = new User({
      username: 'myuser',
      password: 'mypassword',
      _id: new ObjectId(SAMPLE_USER_ID)  // changed to address hexidecimal (help from ChatGPT)
    })
    sampleUser.save((err, savedUser) => {
      if (err) {
        return done(err)
      }
      const sampleBulletin = new Bulletin({
        title: 'Garage Sale',
        body: 'Multi-family garage sale this Saturday 123-189 Green St.',
        postedBy: savedUser,
        _id: new ObjectId(SAMPLE_BULLETIN_ID)
      })
      sampleBulletin.save((err, savedBulletin) => {
        if (err) {
          return done(err)
        }
        done()
      })
    })
  })

  // delete sample bulletin
  afterEach((done) => {
    Bulletin.deleteOne({ _id: SAMPLE_BULLETIN_ID }, (err) => {
      if (err) {
        return done(err)
      }
      User.deleteOne({ _id: SAMPLE_USER_ID }, (err) => {
        if (err) {
          return done(err)
        }
        done()
      })
    })
  })
  // TODO: Should test each endpoint of your API
  // INDEX
  it("should load all bulletins", (done) => {
    chai.request(app)
    .get('/bulletins')
    .end((err, res) => {
      if (err) {done(err) }
        expect(res).to.have.status(200)
        expect(res.body.bulletins).to.be.an("array")
        done()
    })
  })
  // CREATE
  it("should post a new bulletin", (done) => {
    chai.request(app)
    .post('/bulletins')
    .send({title: 'Lost Cat', body: 'Lost Cat, orange tabby with green collar'})
    .end((err, res) => {
      if (err) { done(err) }
      expect(res.body).to.be.an('object')
      expect(res.body.bulletin).to.have.property('title', 'Lost Cat')

      // check that the bulletin is actually inserted into database
      Bulletin.findOne({title: 'Lost Cat'}).then(bulletin => {
        expect(bulletin).to.be.an('object')
        done()
      })
    })
  })
  // READ
  it("should get one specific bulletin", (done) => {
    chai.request(app)
    .get(`/bulletins/${SAMPLE_BULLETIN_ID}`)
    .end((err, res) => {
      if (err) { done(err) }
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.title).to.equal('Garage Sale')
      expect(res.body.body).to.equal('Multi-family garage sale this Saturday 123-189 Green St.')
      done()
    })
  })
  // UPDATE
  it('should update a bulletin', (done) => {
    // TODO: Complete this
    chai.request(app)
    .put(`/bulletins/${SAMPLE_BULLETIN_ID}`)
    .send({title: 'Garage Sale'})
    .end((err, res) => {
      if (err) { done(err) }
      expect(res.body.bulletin).to.be.an('object')
      expect(res.body.bulletin).to.have.property('title', 'Garage Sale')

      // check that bulletin is actually inserted into database
      Bulletin.findOne({title: 'Garage Sale'}).then(bulletin => {
        expect(bulletin).to.be.an('object')
        done()
      })
    })
  })
  // DELETE
  it('should delete a bulletin', (done) => {
    chai.request(app)
    .delete(`/bulletins/${SAMPLE_BULLETIN_ID}`)
    .end((err, res) => {
      if (err) { done(err) }
      expect(res.body.bulletin).to.equal('The bulletin has been successfully deleted.')
      expect(res.body._id).to.equal(SAMPLE_BULLETIN_ID)

      // check that message is actually deleted from database
      Bulletin.findOne({title: 'Garage Sale'}).then(bulletin => {
        expect(bulletin).to.equal(null)
        done()
      })
    })
  })
});
