'use strict'

const date = require('date-and-time')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// options is necessary so mongoose populate virtuals fields in normal requests
const options = { toJSON: { virtuals: true } }
const schema = new Schema({
  start: {
    type: Date,
    required: true,
    index: true
  },
  end: {
    type: Date,
    required: true,
    index: true
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  guests: [{
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'refused'],
      default: 'pending',
      required: true
    }
  }]
},
options)

schema.virtual('startTZ').get(function () {
  return date.format(this.start, 'YYYY-MM-DD HH:mm:ss')
})

schema.virtual('endTZ').get(function () {
  return date.format(this.end, 'YYYY-MM-DD HH:mm:ss')
})

module.exports = mongoose.model('Event', schema)
