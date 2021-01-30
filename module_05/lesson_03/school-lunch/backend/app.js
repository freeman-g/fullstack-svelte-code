var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors') // HERE

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var lunchWeekRouter = require('./routes/lunch-week')

var app = express()

app.use(cors()) // HERE
app.options('*', cors()) // allows preflight for POST, PUT, DELETE

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

var router = express.Router()

router.use('/', indexRouter)
router.use('/users', usersRouter)
router.use('/lunch-week', lunchWeekRouter)
app.use('/api', router)

module.exports = app
