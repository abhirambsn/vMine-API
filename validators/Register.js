const Joi = require('joi')

const schema = Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    bio: Joi.string().required(),
})

module.exports = schema