/**
 * Functions for User
 */

const bcrypt = require('bcryptjs')

const repository = require('../repositories/user.repository')
const ValidationContract = require('../validators/fluent.validator')
const authService = require('../services/auth.service')

const saltRounds = 10

exports.isEmailValid = async (email) => {
  const userWithEmail = await repository.findByEmail(email)

  if (userWithEmail) {
    return false
  }
  return true
}

exports.validateEmail = async (email) => {
  const contract = new ValidationContract()
  contract.isRequired(email, 'E-mail é obrigatória.')
  contract.isEmail(email, 'E-mail inválido.')

  return contract.errors()
}

exports.validateEmailAndPassword = async (data) => {
  const contract = new ValidationContract()
  contract.isRequired(data.email, 'E-mail é obrigatória.')
  contract.isEmail(data.email, 'E-mail inválido.')
  contract.isRequired(data.password, 'Senha é obrigatória.')
  contract.hasMinLen(data.password, 3, 'A senha deve conter pelo menos 3 caracteres.')

  return contract.errors()
}

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

exports.isCorrectPassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

exports.getUserIdFromToken = async (fullToken) => {
  const token = fullToken.split(' ')[1]
  const userData = await authService.decodeToken(token)

  return userData.id
}
