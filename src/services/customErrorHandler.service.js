/**
 * Handle only CustomError type of errors
 */

const CustomError = require('../classes/customError')
const { HTTP_ERROR } = require('../enums/httpErrors')

const debug = require('debug')('server')

const customErrorHandler = (err, req, res, next) => {
  // delegating error handling to express
  if (res.headersSent) {
    return next(err)
  }

  debug('custom Error Handler')

  if (err instanceof CustomError) {
    console.error(err.stack)

    const status = err.options?.status || HTTP_ERROR.INTERNAL_SERVER_ERROR

    delete err.options?.status

    res.status(status).send({
      message: err.message || 'Erro interno!',
      options: err.options
    })
    return
  }
  next(err)
}

module.exports = customErrorHandler
