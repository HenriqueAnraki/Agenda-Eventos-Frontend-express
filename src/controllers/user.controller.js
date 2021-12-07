'use-strict'

const repository = require('../repositories/user.repository')
const CustomError = require('../classes/customError')
const userService = require('../services/user.service')
const authService = require('../services/auth.service')
const { HTTP_ERROR } = require('../enums/httpErrors')
const userValidator = require('../validators/user.validator')

const debug = require('debug')('server')

exports.createUser = async (req, res, next) => {
  debug('Create user')
  const body = req.body

  const contractErrors = await userValidator.validateEmailAndPassword(body)
  if (contractErrors) {
    return next(contractErrors)
  }

  if (!(await userService.isEmailRegistered(body.email))) {
    await repository.create({
      email: body.email,
      password: await userService.hashPassword(body.password)
    })

    res.status(HTTP_ERROR.CREATED).send({
      message: 'Cliente cadastrado com sucesso!'
    })
  } else {
    const err = new CustomError('Email ja cadastrado!', { status: HTTP_ERROR.BAD_REQUEST })
    return next(err)
  }
}

exports.login = async (req, res, next) => {
  debug('Login')
  const body = req.body

  const contractErrors = await userValidator.validateEmailAndPassword(body)
  if (contractErrors) {
    return next(contractErrors)
  }

  const userData = await repository.findByEmail(body.email)

  if (userData && await userService.isCorrectPassword(body.password, userData.password)) {
    const token = await authService.generateToken({
      id: userData._id,
      email: userData.email
    })

    res.status(HTTP_ERROR.OK).send({
      token
    })
    return
  }

  const err = new CustomError('Email ou senha inválidos!', { status: HTTP_ERROR.UNAUTHORIZED })
  next(err)
}

exports.getUserIdByEmail = async (req, res, next) => {
  debug('get user by emails')
  const email = req.params.email

  console.log('AQUIIIIIII')

  const contractErrors = await userValidator.validateEmail(email)
  if (contractErrors) {
    return next(contractErrors)
  }

  const data = await repository.findByEmail(email)

  if (!data) {
    const err = new CustomError('Email não encontrado.', {
      status: HTTP_ERROR.BAD_REQUEST
    })
    return next(err)
  }

  res.status(HTTP_ERROR.OK).send({
    _id: data._id,
    email: data.email
  })
}

// GRAPHQL
exports.getUserIdByEmailGql = async (email) => {
  debug('get user by emails')
  // const email = req.params.email
  const contractErrors = await userValidator.validateEmail(email)
  if (contractErrors) {
    // return next(contractErrors)
    // throw new Error('Dados enviados possuem erro!')
    throw contractErrors
  }

  const data = await repository.findByEmail(email)

  if (!data) {
    const err = new CustomError('Email não encontrado.', {
      status: HTTP_ERROR.BAD_REQUEST
    })
    // const err = new Error('Email não encontrado.')
    // return next(err)
    throw err
  }

  return ({
    _id: data._id,
    email: data.email
  })
}

exports.loginGql = async (body) => {
  debug('Login')
  // const body = req.body

  const contractErrors = await userValidator.validateEmailAndPassword(body)
  if (contractErrors) {
    // return next(contractErrors)
    throw contractErrors
  }

  const userData = await repository.findByEmail(body.email)

  if (userData && await userService.isCorrectPassword(body.password, userData.password)) {
    const token = await authService.generateToken({
      id: userData._id,
      email: userData.email
    })

    // res.status(HTTP_ERROR.OK).send({
    //   token
    // })
    // return
    return { token }
  }

  const err = new CustomError('Email ou senha inválidos!', { status: HTTP_ERROR.UNAUTHORIZED })
  // next(err)
  throw err
}

exports.createUserGql = async (body) => {
  debug('Create user')
  // const body = req.body

  const contractErrors = await userValidator.validateEmailAndPassword(body)
  if (contractErrors) {
    // return next(contractErrors)
    throw contractErrors
  }

  if (!(await userService.isEmailRegistered(body.email))) {
    await repository.create({
      email: body.email,
      password: await userService.hashPassword(body.password)
    })

    // res.status(HTTP_ERROR.CREATED).send({
    //   message: 'Cliente cadastrado com sucesso!'
    // })
    return ({ message: 'Cliente cadastrado com sucesso!' })
  } else {
    const err = new CustomError('Email ja cadastrado!', { status: HTTP_ERROR.BAD_REQUEST })
    // return next(err)
    throw err
  }
}
