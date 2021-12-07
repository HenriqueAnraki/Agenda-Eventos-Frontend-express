const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('../../src/models/user.model')
const Event = require('../../src/models/event.model')

const insertUserSeeds = async (usersSeeds, usersList) => {
  for (const seed of usersSeeds) {
    // console.log(seed)
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(seed.value.password, salt)

    const createdUser = await User.create({
      email: seed.value.email,
      password: hash
    })

    usersList[seed.key].id = createdUser._id
  }
}

const insertEventSeeds = async (seeds, list, userId) => {
  for (const seed of seeds) {
    // console.log(seed)

    const createdSeed = await Event.create({
      ...seed.value,
      owner: userId
    })

    list[seed.key].id = createdSeed._id
  }
}

module.exports = {
  insertUserSeeds,
  insertEventSeeds
}
