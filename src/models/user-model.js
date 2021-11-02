'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    // name: {
    //     type: String
    // },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    }
})

module.exports = mongoose.model('User', schema)