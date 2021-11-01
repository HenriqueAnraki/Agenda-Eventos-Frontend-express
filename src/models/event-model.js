'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    start: {
        type: Date,
        required,
        index
    },
    end: {
        type: Date,
        required,
        index
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required
    },
    guests: [{
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'refused'],
            required
        }
    }]
})

module.exports = mongoose.model('Event', schema)