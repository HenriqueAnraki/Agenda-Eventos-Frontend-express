const usersList = {
  toCreate: {
    password: '123',
    email: 'user3@email.com'
  },
  toLogin: {
    password: '123',
    email: 'userTest@email.com'
  },
  wrongPassword: {
    password: '1233',
    email: 'userTest@email.com'
  },
  wrongEmail: {
    password: '1233',
    email: 'userTest1@email.com'
  },
  withoutPassword: {
    email: 'userTest@email.com'
  },
  withoutEmail: {
    password: '123'
  },
  toInvite: {
    password: '123',
    email: 'userToBeInvated@email.com'
  }
}

const usersSeeds = [
  {
    key: 'toLogin',
    value: usersList.toLogin
  },
  {
    key: 'toInvite',
    value: usersList.toInvite
  }
]

module.exports = {
  usersList,
  usersSeeds
}
