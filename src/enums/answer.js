const answersEnum = Object.freeze({
  POSITIVE: 'confirmed',
  NEGATIVE: 'refused'
})

module.exports = {
  ANSWERS: answersEnum,
  allowedAnswers: [answersEnum.POSITIVE, answersEnum.NEGATIVE]
}
