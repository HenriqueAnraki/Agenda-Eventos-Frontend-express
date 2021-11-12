/**
 * Functions for Event
 */

const ValidationContract = require('../validators/fluent.validator')
const repository = require('../repositories/event.repository')

exports.validateRequiredValue = async (value, message) => {
  const contract = new ValidationContract()
  contract.isRequired(value, message)

  return contract.errors()
}

exports.validateEventData = async (data) => {
  const contract = new ValidationContract()
  contract.isRequired(data.start, 'Começo é obrigatório.')
  contract.isRequired(data.end, 'Fim é obrigatório.')
  contract.areValidDate(data.start, data.end, 'Datas inválidas.')

  return contract.errors()
}

exports.hasEventOverlap = async (userId, data) => {
  const numOverlaps = await repository.countEventOverlap(userId, data.start, data.end)
  return numOverlaps > 0
}

exports.willUpdatedEventOverlap = async (userId, eventId, data) => {
  const numOverlaps = await repository.countEventOverlapExcludingOne(userId, eventId, data.start, data.end)
  return numOverlaps > 0
}

const removeIdFromList = async (idList, idToRemove) => {
  const idx = idList.indexOf(idToRemove)

  if (idx >= 0) {
    idList.splice(idx, 1)
  }
}

exports.getNewGuestsIds = async (eventId, userId, guestsIds) => {
  // get event to compare guests
  const event = await repository.getById(eventId, userId)

  // Removing user own id
  removeIdFromList(guestsIds, userId)

  // Removing guests already invited
  event.guests.forEach((currentGuest) => {
    console.log(currentGuest.user._id)
    const currentGuestId = currentGuest.user._id.toString()

    removeIdFromList(guestsIds, currentGuestId)
  })

  return guestsIds
}
