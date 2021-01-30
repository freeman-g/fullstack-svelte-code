module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'school_lunch',
      host: '127.0.0.1',
      user: 'postgres',
      password: 'Black1fish!',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
