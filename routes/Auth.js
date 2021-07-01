const express = require('express')
const router = express.Router()

const authController = require('$controllers/Auth')

// Auth Middleware
const authMiddleware = require('$middlewares/Auth') 


// GET Routes
router.get('/profile', authMiddleware, authController.profile)
router.get('/profile/:username', authMiddleware, authController.profile)
router.get('/verify/:token', authController.verify)

// POST Routes
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/changePassword', authMiddleware, authController.changePassword)

// DELETE Routes
router.delete('/delete', authMiddleware, authController.deleteAccount)


module.exports = router
