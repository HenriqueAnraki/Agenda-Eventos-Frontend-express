'use strict'

const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.create = async (data) => {
    let user = new User(data);
    await user.save();
}

exports.findByEmail = async (email) => {
    return User.findOne({ email }, 'email');
}