exports.up = function (knex) {
  return knex.schema.createTable('lunch_day', function (table) {
    table.increments('lunch_day_id') // primary key
    table.integer('lunch_week_id').notNullable() // create the foreign key (FK) column first
    table.date('day').notNullable()
    table.string('menu_details', 1000)
    table
      .foreign('lunch_week_id')
      .references('lunch_week_id')
      .inTable('lunch_week') // FK to the parent lunch_week table
      .onDelete('CASCADE')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('lunch_day')
}
