const { ApolloError } = require('apollo-server-express')

class CustomApolloError extends ApolloError {
  constructor (message, options) {
    super(message)
    this.options = options
    this.name = 'CustomApolloError'
  }
}

module.exports = CustomApolloError
