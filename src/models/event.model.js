'use strict'

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

module.exports = mongoose.model('Event', schema)
