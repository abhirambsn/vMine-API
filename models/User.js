const mongoose = require('mongoose')
const { v4:genUUID } = require('uuid')

const schema = mongoose.Schema({
    _id: { type: String, default: genUUID },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', schema)