'use strict'

const express = require('express')
const controller = require('../controllers/user.controller')
const asyncHandler = require('../services/asyncHandler.service')

const router = express.Router()

router.post('/login', asyncHandler(controller.login))
router.post('/', asyncHandler(controller.createUser))

module.exports = router
