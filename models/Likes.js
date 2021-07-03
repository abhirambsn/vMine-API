const mongoose = require('mongoose')
const { v4:genUUID } = require('uuid')

const schema = mongoose.Schema({
    _id: { type: String, default: genUUID },
    post: { type: String, ref: 'Post', required: true },
    user: { type: Array, ref: 'User', required: true },
    count: { type: Number, default: 0 }
})

module.exports = mongoose.model('Likes', schema)