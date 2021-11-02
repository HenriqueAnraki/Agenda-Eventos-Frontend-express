'use-strict'

const repository = require('../repositories/user-repository')
// const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')
const userService = require('../services/user-service')

const debug = require('debug')('server')

exports.createUser = async (req, res, next) => {
  debug('Create user')
  const body = req.body

  const contractErrors = await userService.validateEmailAndPassword(body)
  if (contractErrors.length > 0) {
    res.status(400).send(contractErrors)
    return
  }

  try {
    if (await userService.isEmailValid(body.email)) {
      console.log('é valido')

      // const data =
      await repository.create({
        email: body.email,
        password: await userService.hashPassword(body.password)
      })

      res.status(201).send({
        message: 'Cliente cadastrado com sucesso!'
      })
    } else {
      // throw new Error('Email ja cadastrado!')
      throw new CustomError('Email ja cadastrado!', { status: 400 })
    }
  } catch (err) {
    debug('COMECOU AQUI')
    // console.log(err)
    // res.status(500).send({
    //     message: 'Falha ao processar sua requisição'
    // });
    next(err)
  }
}

exports.login = async (req, res, next) => {
/**
 * verify correct email/pass
 * generate token
 * return token
 */
  debug('Login')
  const body = req.body

  const contractErrors = await userService.validateEmailAndPassword(body)
  if (contractErrors.length > 0) {
    res.status(400).send(contractErrors)
    return
  }

  const userData = await repository.findByEmail(body.email)

  try {
    if (await userService.isCorrectPassword(body.password, userData.password)) {
      const token = await userService.generateToken({
        id: userData._id
      })

      res.status(200).send({
        token
      })
      return
    }

    // res.status(401).send('Email ou senha inválidos!')
    throw new CustomError('Email ou senha inválidos!', { status: 401 })
  } catch (err) {
    next(err)
  }
}
