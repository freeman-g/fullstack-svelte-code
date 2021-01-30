const knex = require('knex')
const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile.js')[environment]
const knexStringcase = require('knex-stringcase')
const options = knexStringcase(config)
const db = knex(options)

module.exports = db
