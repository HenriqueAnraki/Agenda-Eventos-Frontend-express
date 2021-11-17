const ValidationContract = require('../validators/fluent.validator')
const { handleValidatorsErrors } = require('../services/validator.service')
const repository = require('../repositories/event.repository')

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

exports.validateGuestsIds = async (guestsIds, eventId, userId) => {
  // console.log(guestsIds)
  // console.log(eventId)
  // console.log(userId)

  const event = await repository.getById(eventId, userId)
  // console.log(event)

  const contract = new ValidationContract()
  contract.isRequired(guestsIds, 'A lista de convidados é obrigatória.')
  contract.dontHaveRepeatedGuests(event.guests, guestsIds, 'Lista de convidados contém usuários ja convidados.')
  contract.dontInviteYourself(guestsIds, userId, 'Você não pode se auto convidar.')

  return handleValidatorsErrors(contract.errors())
}
