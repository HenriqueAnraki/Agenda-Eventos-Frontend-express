// https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware/51391081#51391081

/**
 * Wrapper responsible to catch async errors, and prevent our app to break.
 * Intended use as a Route Wraper.
 */

const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next)
}

module.exports = asyncHandler
