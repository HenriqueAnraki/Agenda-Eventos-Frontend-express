'use-strict'

const repository = require('../repositories/event.repository')
// const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')
const userService = require('../services/user.service')
const eventService = require('../services/event.service')

const debug = require('debug')('server')

exports.createNewEvent = async (req, res, next) => {
  const body = req.body

  const contractErrors = await eventService.validateEventData(body)
  if (contractErrors.length > 0) {
    res.status(400).send(contractErrors)
    return
  }

  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  const event = await repository.createNewEvent({
    start: body.start,
    end: body.end,
    description: body.description,
    owner: userId
  })

  console.log(event)
  res.status(201).send({
    message: 'Evento criado com sucesso!',
    events: event
  })
}

exports.getUserEvents = async (req, res, next) => {
  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  const userEvents = await repository.findByOwner(userId)

  console.log(userEvents)
  res.status(200).send({ myEvents: userEvents })
}
