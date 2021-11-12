'use-strict'

const repository = require('../repositories/event.repository')
// const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')
const userService = require('../services/user.service')
const eventService = require('../services/event.service')

const { allowedAnswers } = require('../config')

const debug = require('debug')('server')

exports.createNewEvent = async (req, res, next) => {
  // [todo]está convertendo para UTC
  const body = req.body

  const contractErrors = await eventService.validateEventData(body)
  if (contractErrors.length > 0) {
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

/**
 * Get user events, including pending and confirmed invites
 */
exports.getUserEvents = async (req, res, next) => {
  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  const userEvents = await repository.getByOwner(userId)

  res.status(200).send(userEvents)
}

exports.getUserEventById = async (req, res, next) => {
  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  const userEvent = await repository.getById(req.params.id, userId)

  res.status(200).send(userEvent)
}

// [todo] falar quando o usuario tenta editar um evento que não é seu?
exports.updateEvent = async (req, res, next) => {
  debug('update event')
  // [todo]está convertendo para UTC
  const body = req.body
  const eventId = req.params.id

  const contractErrors = await eventService.validateEventData(body)
  if (contractErrors.length > 0) {
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
  const eventId = req.params.id

  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  await repository.delete(eventId, userId)

  res.status(200).send({
    message: 'Evento removido com sucesso!'
  })
}

exports.setGuests = async (req, res, next) => {
  debug('add guests')
  const guestsIds = req.body.guests
  const eventId = req.params.id

  const contractErrors = await eventService.validateRequiredValue(guestsIds, 'Convidados são obrigatórios.')
  if (contractErrors.length > 0) {
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  // [todo] control repeated ids
  // Removing user own id
  if (guestsIds.includes(userId)) {
    const idx = guestsIds.indexOf(userId)
    guestsIds.splice(idx, 1)
  }

  // Convert the id array (guests) to event.guests format
  const guestsToAdd = guestsIds.map(guestId => {
    return {
      user: guestId,
      status: 'pending'
    }
  })

  await repository.setGuests(eventId, userId, guestsToAdd)

  res.status(200).send({
    message: 'Evento atualizado com sucesso!'
  })
}

exports.answerInvite = async (req, res, next) => {
  debug('answer invite')
  const answer = req.body.answer
  const eventId = req.params.id

  const contractErrors = await eventService.validateRequiredValue(answer, 'Resposta é obrigatória.')
  if (contractErrors.length > 0) {
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  // Verifing if the answer is valid
  if (!allowedAnswers.includes(answer)) {
    const err = new CustomError('Resposta inválida.', {
      status: 400
    })
    return next(err)
  }

  const userId = await userService.getUserIdFromToken(req.headers.authorization)

  const eventToAnswer = await repository.getEventByIdAndGuestId(eventId, userId)

  debug(eventToAnswer)

  if (await eventService.willUpdatedEventOverlap(userId, eventId, eventToAnswer)) {
    const err = new CustomError('Evento irá se sobrepor com outros!', { status: 400 })
    return next(err)
  }

  await repository.updateGuestStatus(eventId, userId, answer)

  res.status(200).send({
    message: 'Resposta atualizada com sucesso!'
  })
}
