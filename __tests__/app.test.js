/* eslint-env jest */

const request = require('supertest')
const app = require('../src/app')

const mongoose = require('mongoose')

describe('Testing the root path', () => {
  afterAll(async () => {
  // afterAll((done) => {
    // mongoose.disconnect(done)
    // await mongoose.disconnect()
    await mongoose.connection.close()
  })

  test('It should response the GET method - done', done => {
    // done
    request(app)
      .get('/')
      .then(res => {
        expect(res.statusCode).toBe(200)
        done()
      })
  })

  test('It should response the GET method - promise', () => {
    return request(app)
      .get('/')
      .then(res => {
        expect(res.statusCode).toBe(200)
      })
  })

  test('It should response the GET method - async', async () => {
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
  })

  test('It should response the GET method - supertest way', () => {
    // return é necessário
    return request(app)
      .get('/')
      .expect(200)
  })
})
