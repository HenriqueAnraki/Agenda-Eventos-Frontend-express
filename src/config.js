const answersEnum = Object.freeze({
  POSITIVE: 'confirmed',
  NEGATIVE: 'refused'
})

module.exports = {
  connectionString: process.env.CONNECTION_STRING,
  tokenConfig: {
    secret: process.env.TOKEN_SECRET,
    duration: process.env.TOKEN_DURATION
  },
  answersEnum,
  allowedAnswers: [answersEnum.POSITIVE, answersEnum.NEGATIVE]
}
