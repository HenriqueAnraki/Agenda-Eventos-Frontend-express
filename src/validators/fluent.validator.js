/**
 * Collection of validations methods
 */

'use strict'
const moment = require('moment')

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

// validate a start and an end date
ValidationContract.prototype.areValidDate = (start, end, message) => {
  if (!start || !end ||
    !moment(start, moment.ISO_8601).isValid() ||
    !moment(end, moment.ISO_8601).isValid() ||
    start >= end
  ) {
    errors.push({ message: message })
  }
}

ValidationContract.prototype.dontHaveRepeatedGuests = (currentGuests, guestsIdsToBeInvited, message) => {
  for (let i = 0; i < currentGuests.length; i++) {
    const currentGuestId = currentGuests[i].user._id.toString()

    if (guestsIdsToBeInvited.includes(currentGuestId)) {
      errors.push({ message: message })
      break
    }
  }
}

ValidationContract.prototype.dontInviteYourself = (guestsIdsToBeInvited, userId, message) => {
  if (guestsIdsToBeInvited.includes(userId)) {
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
