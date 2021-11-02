// http://expressjs.com/en/guide/error-handling.html

// So when you add a custom error handler, you must delegate to the default Express error handler, when the headers have already been sent to the client:

/*
Resumo:
-error handlers no express precisam ser definidos/chamados após todos os demais middlewares (pois são tratados no final)
-podemos ter diversos errors handlres, cada um cuidando de algo
    ->mas para isso, devemos usar next(err) para chamarmos o proximo handler, ou o erro não será tratado de erro
    -> o ultimo error handler para um erro deve ser responsavel por finalizar o request, enviando a resposta
-podemos usar next(err) para passar o erro para o proximo error handler
-podemos usar next('route') para pular direto para o proximo route handler
    ->pq isso esta na parte de erros?
*/

const debug = require('debug')('server')

// [todo] melhorar criando tipo de erro especifico
// aplicar conehcimentos do video de erro

const errorHandler = (err, req, res, next) => {
  // delegating error handling to express
  if (res.headersSent) {
    return next(err)
  }
  debug('error Handler')
  console.error(err.stack)
  // console.log(err);

  res.status(500).send({
    message: 'Erro interno!'// err.message // 'Something broke!',
  })
}

module.exports = errorHandler
