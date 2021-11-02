const bcrypt = require('bcryptjs')

const repository = require('../repositories/user.repository')
const ValidationContract = require('../validators/fluent.validator')

const saltRounds = 10

exports.isEmailValid = async (email) => {
  const userWithEmail = await repository.findByEmail(email)

  console.log(userWithEmail)

  if (userWithEmail) {
    return false
  }

  return true
}

exports.validateEmailAndPassword = async (data) => {
  const contract = new ValidationContract()
  contract.isEmail(data.email, 'E-mail inválido.')
  contract.hasMinLen(data.password, 3, 'A senha deve conter pelo menos 3 caracteres.')

  // if (!contract.isValid()) {
  //   res.status(400).send(contract.errors())
  //   // return
  // }
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
