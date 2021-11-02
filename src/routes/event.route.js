'use strict'

const express = require('express')
const controller = require('../controllers/event.controller')
const authService = require('../services/auth.service')
const asyncHandler = require('../services/asyncHandler.service')

const router = express.Router()

router.get('/', asyncHandler(authService.authorize), asyncHandler(controller.getUserEvents))

module.exports = router
