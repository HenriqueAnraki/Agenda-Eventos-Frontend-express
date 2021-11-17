/**
 * Functions for Event
 */

const repository = require('../repositories/event.repository')

exports.hasEventOverlap = async (userId, data) => {
  const numOverlaps = await repository.countEventOverlap(data.start, data.end, userId)
  return numOverlaps > 0
}

exports.willUpdatedEventOverlap = async (userId, eventId, data) => {
  const numOverlaps = await repository.countEventOverlap(data.start, data.end, userId, eventId)
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
