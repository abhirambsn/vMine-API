const mongoose = require('mongoose')
const { v4:genUUID } = require('uuid')

const schema = mongoose.Schema({
    _id: { type: String, default: genUUID },
    caption: { type: String, required: true },
    pictures: { type: Array, default: [] },
    title: { type: String, required: false },
    content: { type: String, required: true },
    author: { type: String, ref: 'User' }
})

module.exports = mongoose.model('Post', schema)