/* eslint-env jest */

const app = require('../../src/app')
const request = require('supertest')(app)

const mongoose = require('mongoose')

const dbHandler = require('../utils/dbHandler')
const { insertUserSeeds, insertEventSeeds } = require('../utils/seedsHandlers')
const { usersList, usersSeeds } = require('../class/user')
const { eventsList, eventsSeeds } = require('../class/event')

const { generateToken } = require('../../src/services/auth.service')

describe('Event Integration tests', () => {
  let userToLoginToken = null
  let userToInviteToken = null

  afterAll(async () => {
    console.log('clearing db')
    await dbHandler.clearDatabase()
    await mongoose.connection.close()
    // done()
  })

  beforeAll(async () => {
  // beforeEach(async () => {
    await insertUserSeeds(usersSeeds, usersList)

    userToLoginToken = await generateUserToken(usersList.toLogin)
    userToInviteToken = await generateUserToken(usersList.toInvite)

    await insertEventSeeds(eventsSeeds, eventsList, usersList.toLogin.id)
  })

  // afterEach(async () => {
  //   // mongoose.disconnect()
  //   await dbHandler.clearDatabase()
  // })

  it('should create an event for a valid user', async () => {
    await request.post('/events/')
      .set('Authorization', `Bearer ${userToLoginToken}`)
      .send(eventsList.toCreate)
      .expect(201)
  })

  it('should not create an event for missing date', async () => {
    const res = await request.post('/events/')
      .set('Authorization', `Bearer ${userToLoginToken}`)
      .send(eventsList.missingEndDate)
      .expect(400)

    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toBe('Dados enviados possuem erro.')
  })

  it('Should not create an overlapping event', async () => {
    const res = await request.post('/events/')
      .set('Authorization', `Bearer ${userToLoginToken}`)
      .send(eventsList.overlap)
      .expect(400)

    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toBe('Evento se sobrepoem com outros!')
  })

  describe('Get logged user events', () => {
    it('Should get all 4 users events', async () => {
      const res = await request.get('/events/')
        .set('Authorization', `Bearer ${userToLoginToken}`)
        .expect(200)
      expect(res.body.length).toBe(4)
    })
  })

  describe('Update logged user events', () => {
    it('Should update one user event', async () => {
      const newNormalEvent3 = eventsList.normalEvent3
      newNormalEvent3.desc = 'NEW DESC'

      const res = await request.put(`/events/${newNormalEvent3.id}`)
        .set('Authorization', `Bearer ${userToLoginToken}`)
        .send(newNormalEvent3)
        .expect(200)

      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('Evento atualizado com sucesso!')
    })
  })

  describe('Guest tests', () => {
    describe('Adding Guest', () => {
      it('should Add a guest', async () => {
        const guests = [usersList.toInvite.id]

        const res = await request.post(`/events/${eventsList.normalEvent1.id}/guests`)
          .set('Authorization', `Bearer ${userToLoginToken}`)
          .send({ guests })
          .expect(200)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Evento atualizado com sucesso!')
      })

      it('should have a guest list', async () => {
        const res = await request.get(`/events/${eventsList.normalEvent1.id}`)
          .set('Authorization', `Bearer ${userToLoginToken}`)
          .expect(200)

        expect(res.body).toHaveProperty('guests')
        expect(res.body.guests.length).toBe(1)
        expect(res.body.guests[0]).toHaveProperty('user._id', usersList.toInvite.id.toString())
        expect(res.body.guests[0]).toHaveProperty('user.email', usersList.toInvite.email)
        expect(res.body.guests[0]).toHaveProperty('status', 'pending')
      })

      it('should Add the same guest to another event', async () => {
        const guests = [usersList.toInvite.id]

        const res = await request.post(`/events/${eventsList.normalEvent2.id}/guests`)
          .set('Authorization', `Bearer ${userToLoginToken}`)
          .send({ guests })
          .expect(200)

        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBe('Evento atualizado com sucesso!')
      })

      it('should list 2 events for the inveted user', async () => {
        const res = await request.get('/events')
          .set('Authorization', `Bearer ${userToInviteToken}`)
          .expect(200)

        expect(res.body.length).toBe(2)
      })

      describe('Answering invite', () => {
        it('Should accept the invite', async () => {
          const answer = 'confirmed'

          const res = await request.post(`/events/${eventsList.normalEvent1.id}/guests/answer`)
            .set('Authorization', `Bearer ${userToInviteToken}`)
            .send({ answer })
            .expect(200)

          expect(res.body).toHaveProperty('message')
          expect(res.body.message).toBe('Resposta atualizada com sucesso!')
        })

        it('should have modified the invite status to confirmed at the event invite', async () => {
          const res = await request.get(`/events/${eventsList.normalEvent1.id}`)
            .set('Authorization', `Bearer ${userToLoginToken}`)
            .expect(200)

          expect(res.body).toHaveProperty('guests')
          expect(res.body.guests.length).toBe(1)
          expect(res.body.guests[0]).toHaveProperty('user._id', usersList.toInvite.id.toString())
          expect(res.body.guests[0]).toHaveProperty('user.email', usersList.toInvite.email)
          expect(res.body.guests[0]).toHaveProperty('status', 'confirmed')
        })

        it('Should refuse the invite', async () => {
          const answer = 'refused'
          const res = await request.post(`/events/${eventsList.normalEvent2.id}/guests/answer`)
            .set('Authorization', `Bearer ${userToInviteToken}`)
            .send({ answer })
            .expect(200)

          expect(res.body).toHaveProperty('message')
          expect(res.body.message).toBe('Resposta atualizada com sucesso!')
        })

        it('should not list a refused event for the invited user', async () => {
          const res = await request.get('/events')
            .set('Authorization', `Bearer ${userToInviteToken}`)
            .expect(200)

          expect(res.body.length).toBe(1)
        })
      })
    })
  })
})

const generateUserToken = async (user) => {
  const token = await generateToken({
    id: user.id,
    email: user.email
  })

  return token
}
