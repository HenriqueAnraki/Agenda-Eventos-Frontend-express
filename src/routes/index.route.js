'use strict'

const express = require('express')
const router = express.Router()

const { HTTP_ERROR } = require('../enums/httpErrors')

router.get('/', (req, res, next) => {
  res.status(HTTP_ERROR.OK).send({
    title: 'Agenda de eventos API',
    version: '1.0.0'
  })
})

module.exports = router
