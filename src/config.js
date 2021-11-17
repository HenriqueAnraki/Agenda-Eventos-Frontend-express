module.exports = {
  connectionString: process.env.CONNECTION_STRING,
  tokenConfig: {
    secret: process.env.TOKEN_SECRET,
    duration: process.env.TOKEN_DURATION
  }
}
