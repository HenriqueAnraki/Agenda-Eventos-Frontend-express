/**
 * Generic error handler
 */
const { HTTP_ERROR } = require('../enums/httpErrors')
const debug = require('debug')('server')

const errorHandler = (err, req, res, next) => {
  // delegating error handling to express
  if (res.headersSent) {
    return next(err)
  }

  debug('error Handler')
  console.error(err.stack)

  res.status(HTTP_ERROR.INTERNAL_SERVER_ERROR).send({
    message: 'Erro interno!'
  })
}

module.exports = errorHandler
