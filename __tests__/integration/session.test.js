/* eslint-env jest */
// factory girl
// faker
const mongoose = require('mongoose')

const { HTTP_ERROR } = require('../../src/enums/httpErrors')
const app = require('../../src/app')

const request = require('supertest')(app)
// request = request(app)

const dbHandler = require('../utils/dbHandler')
const { insertUserSeeds } = require('../utils/seedsHandlers')
const { usersList, usersSeeds } = require('../class/user')

let userValidToken = null

describe('User Tests', () => {
  afterAll(async () => {
    // mongoose.disconnect()
    console.log('clearing db')
    await dbHandler.clearDatabase()
    await mongoose.connection.close()
    // done()
  })

  beforeAll(async () => {
  // beforeEach(async () => {
    await insertUserSeeds(usersSeeds, usersList)
  })

  // afterEach(async () => {
  //   // mongoose.disconnect()
  //   console.log('clearing db')
  //   await dbHandler.clearDatabase()
  //   // done()
  // })

  describe('Testing login', () => {
    describe('Creating user', () => {
      it('Shouldnt create an user without a password', async () => {
        const response = await request
          .post('/users/')
          .send(usersList.withoutPassword)
          .expect(400)

        expect(response.body.message).toBe('Dados enviados possuem erro.')
      })

      it('Shouldnt create an user without an email', async () => {
        const response = await request
          .post('/users/')
          .send(usersList.withoutEmail)
          .expect(400)

        expect(response.body.message).toBe('Dados enviados possuem erro.')
      })

      it('Shouldnt create an user with an email already registered', async () => {
        const user = usersList.toLogin
        await request
          .post('/users/')
          .send(user)
          .expect(400)
      })

      it('Should create an user', async () => {
        const user = usersList.toCreate
        await request
          .post('/users/')
          .send(user)
          .expect(201)
      })
    })

    describe('it shouldnt log in with wrong credentials', () => {
      it('it shouldnt log in with wrong Password', async () => {
        await request
          .post('/users/login')
          .send(usersList.wrongPassword)
          .expect(401)
      })

      it('it shouldnt log in with wrong email', async () => {
        await request
          .post('/users/login')
          .send(usersList.wrongEmail)
          .expect(401)
      })
    })

    it('should receive JWT token when authenticated with valid credentials', async () => {
      console.log('trying to log in')
      console.log(usersList.toLogin)
      const res = await request
        .post('/users/login')
        .send(usersList.toLogin)
        .expect(200)

      expect(res.body).toHaveProperty('token')
      userValidToken = res.body.token
    })
  })

  describe('Get user by email', () => {
    it('should not authorize a getuserByEmail without a token', async () => {
      const userToGetInfo = usersList.toInvite
      await request
        .get(`/users/${userToGetInfo.email}`)
        .expect(HTTP_ERROR.UNAUTHORIZED)
    })

    it('should get user id when supplied with a valid email', async () => {
      const userToGetInfo = usersList.toInvite
      const res = await request
        .get(`/users/${userToGetInfo.email}`)
        .set('Authorization', `Bearer ${userValidToken}`)
        .expect(200)

      console.log(res.body)

      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('email', userToGetInfo.email)
    })
  })
})
