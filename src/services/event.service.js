const ValidationContract = require('../validators/fluent.validator')

exports.validateEventData = async (data) => {
  const contract = new ValidationContract()
  contract.isRequired(data.start, 'Começo é obrigatório.')
  contract.isRequired(data.end, 'Fim é obrigatório.')
  contract.areValidDate(data.start, data.end, 'Datas inválidas.')

  return contract.errors()
}
