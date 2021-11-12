'use-strict'

const repository = require('../repositories/user.repository')
const CustomError = require('../classes/customError')
const userService = require('../services/user.service')
const authService = require('../services/auth.service')

const debug = require('debug')('server')

exports.createUser = async (req, res, next) => {
  debug('Create user')
  const body = req.body

  const contractErrors = await userService.validateEmailAndPassword(body)
  if (contractErrors.length > 0) {
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  if (await userService.isEmailValid(body.email)) {
    await repository.create({
      email: body.email,
      password: await userService.hashPassword(body.password)
    })

    res.status(201).send({
      message: 'Cliente cadastrado com sucesso!'
    })
  } else {
    const err = new CustomError('Email ja cadastrado!', { status: 400 })
    return next(err)
  }
}

exports.login = async (req, res, next) => {
  debug('Login')
  const body = req.body

  const contractErrors = await userService.validateEmailAndPassword(body)
  if (contractErrors.length > 0) {
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  const userData = await repository.findByEmail(body.email)

  if (userData && await userService.isCorrectPassword(body.password, userData.password)) {
    const token = await authService.generateToken({
      id: userData._id,
      email: userData.email
    })

    res.status(200).send({
      token
    })
    return
  }

  const err = new CustomError('Email ou senha inválidos!', { status: 401 })
  next(err)
}

exports.getUserIdByEmail = async (req, res, next) => {
  debug('get user by emails')
  const email = req.params.email

  const contractErrors = await userService.validateEmail(email)
  if (contractErrors.length > 0) {
    const err = new CustomError('Dados enviados possuem erro.', {
      status: 400,
      errors: contractErrors
    })
    return next(err)
  }

  const data = await repository.getIdByEmail(email)

  if (!data) {
    const err = new CustomError('Email não encontrado.', {
      status: 400
    })
    return next(err)
  }
  res.status(200).send(data)
}
