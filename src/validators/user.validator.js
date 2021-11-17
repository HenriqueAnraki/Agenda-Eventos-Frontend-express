const ValidationContract = require('../validators/fluent.validator')
const { handleValidatorsErrors } = require('../services/validator.service')

exports.validateEmail = async (email) => {
  const contract = new ValidationContract()
  contract.isRequired(email, 'E-mail é obrigatória.')
  contract.isEmail(email, 'E-mail inválido.')

  return handleValidatorsErrors(contract.errors())
}

exports.validateEmailAndPassword = async (data) => {
  const contract = new ValidationContract()
  contract.isRequired(data.email, 'E-mail é obrigatória.')
  contract.isEmail(data.email, 'E-mail inválido.')
  contract.isRequired(data.password, 'Senha é obrigatória.')
  contract.hasMinLen(data.password, 3, 'A senha deve conter pelo menos 3 caracteres.')

  return handleValidatorsErrors(contract.errors())
}
