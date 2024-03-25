exports.up = function(knex) {
    return knex.schema
      .createTable('pokemons', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('type');
        table.string('strengths');
        table.string('weaknesses');
      })
      .createTable('evolutions', function(table) {
        table.increments('id').primary();
        table.integer('pokemon_id').unsigned().references('pokemons.id');
        table.integer('evolves_to_id').unsigned().references('pokemons.id');
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('evolutions')
      .dropTableIfExists('pokemons');
  };