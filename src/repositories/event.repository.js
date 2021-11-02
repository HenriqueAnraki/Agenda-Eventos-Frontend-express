'use strict'

const mongoose = require('mongoose')
const Event = mongoose.model('Event')

exports.createNewEvent = async (data) => {
  const event = new Event(data)
  await event.save()
}

exports.findByOwner = async (id) => {
  const events = await Event
    .find({ owner: id }, 'start end description')
    .sort({ start: 'asc' })
  return events
}

exports.countEventOverlap = async (userId, start, end) => {
  const numOverlaps = await Event.find({
    owner: userId,
    start: { $lt: end },
    end: { $gt: start }
  }).count()

  return numOverlaps
}

exports.hasOverlapExcludingOne = async (start, end) => {

}
