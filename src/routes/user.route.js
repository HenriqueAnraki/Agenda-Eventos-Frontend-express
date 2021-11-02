'use strict'

const express = require('express')
const controller = require('../controllers/user.controller')

const router = express.Router()

router.post('/login', controller.login)
router.post('/', controller.createUser)

module.exports = router
