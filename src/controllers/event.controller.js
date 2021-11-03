'use-strict'

const repository = require('../repositories/event.repository')
// const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')
const userService = require('../services/user.service')
const eventService = require('../services/event.service')

// const debug = require('debug')('server')

exports.createNewEvent = async (req, res, next) => {
  // ta convertendo para UTC
  const body = req.body

  const contractErrors = await eventService.validateEventData(body)
  if (contractErrors.length > 0) {
    // res.status(400).send(contractErrors)
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  if (await eventService.hasEventOverlap(userId, body)) {
    const err = new CustomError('Evento se sobrepoem com outros!', { status: 400 })
    return next(err)
  }

  await repository.createNewEvent({
    start: body.start,
    end: body.end,
    description: body.description,
    owner: userId
  })

  res.status(201).send({
    message: 'Evento criado com sucesso!'
  })
}

exports.getUserEvents = async (req, res, next) => {
  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  const userEvents = await repository.findByOwner(userId)

  console.log(userEvents)
  res.status(200).send({ events: userEvents })
}

exports.getUserEventsById = async (req, res, next) => {
  const userEvent = await repository.findById(req.params.id)

  res.status(200).send({ event: userEvent })
}
