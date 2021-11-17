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
