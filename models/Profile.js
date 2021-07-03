const mongoose = require('mongoose')
const { v4:genUUID } = require('uuid')

const schema = mongoose.Schema({
    _id: { type: String, default: genUUID },
    user: { type: String, ref: 'User', required: true },
    name: { type: String, required: true },
    profilePic: { type: String, required: true },
    bio: { type: String, required: true },
    savedPosts: { type: Array, ref: 'Post', default: [] },
    followers: { type: Array, ref: 'Profile', default: [] }
})

module.exports = mongoose.model('Profile', schema)