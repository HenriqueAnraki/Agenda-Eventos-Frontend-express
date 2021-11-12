'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.create = async (data) => {
  const user = new User(data)
  await user.save()
}

exports.findByEmail = async (email) => {
  return User.findOne({ email })
}

exports.getIdByEmail = async (email) => {
  return User.findOne({ email }, '_id email')
}
