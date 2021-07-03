// Importing Required Libraries
const fs = require('fs')

// Importing Models
const postModel = require('$models/Post')
const likeModel = require('$models/Likes')
const commentModel = require('$models/Comment')
const userModel = require('$models/User')
const profileModel = require('$models/Profile')
const requestsModel = require('$models/Requests')

// Logger
const logger = require('$logging/Logger')

const newPost = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const postData = req.body
    postData.author = user

    const pictures = req.files.pictures
    const pics = []
    const newPost = await postModel.create(postData)
    if (pictures) {
        fs.mkdir(`${process.env.UPLOAD_PATH}/posts/${newPost._id}`, (err) => {
            if (err) return res.status(500).send({ error: "Error in directory creation" })
        })
        pictures.forEach((pic) => {
            pic.mv(`${process.env.UPLOAD_PATH}/posts/${newPost._id}/` + pic.name, (err, result) => {
                if (err) {
                    logger.error(err)
                    return res.status(500).send({ error: "Error Occured in Photo Upload" })
                }
            })
            pics.push(`${process.env.UPLOAD_PATH}/posts/${newPost._id}/${pic.name}`)
        })
        newPost.pictures = pics
    }

    try {
        const savedPost = await newPost.save()
        return res.status(201).send({ message: "Post Created", post: savedPost })
    } catch (err) {
        console.error(err)
        return res.status(400).send({ error: "Bad Request!" })
    }
}

const followUser = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const userId = req.body.user
    const recepientUser = await userModel.findOne({ _id: userId }).exec()
    if (!recepientUser) return res.status(404).send({ error: "The User does not exist" })

    if (recepientUser.isPrivate) {
        const reqExists = await requestsModel.findOne({ originUser: user, recepientUser: recepientUser }).exec()
        if (reqExists) return res.status(400).send({ error: "Already Requested" })
        const request = await requestsModel.create({ originUser: user, recepientUser: recepientUser })
        request.save()
        return res.status(200).send({ message: "Private accounts cannot be followed" })
    } else {
        const profile = await profileModel.findOne({ user: recepientUser }).exec()
        if (!profile) return res.status(400).send({ error: "Profile Not Found" })

        profile.followers.push(user)
        await profile.save()

        return res.status(201).send({ message: `You are now following ${recepientUser.username}` })
    }

}

const getAllPosts = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const posts = await postModel.find({}).exec()
    if (posts === []) return res.status(404).send({ message: "No Posts Found" })

    return res.status(200).send({ posts: posts })
}


const getPost = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const id = req.params.post_id
    const post = await postModel.findOne({ _id: id }).exec()
    if (!post) return res.status(404).send({ message: "Post Not Found" })

    return res.status(200).send({ post: post })
}

const deletePost = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const id = req.params.post_id
    const post = await postModel.findOneAndDelete({ user: user, _id: id }).exec()
    if (!post) return res.status(404).send({ message: "Post Not Found" })

    return res.status(204).send({ message: "Post deleted" })
}

const likePost = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const id = req.params.post_id 

    const post = await postModel.findOne({ _id: id }).exec()
    if (!post) return res.status(404).send({ message: "Post Not Found" })

    const isNewLike = await likeModel.findOne({ post: post }).exec()
    if (isNewLike) {
        isNewLike.count += 1
        try {
            await isNewLike.save()
            return res.status(200).send({ message: "Post Liked" })
        } catch (err) {
            logger.error(err)
            return res.status(400).send({ error: err.message })
        }
    } else {
        const like = await likeModel.create({
            post: post,
            user: user,
            count: 1
        })
        try {
            await like.save()
            return res.status(200).send({ message: "Post Liked" })
        } catch(err) {
            logger.error(err)
            return res.status(400).send({ error: err.message })
        }
    }
}


const commentPost = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const id = req.params.post_id 

    const post = await postModel.findOne({ _id: id }).exec()
    if (!post) return res.status(404).send({ message: "Post Not Found" })

    const comment = req.body
    comment.author = user
    comment.post = post

    console.log(comment);
    
    const Comment = await commentModel.create(comment)

    try {
        Comment.save()
        return res.status(200).send({ message: "Commented", comment: req.body.comment }) 
    } catch (err) {
        logger.error(err)
        return res.status(400).send({ error: "Error" })
    }
}

const replyPost = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const id = req.params.post_id 

    const post = await postModel.findOne({ _id: id }).exec()
    if (!post) return res.status(404).send({ error: "Post Not Found" })

    const commentId = req.params.comment_id

    const curComment = await commentModel.findOne({ _id: commentId }).exec()
    if (!curComment) return res.status(404).send({ error: "Comment Not Found" })

    const reply = req.body
    reply.author = user
    reply.post = post
    
    try {
        curComment.replies.push(reply)
        curComment.save()
        return res.status(201).send({ message: "Reply Successful", reply: reply.comment })
    } catch (err) {
        logger.error(err)
        return res.status(400).send({ error: err.message })
    }
}

const getLikes = async (req, res) => {
    const postId = req.params.post_id

    const post = await postModel.findOne({ _id: postId }).exec()
    if (!post) return res.status(404).send({ error: "Post Not Found" })

    const likes = await likeModel.findOne({ post: post }).exec()
    if (!likes) return res.status(201).send({ likes: 0, post: post })

    return res.status(200).send({ likes: likes.count, post: post })
}

const getComments = async (req, res) => {
    const postId = req.params.post_id

    const post = await postModel.findOne({ _id: postId }).exec()
    if (!post) return res.status(404).send({ error: "Post Not Found" })

    const comments = await commentModel.findOne({ post: post }).exec()
    if (!comments) return res.status(200).send({ comments: [] })

    return res.status(200).send({ comments: comments })
}

const getReplies = async (req, res) => {
    const postId = req.params.post_id
    const commentId = req.params.comment_id

    const post = await postModel.findOne({ _id: postId }).exec()
    if (!post) return res.status(404).send({ error: "Post Not Found" })

    const comment = await commentModel.findOne({ post: post }).exec()
    if (!comment) return res.status(200).send({ comment: comment.comment, author: comment.author.name ,replies: [] })

    return res.status(200).send({ comment: comment.comment, author: comment.author.name, replies: comment.replies })

}

module.exports = {
    newPost: newPost,
    getAllPosts: getAllPosts,
    getPost: getPost,
    deletePost: deletePost,
    likePost: likePost,
    commentPost: commentPost,
    replyPost: replyPost,
    getLikes: getLikes,
    getComments: getComments,
    getReplies: getReplies,
    followUser: followUser
}