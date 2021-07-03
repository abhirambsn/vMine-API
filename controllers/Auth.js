// Import Required Packages
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const binascii = require('binascii')
const fs = require('fs')
const path = require('path')

// Models
const userModel = require('$models/User')
const profileModel = require('$models/Profile')
const likeModel = require('$models/Likes')
const commentModel = require('$models/Comment')

// Validators
const loginValidator = require('$validators/Login')
const registerValidator = require('$validators/Register')
const changePasswordValidator = require('$validators/ChangePassword')
const deleteAccountValidator = require('$validators/DeleteAccount')

// Logger
const logger = require('$logging/Logger')

const login = async (req, res) => {
    const data = req.body

    const { error } = loginValidator.validate(data)
    if (error) return res.status(400).send({ error: error.details[0].message })

    const user = await userModel.findOne({ username: data.username }).exec()
    if (!user) return res.status(404).send({ error: "User Not Found" })

    const cmp = await bcrypt.compare(data.password, user.password)
    if (!cmp) return res.status(403).send({ error: "Password Mismatch" })

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET) // { expiresIn: process.env.JWT_EXPIRES_IN } add later

    return res.header('Authorization', token).send({ status: "Login Successful", token: token })
}

const register = async (req, res) => {
    var data = req.body

    const { error } = registerValidator.validate(data)
    if (error) return res.status(400).send({ error: error.details[0].message })

    const existingUserChk = await userModel.findOne({ username: data.username }).exec()
    if (existingUserChk) return res.status(400).send({ error: "User exists" })

    const salt = await bcrypt.genSalt(10)
    data.password = await bcrypt.hash(data.password, salt)

    const userData = {
        username: data.username,
        password: data.password,
        email: data.email
    }

    const user = new userModel(userData)
    try {
        const savedUser = await user.save()
        const profilePic = req.files.profilePic

        profilePic.mv(`${process.env.UPLOAD_PATH}/${profilePic.name}`, (err, result) => {
            if (err) {
                logger.error(err)
                return res.status(500).send({ error: "Error Occured in Photo Upload" })
            }
        })
        const profileData = {
            user: savedUser,
            name: data.name,
            profilePic: `${process.env.UPLOAD_PATH}/${profilePic.name}`,
            bio: data.bio
        }

        const newProfile = new profileModel(profileData)
        const savedProfile = await newProfile.save()

        const mailer = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
                type: 'OAuth2',
                clientId: process.env.G_CLIENT_ID,
                clientSecret: process.env.G_CLIENT_SECRET,
                refreshToken: process.env.G_REFRESH_TOKEN,
                user: process.env.G_EMAIL
            }
        })
        const vToken = binascii.hexlify(user._id)
        const mail = {
            from: process.env.G_EMAIL,
            to: user.email,
            subject: "Verification of your vMine Account",
            html: `<b>Dear ${profileData.name}</b>,<br/><h1>Welcome to vMine</h1><br/>We are glad to have you here inorder to continue please click on the verify button below<br/><a href='http://${req.headers.host}/api/auth/verify/${vToken}'>Verify Your Account</a>`
        }
        mailer.sendMail(mail, async (err, info) => {
            if (err) {
                await userModel.findOneAndDelete({ _id: user._id }).exec()
                await profileModel.findOneAndDelete({ user: user._id }).exec()
                logger.error(err)
                return res.status(500).send({ error: "Mailing Error, please try again" })
            } else {
                var log_data = { ...info, finalResult: `Email Sent to: ${user.email}` }
                logger.info(log_data)
                return res.status(201).send({ message: "Registration Successful", profile: { ...savedProfile._doc } })
            }
        })
    } catch (err) {
        logger.error(err)
        return res.status(400).send({ error: err })
    }
}

const changePassword = async (req, res) => {
    var data = req.body

    const { error } = changePasswordValidator.validate(data)
    if (error) return res.status(400).send({ error: error.details[0].message })

    const user = await userModel.findOneAndUpdate({ _id: req.user }, { password: data.newPassword1 }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    return res.status(200).send({ message: "Password Updated" })
}

const deleteAccount = async (req, res) => {
    const data = { ...req.user, ...req.body }

    const { error } = deleteAccountValidator.validate(req.body)
    if (error) return res.status(400).send({ error: error.details[0].message })

    const user = await userModel.findByIdAndDelete(data).exec()
    if (!user) return res.status(404).send({ error: "User not Found" })

    const profile = await profileModel.findByIdAndDelete({ user: req.user }).exec()
    if (!profile) return res.status(404).send({ error: "Profile Not Found" })

    const posts = await likeModel.findOneAndDelete({ author: user }).exec()
    const comments = await commentModel.findOneAndDelete({ author: user }).exec()


    return res.status(200).send({ message: "Account Deletion Successful" })
}


const profile = async (req, res) => {
    var user = undefined
    if (req.params.username) {
        user = await userModel.findOne({ username: req.params.username }, { password: 0 }).exec()
    } else {
        user = await userModel.findOne({ _id: req.user }, { password: 0 }).exec()
    }

    if (!user) return res.status(404).send({ error: "User not Found" })

    const profile = await profileModel.findOne({ user: user }).exec()
    if (!profile) return res.status(404).send({error: "Profile not Found"})

    return res.status(200).send({ profile: { ...profile._doc } })
}

const verify = async (req, res) => {
    const vToken = req.params.token
    const id = binascii.unhexlify(vToken)

    const user = await userModel.findByIdAndUpdate(id, {isVerified: true}).exec()
    if (!user) return res.status(404).send({error: "Verification Failed"})

    return res.status(200).send({message: "Account Verified"})
}

module.exports = {
    login: login,
    register: register,
    changePassword: changePassword,
    deleteAccount: deleteAccount,
    profile: profile,
    verify: verify
}