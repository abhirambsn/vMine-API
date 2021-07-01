const Joi = require('joi')

const schema = Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword1: Joi.string().required(),
    newPassword2: Joi.ref('newPassword1')
})

module.exports = schema