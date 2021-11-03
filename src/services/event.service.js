const ValidationContract = require('../validators/fluent.validator')
const repository = require('../repositories/event.repository')

exports.validateEventData = async (data) => {
  const contract = new ValidationContract()
  contract.isRequired(data.start, 'Começo é obrigatório.')
  contract.isRequired(data.end, 'Fim é obrigatório.')
  contract.areValidDate(data.start, data.end, 'Datas inválidas.')

  return contract.errors()
}

exports.hasEventOverlap = async (userId, data) => {
  const numOverlaps = await repository.countEventOverlap(userId, data.start, data.end)

  console.log(numOverlaps)

  return numOverlaps > 0
}

exports.willUpdatedEventOverlap = async (userId, eventId, data) => {
  const numOverlaps = await repository.countEventOverlapExcludingOne(userId, eventId, data.start, data.end)

  console.log(numOverlaps)

  return numOverlaps > 0
}
