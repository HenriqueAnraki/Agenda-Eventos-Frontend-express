/**
 * Functions for User
 */

const bcrypt = require('bcryptjs')

const repository = require('../repositories/user.repository')

const saltRounds = 10

exports.isEmailRegistered = async (email) => {
  const userWithEmail = await repository.findByEmail(email)

  return userWithEmail
}

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

exports.isCorrectPassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}
