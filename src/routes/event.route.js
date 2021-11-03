'use strict'

const express = require('express')
const controller = require('../controllers/event.controller')
const authService = require('../services/auth.service')
const asyncHandler = require('../services/asyncHandler.service')

const router = express.Router()

router.get('/:id', asyncHandler(authService.authorize), asyncHandler(controller.getUserEventsById))
router.get('/', asyncHandler(authService.authorize), asyncHandler(controller.getUserEvents))
router.post('/guests/answer/:id', asyncHandler(authService.authorize), asyncHandler(controller.answerInvite))
router.post('/guests/:id', asyncHandler(authService.authorize), asyncHandler(controller.addGuests))
router.post('/', asyncHandler(authService.authorize), asyncHandler(controller.createNewEvent))
router.put('/:id', asyncHandler(authService.authorize), asyncHandler(controller.updateEvent))
router.delete('/:id', asyncHandler(authService.authorize), asyncHandler(controller.deleteEvent))

module.exports = router
