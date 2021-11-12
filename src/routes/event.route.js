'use strict'

const express = require('express')
const controller = require('../controllers/event.controller')
const authService = require('../services/auth.service')
const AH = require('../services/asyncHandler.service')

const router = express.Router()

// Get
router.get('/:id', AH(authService.authorize), AH(controller.getUserEventById))
router.get('/', AH(authService.authorize), AH(controller.getUserEvents))

// Post
router.post('/:id/guests/answer', AH(authService.authorize), AH(controller.answerInvite))
router.post('/:id/guests', AH(authService.authorize), AH(controller.setGuests))
router.post('/', AH(authService.authorize), AH(controller.createNewEvent))

// Put
router.put('/:id', AH(authService.authorize), AH(controller.updateEvent))

// Delete
router.delete('/:id', AH(authService.authorize), AH(controller.deleteEvent))

module.exports = router
