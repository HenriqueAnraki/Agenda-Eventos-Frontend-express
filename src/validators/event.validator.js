const ValidationContract = require('../validators/fluent.validator')
const { handleValidatorsErrors } = require('../services/validator.service')

exports.validateRequiredValue = async (value, message) => {
  const contract = new ValidationContract()
  contract.isRequired(value, message)

  return handleValidatorsErrors(contract.errors())
}

exports.validateEventData = async (data) => {
  const contract = new ValidationContract()
  contract.isRequired(data.start, 'Começo é obrigatório.')
  contract.isRequired(data.end, 'Fim é obrigatório.')
  contract.areValidDate(data.start, data.end, 'Datas inválidas.')

  return handleValidatorsErrors(contract.errors())
}
