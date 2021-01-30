const knex = require('knex')
const knexStringcase = require('knex-stringcase')

const types = require('pg').types
types.setTypeParser(1082, (val) => val)

const knexCache = new Map()

const getKnex = (schoolDatabase) => {
  let db = knexCache.get(schoolDatabase)
  if (!db) {
    const config = {
      client: 'postgresql',
      connection: {
        database: schoolDatabase,
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
      },
    }

    const options = knexStringcase(config)
    db = knex(options)

    knexCache.set(schoolDatabase, db)
  }
  return db
}

const passKnexPublic = (req, res, next) => {
  const schoolName = req.params.schoolName
  const schoolDatabase = schoolName.replace(/-/g, '_')
  req.knex = getKnex(schoolDatabase)
  next()
}

const passKnexSecured = (req, res, next) => {
  const schoolDatabase = req.user['https://school-lunch/school_database']
  req.knex = getKnex(schoolDatabase)
  next()
}

module.exports = { passKnexSecured, passKnexPublic }
