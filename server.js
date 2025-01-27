const dotenv = require("dotenv").config()
const express = require("express")
const app = express()

const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require('express-session')


const port = process.env.PORT ? process.env.PORT : "3000"
const authController = require("./controllers/auth.js")


mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

//Middleware
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, 
        saveUninitialized: true,
    })
)

app.get('/', async (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    })
})

app.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}`)
    } else {
        res.send(`Sorry, no quests allowed.`)
    }
})

app.use('/auth', authController)


app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`)
})