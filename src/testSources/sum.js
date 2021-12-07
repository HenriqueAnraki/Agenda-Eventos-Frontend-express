function sum (a, b) {
  // return a + b
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b
  }
  throw Error('Inputs should be numbers')
}

module.exports = sum
