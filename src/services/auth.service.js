/**
 * Auth functions
 */

const jwt = require('jsonwebtoken')
const CustomError = require('../classes/customError')
const CustomApolloError = require('../classes/customApolloError')
const { tokenConfig } = require('../config')
const { HTTP_ERROR } = require('../enums/httpErrors')

exports.generateToken = async (data) => {
  return jwt.sign(data, tokenConfig.secret, { expiresIn: tokenConfig.duration })
}

const decodeToken = (token) => {
  return jwt.verify(token, tokenConfig.secret)
}

exports.decodeToken = decodeToken

exports.authorize = async (req, res, next) => {
  let token = req.headers.authorization

  if (!token) {
    const err = new CustomError('Acesso Restrito.', { status: HTTP_ERROR.UNAUTHORIZED })
    return next(err)
  }

  // Removing 'Bearer '
  token = token.split(' ')[1]

  try {
    jwt.verify(token, tokenConfig.secret)
  } catch (err) {
    const newErr = new CustomError('Sessão expirada!', { status: HTTP_ERROR.UNAUTHORIZED })
    return next(newErr)
  }

  next()
}

exports.getUserIdFromToken = (fullToken) => {
  // Removing 'Bearer '
  const token = fullToken.split(' ')[1]
  const userData = decodeToken(token)

  return userData.id
}

exports.authorizeGql = async (req) => {
  let token = req.headers.authorization

  if (!token) {
    // const err = new CustomError('Acesso Restrito.', { status: HTTP_ERROR.UNAUTHORIZED })
    const err = new CustomApolloError('Acesso Restrito.', { status: HTTP_ERROR.UNAUTHORIZED })
    // return next(err)
    throw err
  }

  // Removing 'Bearer '
  token = token.split(' ')[1]

  try {
    jwt.verify(token, tokenConfig.secret)
  } catch (err) {
    // const newErr = new CustomError('Sessão expirada!', { status: HTTP_ERROR.UNAUTHORIZED })
    const newErr = new CustomApolloError('Sessão expirada!', { status: HTTP_ERROR.UNAUTHORIZED })
    // return next(newErr)
    throw newErr
  }
}
