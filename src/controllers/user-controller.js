'use-strict'

const repository = require('../repositories/user-repository');
const ValidationContract = require('../validators/fluent-validator')
const debug = require('debug')('server')

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
        const data = await repository.create({
            email: req.body.email,
            password: req.body.password
        })

        res.status(201).send({
            data,
            message: 'Cliente cadastrado com sucesso!'
        })
    } catch (err) {
        debug('COMECOU AQUI')
        //console.log(err)
        // res.status(500).send({
        //     message: 'Falha ao processar sua requisição'
        // });
        next(err)
    }

}