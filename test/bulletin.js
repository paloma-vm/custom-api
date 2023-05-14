
require('dotenv').config()
const app = require("./../server");
const mongoose = require('mongoose');
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

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

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string
const ANOTHER_SAMPLE_OBJECT_ID = 'bbbbbbbbbbbb'

describe("API Tests", function() {
  // sample bulletin for use in tests
  beforeEach((done) => {
    const sampleBulletin = new Bulletin({
      title: 'Garage Sale',
      body: 'Multi-family garage sale this Saturday 123-189 Green St.',
      author: SAMPLE_OBJECT_ID,
      _id: ANOTHER_SAMPLE_OBJECT_ID
    })
    sampleBulletin.save()
    .then(() => {
      done()
    })
  })
  // delete sample bulletin
  afterEach((done) => {
    Bulletin.deleteMany({ title: ['Garage Sale', 'Lost Cat'] })
    .then(() => {
      done()
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
      expect(res.body.bulletin).to.be.an('object')
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
    .get(`/bulletins/${ANOTHER_SAMPLE_OBJECT_ID}`)
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
    .put(`/bulletins/${SAMPLE_OBJECT_ID}`)
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
    .delete(`/bulletins/${SAMPLE_OBJECT_ID}`)
    .end((err, res) => {
      if (err) { done(err) }
      expect(res.body.bulletin).to.equal('The bulletin has been successfully deleted.')
      expect(res.body._id).to.equal(SAMPLE_OBJECT_ID)

      // check that message is actually deleted from database
      Bulletin.findOne({title: 'Garage Sale'}).then(bulletin => {
        expect(bulletin).to.equal(null)
        done()
      })
    })
  })
});
