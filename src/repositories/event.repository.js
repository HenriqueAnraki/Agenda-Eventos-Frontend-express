'use strict'

const mongoose = require('mongoose')
const Event = mongoose.model('Event')

exports.createNewEvent = async (data) => {
  const event = new Event(data)
  await event.save()
}

/**
 * Get user events, including pending and confirmed invites
 */
exports.getByOwner = async (userId) => {
  const events = await Event
    .find({
      $or: [
        { owner: userId },
        {
          $and: [
            { 'guests.user': { $in: userId } },
            { 'guests.status': { $ne: 'refused' } }
          ]
        }
      ]
    })
    .sort({ start: 'asc' })
    .populate('guests.user', 'email')
    .populate('owner', 'email')
  return events
}

exports.getById = async (eventId, userId) => {
  const event = await Event.findOne({ _id: eventId, owner: userId }, 'start end description guests owner')
    .populate('guests.user', 'email')
    .populate('owner', 'email')
  return event
}

exports.countEventOverlap = async (start, end, userId, eventId = null) => {
  const query = {
    owner: userId,
    start: { $lt: end },
    end: { $gt: start }
  }

  /**
   * Verify if the new time of the event being updated is valid.
   */
  if (eventId) {
    query._id = { $ne: eventId }
  }

  const numOverlaps = await Event.find(query).count()

  return numOverlaps
}

exports.update = async (eventId, data) => {
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
  await Event.findOneAndRemove({
    _id: eventId,
    owner: userId
  })
}

// exports.updateGuests = async (eventId, userId, guests) => {
exports.addGuests = async (eventId, userId, guests) => {
  await Event.findOneAndUpdate({
    _id: eventId,
    owner: userId
  }, {
    $push: {
      guests: guests
    }
  })
}

exports.updateGuestStatus = async (eventId, userId, answer) => {
  await Event.findOneAndUpdate({
    _id: eventId,
    'guests.user': userId
  }, {
    $set: {
      'guests.$.status': answer
    }
  })
}

exports.getEventByIdAndGuestId = async (eventId, userId) => {
  const event = await Event.findOne({
    _id: eventId,
    'guests.user': userId
  }, 'start end')

  return event
}
