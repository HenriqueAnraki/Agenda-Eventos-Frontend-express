const CustomError = require('../classes/customError')

const debug = require('debug')('server')

const customErrorHandler = (err, req, res, next) => {
  // delegating error handling to express
  if (res.headersSent) {
    return next(err)
  }

  debug('custom Error Handler')

  if (err instanceof CustomError) {
    console.error(err.stack)

    const status = err.options?.status || 500

    delete err.options?.status

    res.status(status).send({
      message: err.message, // 'Something broke!',
      error: err
    })
  }
  next(err)
}

module.exports = customErrorHandler
