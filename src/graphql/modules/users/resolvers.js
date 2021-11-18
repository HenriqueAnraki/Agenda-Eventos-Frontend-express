const userController = require('../../../controllers/user.controller')
const authService = require('../../../services/auth.service')

module.exports = {
  Query: {
    user: async (_, { email }, context) => {
      if (!context.id) {
        // modificar um pouco no geral
        //  => se não tem o ID só verifica o erro
        await authService.authorizeGql(context.req)
      }

      const data = await userController.getUserIdByEmailGql(email) // ({ _id: 'a', email: 'email@' }),
      console.log(data)
      return data
    },
    login: async (_, { data }) => {
      const res = await userController.loginGql(data)
      console.log(res)

      return res
    }
  },
  Mutation: {
    createUser: async (_, { data }) => {
      const res = await userController.createUserGql(data)

      console.log(res)

      return res
    }
  }
}
