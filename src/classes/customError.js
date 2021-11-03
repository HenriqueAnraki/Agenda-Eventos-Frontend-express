class CustomError extends Error {
  constructor (message, options) {
    super(message)
    this.options = options
    this.name = 'CustomError'
  }
}

module.exports = CustomError
