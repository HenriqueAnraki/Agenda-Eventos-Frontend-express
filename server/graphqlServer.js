const { ApolloServer } = require('apollo-server-express')
const authService = require('../src/services/auth.service')

async function startApolloServer (typeDefs, resolvers, app) {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      const token = req.headers.authorization

      if (token) {
        req.id = authService.getUserIdFromToken(token)
      }

      return ({ req, res })
    },
    // formtError: // customErrorHandler
    plugins: [
      {
        async didEncounterErrors (something) {
          console.log('something')
        }
      }
    ]
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app })
}

exports.startApolloServer = startApolloServer

/*
Problemas:

-Tratamento de erros
  -Consigo fazer um tratamento generico?
  -Consigo colocar errors Handlers?
  Respostas:
    https://www.apollographql.com/docs/apollo-server/data/errors/
    => para custom errors, preciso "extends ApolloError"
    =>para error handler: propriedade 'formatError' no 'new ApolloServer'
      -Aparantemente só recebe o erro, modifica o que precisa, e retorna o erro para o fluxo normal
    =>podemos usar também o plugin didEncounterErrors
      ->aparentemente, didEncounterErros trata o erro ANTES do formatError
      ->outras diferenteças? não sei

-Req, res, next
  https://www.apollographql.com/docs/apollo-server/security/authentication/
  =>next não é necessário (podemos adaptar o fluxo (com invocações de funções, throw, returns) para não precisar do next)
  =>req e res podem ser passados pelo context no 'new ApolloServer'
    =>paralelamente a isso, podemos processar o que queremos no context e mandar somente o que interessa (bodu, query, params, ja fazer tratamento de auth)

-Authenticação

-Erros genericos quebram a aplicação ???
*/
