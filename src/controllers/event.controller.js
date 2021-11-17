'use-strict'

const repository = require('../repositories/event.repository')
// const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')
const eventService = require('../services/event.service')
const eventValidator = require('../validators/event.validator')

const { allowedAnswers, ANSWERS } = require('../enums/answer')
const { HTTP_ERROR } = require('../enums/httpErrors')

const debug = require('debug')('server')

exports.createNewEvent = async (req, res, next) => {
  const body = req.body

  const contractErrors = await eventValidator.validateEventData(body)
  if (contractErrors) {
    return next(contractErrors)
  }

  // const userId = await userService.getUserIdFromToken(req.headers.authorization)
  const userId = req.id

  if (await eventService.hasEventOverlap(userId, body)) {
    const err = new CustomError('Evento se sobrepoem com outros!', { status: HTTP_ERROR.BAD_REQUEST })
    return next(err)
  }

  await repository.createNewEvent({
    start: body.start,
    end: body.end,
    description: body.description,
    owner: userId
  })

  res.status(HTTP_ERROR.CREATED).send({
    message: 'Evento criado com sucesso!'
  })
}

/**
 * Get user events, including pending and confirmed invites
 */
exports.getUserEvents = async (req, res, next) => {
  const userId = req.id

  const userEvents = await repository.getByOwner(userId)

  res.status(HTTP_ERROR.OK).send(userEvents)
}

exports.getUserEventById = async (req, res, next) => {
  const userId = req.id

  const userEvent = await repository.getById(req.params.id, userId)

  res.status(HTTP_ERROR.OK).send(userEvent)
}

exports.updateEvent = async (req, res, next) => {
  debug('update event')
  const body = req.body
  const eventId = req.params.id

  const contractErrors = await eventValidator.validateEventData(body)
  if (contractErrors) {
    return next(contractErrors)
  }

  const userId = req.id

  if (await eventService.willUpdatedEventOverlap(userId, eventId, body)) {
    const err = new CustomError('Evento irá se sobrepor com outros!', { status: HTTP_ERROR.BAD_REQUEST })
    return next(err)
  }

  await repository.update(eventId, {
    start: body.start,
    end: body.end,
    description: body.description,
    owner: userId
  })

  res.status(HTTP_ERROR.OK).send({
    message: 'Evento atualizado com sucesso!'
  })
}

exports.deleteEvent = async (req, res, next) => {
  debug('remove event')
  const eventId = req.params.id

  const userId = req.id

  await repository.delete(eventId, userId)

  res.status(HTTP_ERROR.OK).send({
    message: 'Evento removido com sucesso!'
  })
}

exports.addGuests = async (req, res, next) => {
  debug('add guests')
  const guestsIds = req.body.guests
  const eventId = req.params.id
  const userId = req.id

  const contractErrors = await eventValidator.validateGuestsIds(guestsIds, eventId, userId)
  if (contractErrors) {
    return next(contractErrors)
  }

  // Convert the id array (guests) to event.guests format
  const guestsToAdd = guestsIds.map(guestId => {
    return {
      user: guestId,
      status: 'pending'
    }
  })

  await repository.addGuests(eventId, userId, guestsToAdd)

  res.status(HTTP_ERROR.OK).send({
    message: 'Evento atualizado com sucesso!'
  })
}

exports.answerInvite = async (req, res, next) => {
  debug('answer invite')

  const answer = req.body.answer
  const eventId = req.params.id

  const contractErrors = await eventValidator.validateRequiredValue(answer, 'Resposta é obrigatória.')
  if (contractErrors) {
    return next(contractErrors)
  }

  // Verifing if the answer is valid
  if (!allowedAnswers.includes(answer)) {
    const err = new CustomError('Resposta inválida.', {
      status: HTTP_ERROR.BAD_REQUEST
    })
    return next(err)
  }

  const userId = req.id

  const eventToAnswer = await repository.getEventByIdAndGuestId(eventId, userId)

  debug(eventToAnswer)

  // If refusing, don't verify overlap
  if (answer === ANSWERS.POSITIVE && await eventService.willUpdatedEventOverlap(userId, eventId, eventToAnswer)) {
    const err = new CustomError('Evento irá se sobrepor com outros!', { status: HTTP_ERROR.BAD_REQUEST })
    return next(err)
  }

  await repository.updateGuestStatus(eventId, userId, answer)

  res.status(HTTP_ERROR.OK).send({
    message: 'Resposta atualizada com sucesso!'
  })
}
