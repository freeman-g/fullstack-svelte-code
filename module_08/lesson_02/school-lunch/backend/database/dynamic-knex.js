const knex = require('knex')
const knexStringcase = require('knex-stringcase')

const types = require('pg').types
types.setTypeParser(1082, (val) => val)

// create a cache map
const knexCache = new Map()

const getKnex = (schoolDatabase) => {
  // first check the cache
  let db = knexCache.get(schoolDatabase)

  // if we don't have a knex instance in the cache, create a new one
  if (!db) {
    // create a config with the school database and the env vars
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

    // since we created a new instance, add to the cache for the next request
    knexCache.set(schoolDatabase, db)
  }
  return db
}

const passKnex = (req, res, next) => {
  // The JWT information will be populated in req.user
  // get the school_database property from req.user
  const schoolDatabase = req.user['https://school-lunch/school_database']
  req.knex = getKnex(schoolDatabase)
  next()
}

module.exports = passKnex
