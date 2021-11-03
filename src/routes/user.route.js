'use strict'

const express = require('express')
const controller = require('../controllers/user.controller')
const AH = require('../services/asyncHandler.service')
const authService = require('../services/auth.service')

const router = express.Router()

// Get
router.get('/:email', AH(authService.authorize), AH(controller.getUserIdByEmail))

// Post
router.post('/login', AH(controller.login))
router.post('/', AH(controller.createUser))

module.exports = router
