'use strict'

const mongoose = require('mongoose')
const Event = mongoose.model('Event')

exports.createNewEvent = async (data) => {
  const event = new Event(data)
  await event.save()
}

exports.getByOwner = async (userId) => {
  const events = await Event
    .find({ owner: userId }, 'start end description guests')
    .sort({ start: 'asc' })
  return events
}

exports.getById = async (eventId, userId) => {
  // it is getting indpendent of the owner -> change to find one
  // const event = await Event.findById(id, 'start end description guests owner', { owner: userId })
  const event = await Event.findOne({ _id: eventId, owner: userId }, 'start end description guests owner')
  return event
}

exports.countEventOverlap = async (userId, start, end) => {
  const numOverlaps = await Event.find({
    owner: userId,
    start: { $lt: end },
    end: { $gt: start }
  }).count()

  return numOverlaps
}

exports.countEventOverlapExcludingOne = async (userId, eventId, start, end) => {
  const numOverlaps = await Event.find({
    _id: { $ne: eventId },
    owner: userId,
    start: { $lt: end },
    end: { $gt: start }
  }).count()

  return numOverlaps
}

exports.update = async (eventId, data) => {
  // await Event.findByIdAndUpdate(eventId, {
  await Event.findOneAndUpdate({
    _id: eventId,
    owner: data.owner
  }, {
    $set: {
      start: data.start,
      end: data.end,
      description: data.description
    }
  })
}

exports.delete = async (eventId, userId) => {
  // await Event.findByIdAndUpdate(eventId, {
  await Event.findOneAndRemove({
    _id: eventId,
    owner: userId
  })
}
