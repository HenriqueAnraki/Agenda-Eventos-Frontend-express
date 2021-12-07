/* eslint-env jest */

const sum = require('../src/testSources/sum')

describe('Testing sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })

  test('adds 1 + 3 to equal 4 with done', (done) => {
    expect(sum(1, 3)).toBe(4)
    done()
  })

  test('SUM: throw error when input are not number', () => {
    expect(() => sum(1, 'a')).toThrowError()
  })
})
