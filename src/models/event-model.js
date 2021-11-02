'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
            required: true
        }
    }]
})

module.exports = mongoose.model('Event', schema)