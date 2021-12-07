'use strict'

const debug = require('debug')('server')
const http = require('http')

const app = require('../src/app')

// GraphQL imports
const { startApolloServer } = require('./graphqlServer')
const typeDefs = require('../src/graphql/typeDefs')
const resolvers = require('../src/graphql/resolvers')

const port = process.env.PORT || '4000'
app.set('port', port)

const server = http.createServer(app)

// starting graphQL server
startApolloServer(typeDefs, resolvers, app)

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
server.on('error', onError)
server.on('listening', onListening)

function onError (error) {
  console.error(error)
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACESS':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      // break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      // break
    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('listening on ' + bind)
}
