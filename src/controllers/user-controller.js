'use-strict'

const repository = require('../repositories/user-repository');
const ValidationContract = require('../validators/fluent-validator')
const CustomError = require('../classes/customError')
const debug = require('debug')('server')

<<<<<<< Updated upstream
=======

const isEmailValid = async (email) => {
  const userWithEmail = await repository.findByEmail(email);

  console.log(userWithEmail);

  if (userWithEmail) {
    return false;
  }

  return true;
}

>>>>>>> Stashed changes
exports.createUser = async (req, res, next) => {
    let contract = new ValidationContract()
    contract.isEmail(req.body.email, 'E-mail inválido.');
    contract.hasMinLen(req.body.password, 3, 'A senha deve conter pelo menos 3 caracteres.');
    
    if (!contract.isValid) {
        res.status(400).send(contract.errors());
        return;
    }

    // verify email???
    try {
<<<<<<< Updated upstream
        const data = await repository.create({
            email: req.body.email,
            password: req.body.password
        })

        res.status(201).send({
            data,
            message: 'Cliente cadastrado com sucesso!'
        })
=======
        if (await isEmailValid(body.email)) {
            console.log('é valido')

            const data = await repository.create({
                email: body.email,
                password: body.password
            })
    
            res.status(201).send({
                // data,
                message: 'Cliente cadastrado com sucesso!'
            })
        } else {
            // throw new Error('Email ja cadastrado!')
            throw new CustomError('Email ja cadastrado!', { status: 400 })
        }
        
>>>>>>> Stashed changes
    } catch (err) {
        debug('COMECOU AQUI')
        //console.log(err)
        // res.status(500).send({
        //     message: 'Falha ao processar sua requisição'
        // });
        next(err)
    }

}