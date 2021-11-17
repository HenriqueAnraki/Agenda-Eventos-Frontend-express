/**
 * Auth functions
 */

const jwt = require('jsonwebtoken')
const CustomError = require('../classes/customError')
const { tokenConfig } = require('../config')
const { HTTP_ERROR } = require('../enums/httpErrors')

exports.generateToken = async (data) => {
  return jwt.sign(data, tokenConfig.secret, { expiresIn: tokenConfig.duration })
}

exports.decodeToken = async (token) => {
  return jwt.verify(token, tokenConfig.secret)
}

exports.authorize = async (req, res, next) => {
  let token = req.headers.authorization

  if (!token) {
    const err = new CustomError('Acesso Restrito.', { status: HTTP_ERROR.UNAUTHORIZED })
    return next(err)
  }

  // Removing 'Bearer '
  token = token.split(' ')[1]

  try {
    await jwt.verify(token, tokenConfig.secret)
  } catch (err) {
    const newErr = new CustomError('Sessão expirada!', { status: HTTP_ERROR.UNAUTHORIZED })
    return next(newErr)
  }

  next()
}
