const express = require('express')
const router = express.Router()

const postController = require('$controllers/Post')

// Auth Middleware
const authMiddleware = require('$middlewares/Auth')

// GET Routes
router.get('/', authMiddleware, postController.getAllPosts)
router.get('/:post_id', authMiddleware, postController.getPost)
router.get('/:post_id/like', authMiddleware, postController.likePost)
router.get('/:post_id/noLikes', authMiddleware, postController.getLikes)
router.get('/:post_id/:comment_id/', authMiddleware, postController.getComments)
router.get('/:post_id/:comment_id/reply', authMiddleware, postController.getReplies)

// POST Routes
router.post('/:post_id/comment', authMiddleware, postController.commentPost)
router.post('/:post_id/:comment_id/reply', authMiddleware, postController.replyPost)
router.post('/follow', authMiddleware, postController.followUser)
router.post('/', authMiddleware, postController.newPost)

// DELETE Routes
router.delete('/:post_id', authMiddleware, postController.deletePost)

module.exports = router