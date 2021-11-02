'use-strict'

const repository = require('../repositories/event.repository')
// const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')

const debug = require('debug')('server')

exports.getUserEvents = async (req, res, next) => {
  res.status(200).send({ list: 'sua lista' })
}
