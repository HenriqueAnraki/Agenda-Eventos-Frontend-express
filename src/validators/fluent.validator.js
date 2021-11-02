'use strict'
const date = require('date-and-time')

let errors = []

function ValidationContract () {
  errors = []
}

ValidationContract.prototype.isRequired = (value, message) => {
  if (!value || value.length <= 0) {
    errors.push({ message: message })
  }
}

ValidationContract.prototype.hasMinLen = (value, min, message) => {
  if (!value || value.length < min) {
    errors.push({ message: message })
  }
}

ValidationContract.prototype.hasMaxLen = (value, max, message) => {
  if (!value || value.length > max) {
    errors.push({ message: message })
  }
}

ValidationContract.prototype.isFixedLen = (value, len, message) => {
  if (value.length !== len) {
    errors.push({ message: message })
  }
}

ValidationContract.prototype.isEmail = (value, message) => {
  const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!reg.test(value)) {
    errors.push({ message: message })
  }
}

ValidationContract.prototype.areValidDate = (start, end, message) => {
  if (!start || !end ||
    !(date.isValid(start, 'YYYY-MM-DD HH:mm:ss')) ||
    !(date.isValid(end, 'YYYY-MM-DD HH:mm:ss')) ||
    start >= end
  ) {
    errors.push({ message: message })
  }
}

ValidationContract.prototype.errors = () => {
  return errors
}

ValidationContract.prototype.clear = () => {
  errors = []
}

ValidationContract.prototype.isValid = () => {
  return errors.length === 0
}

module.exports = ValidationContract
