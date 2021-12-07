const mongoose = require('mongoose')
const config = require('./config')

module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise
    // mongoose.connect(config.database[process.env.NODE_ENV])
    mongoose.connect(config.connectionString)
  },
  disconnect: done => {
    mongoose.disconnect(done)
  }
}
