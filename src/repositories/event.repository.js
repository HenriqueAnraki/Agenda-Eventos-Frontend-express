'use strict'

const mongoose = require('mongoose')
const Event = mongoose.model('Event')

exports.createNewEvent = async (data) => {
  const event = new Event(data)
  await event.save()
}

exports.findByOwner = async (id) => {
  const events = await Event.find({ owner: id }, 'start end description')
  return events
}
