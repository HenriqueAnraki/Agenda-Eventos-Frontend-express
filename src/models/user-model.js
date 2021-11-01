'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    // name: {
    //     type: String
    // },
    password: {
        type: String,
        required
    },
    email: {
        type: String,
        unique,
        index
    }
})

module.exports = mongoose.model('User', schema)