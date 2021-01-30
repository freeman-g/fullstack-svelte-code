require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const authenticateJwt = require('./authenticate-jwt')
const { passKnexSecured } = require('./database/dynamic-knex')

const usersRouter = require('./routes/users')
const lunchWeekRouter = require('./routes/lunch-week')
const lunchWeekPublicRouter = require('./routes/lunch-week-public')

const app = express()

app.use(cors())
app.options('*', cors())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const router = express.Router()

router.use('/users', usersRouter)
router.use('/lunch-week', [authenticateJwt, passKnexSecured], lunchWeekRouter)
router.use('/lunch-week-public', lunchWeekPublicRouter)
app.use('/api', router)

/* fallback route to index.html*/
app.use('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

module.exports = app
