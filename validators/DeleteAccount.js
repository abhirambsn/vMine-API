const Joi = require('joi')

const schema = Joi.object().keys({
    password: Joi.string().required()
})

module.exports = schema