// creates the lunch_week table
exports.up = function (knex) {
  return knex.schema.createTable('lunch_week', function (table) {
    table.increments('lunch_week_id') // auto-numbering primary key column
    table.date('week_of').notNullable()
    table.boolean('is_published').notNullable().defaultTo(false)
  })
}

exports.down = function (knex) {
  // if we wanted to undo this migration, then we would drop the table
  return knex.schema.dropTable('lunch_week')
}
