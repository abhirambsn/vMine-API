const mongoose = require('mongoose')
const { v4: genUUID } = require('uuid')

const schema = mongoose.Schema({
    _id: { type: String, default: genUUID },
    originUser: { type: String, ref: 'User', required: true },
    recepientUser: { type: String, ref: 'User', required: true },
})