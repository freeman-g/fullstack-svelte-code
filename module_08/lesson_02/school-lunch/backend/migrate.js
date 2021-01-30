const knex = require('knex')
require('dotenv').config()

const getConfig = (databaseName) => {
  return {
    client: 'postgresql',
    connection: {
      database: databaseName,
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    },
  }
}

const migrateDatabases = async () => {
  const defaultKnex = knex(getConfig('postgres'))
  const catalogDb = await defaultKnex
    .select()
    .from('pg_database')
    .where({ datname: 'catalog' })
    .first()

  if (!catalogDb) {
    await defaultKnex.raw(`create database catalog`)
  }

  const catalogKnex = knex(getConfig('catalog'))
  await catalogKnex.migrate.latest({
    directory: './database/catalog_migrations',
  })

  const schools = await catalogKnex.select().from('schools')

  for (let i = 0; i < schools.length; i++) {
    const school = schools[i]
    const db = await catalogKnex
      .select()
      .from('pg_database')
      .where({ datname: school.school_database })
      .first()

    if (!db) {
      await catalogKnex.raw(`create database ${school.school_database}`)
    }
    const appKnex = knex(getConfig(school.school_database))
    await appKnex.migrate.latest({
      directory: './database/app_migrations',
    })
  }
  process.exit(0)
}

;(async () => {
  migrateDatabases()
})()
