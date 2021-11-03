'use-strict'

const repository = require('../repositories/event.repository')
// const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')
const userService = require('../services/user.service')
const eventService = require('../services/event.service')

const debug = require('debug')('server')

exports.createNewEvent = async (req, res, next) => {
  // [todo]está convertendo para UTC
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

  const userEvents = await repository.getByOwner(userId)

  console.log(userEvents)
  res.status(200).send({ events: userEvents })
}

exports.getUserEventsById = async (req, res, next) => {
  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  debug(userId)

  const userEvent = await repository.getById(req.params.id, userId)

  res.status(200).send({ event: userEvent })
}

// [todo] falar quando o usuario tenta editar um evento que não é seu?
exports.updateEvent = async (req, res, next) => {
  debug('update event')
  // [todo]está convertendo para UTC
  const body = req.body
  const eventId = req.params.id

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

  if (await eventService.willUpdatedEventOverlap(userId, eventId, body)) {
    const err = new CustomError('Evento irá se sobrepor com outros!', { status: 400 })
    return next(err)
  }

  await repository.update(eventId, {
    start: body.start,
    end: body.end,
    description: body.description,
    owner: userId
  })

  res.status(200).send({
    message: 'Evento atualizado com sucesso!'
  })
}

exports.deleteEvent = async (req, res, next) => {
  debug('remove event')
  // [todo]está convertendo para UTC
  const eventId = req.params.id

  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  await repository.delete(eventId, userId)

  res.status(200).send({
    message: 'Evento removido com sucesso!'
  })
}

exports.addGuests = async (req, res, next) => {
  debug('add guests')
  // [todo]está convertendo para UTC
  const guests = req.body.guests
  const eventId = req.params.id

  const contractErrors = await eventService.validateRequiredValue(guests, 'Convidados são obrigatórios.')
  if (contractErrors.length > 0) {
    // res.status(400).send(contractErrors)
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  debug(guests)
  const userId = await userService.getUserIdFromToken(req.headers.authorization)
  debug(userId)

  // [todo] control repeated ids
  if (guests.includes(userId)) {
    const idx = guests.indexOf(userId)
    guests.splice(idx, 1)
  }

  debug('here: ' + guests)

  const guestsToAdd = guests.map(guest => {
    return {
      user: guest,
      status: 'pending'
    }
  })

  debug(guestsToAdd)

  await repository.addGuests(eventId, userId, guestsToAdd)

  res.status(200).send({
    message: 'Evento atualizado com sucesso!'
  })
}

exports.answerInvite = async (req, res, next) => {
  debug('answer invite')
  // [todo]está convertendo para UTC
  const answer = req.body.answer
  const eventId = req.params.id

  const contractErrors = await eventService.validateRequiredValue(answer, 'Resposta é obrigatória.')
  if (contractErrors.length > 0) {
    // res.status(400).send(contractErrors)
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  debug(answer)
  const allowedAnswers = ['confirmed', 'refused']
  if (!allowedAnswers.includes(answer)) {
    const err = new CustomError('Resposta inválida.', {
      status: 400
    })
    return next(err)
  } else {
    debug('HEY')
  }

  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  const eventToAnswer = await repository.getEventByIdAndGuest(eventId, userId)

  debug(eventToAnswer)

  if (await eventService.willUpdatedEventOverlap(userId, eventId, eventToAnswer)) {
    const err = new CustomError('Evento irá se sobrepor com outros!', { status: 400 })
    return next(err)
  }

  // await repository.updateGuestStatus(eventId, userId, answer)

  res.status(200).send({
    message: 'Resposta atualizada com sucesso!'
  })
}
