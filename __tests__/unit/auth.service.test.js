/* eslint-env jest */

// // const jwt = require('jsonwebtoken')

// const app = require('../../src/app')

// const request = require('supertest')(app)

// const {
//   // authorize,
//   getUserIdFromToken,
//   // authorizeGql,
//   generateToken
// } = require('../../src/services/auth.service')

// describe('Auth service tests', () => {
//   const userData = { id: 123, email: 'email@email.com' }

//   it('Should get an ID from a valid token', async () => {
//     const token = await generateToken(userData)
//     const res = await getUserIdFromToken(`Bearer ${token}`)
//     expect(res).toBe(userData.id)
//   })

//   it('Should NOT get an ID without a token', async () => {
//     const token = ''
//     const res = await getUserIdFromToken(token)
//     expect(res).toBeNull()
//   })

//   it('Should NOT get an ID from a invalid token', async () => {
//     const token = 'ajskdhklahsd'
//     const res = await getUserIdFromToken(`Beater ${token}`)
//     expect(res).toBeNull()
//   })
// })
