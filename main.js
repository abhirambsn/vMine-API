require('better-module-alias')(__dirname) // Register Module Aliases
require('dotenv').config() // Load Environment Variables from the .env file

const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const app = express() // Initializing the express app

app.use(express.urlencoded({ extended: false })) // Add URL Encoding support tot the express app
app.use(express.json()) // Add Json request support to the express app
app.use(fileUpload()) // Add File upload support to the express app

// Routes
const authRoutes = require('$routes/Auth')
const postRoutes = require('$routes/Posts')


app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

// Server Config
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (error) => {
    if (error) return console.error(error)
    console.log("Database Connection successful")
    app.listen(PORT, () => {
        console.log(`Server Running on Port ${PORT}`)
    })
})