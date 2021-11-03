/**
 * Generic error handler
 */

const debug = require('debug')('server')

const errorHandler = (err, req, res, next) => {
  // delegating error handling to express
  if (res.headersSent) {
    return next(err)
  }

  debug('error Handler')
  console.error(err.stack)

  res.status(500).send({
    message: 'Erro interno!'
  })
}

module.exports = errorHandler
