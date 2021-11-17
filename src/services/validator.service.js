const CustomError = require('../classes/customError')
const { HTTP_ERROR } = require('../enums/httpErrors')

exports.handleValidatorsErrors = async (errors) => {
  if (errors.length > 0) {
    const err = new CustomError('Dados enviados possuem erro.', {
      status: HTTP_ERROR.BAD_REQUEST,
      errors
    })
    return err
  }

  return null
}
