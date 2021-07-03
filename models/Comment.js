const mongoose = require('mongoose')
const { v4:genUUID } = require('uuid')

const schema = mongoose.Schema({
    _id: { type: String, default: genUUID },
    post: { type: String, ref: 'Post', required: true },
    comment: { type: String, required: true },
    author: { type: String, ref: 'User', required: true },
    replies: { type: Array, ref: 'Comment', default: [] } // Array Foreign Referencec to Self
})

module.exports = mongoose.model('Comment', schema)