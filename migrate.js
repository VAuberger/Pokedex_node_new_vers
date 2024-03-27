const knex = require('knex')(require('./knexfile')['development']);

 async function createTable() {
   try {
     const exists = await knex.schema.hasTable('pokemons');
     if (!exists) {
      await knex.schema
      .createTable('pokemons', function(table) {
        table.increments('id').primary();
        table.integer('pokedex_id_entry');
        table.string('name').notNullable();
        table.string('types');
        table.string('abilities'); 
      })
      .createTable('evolutions', function(table) {
        table.increments('id').primary();
        table.integer('pokedex_id_entry');
        table.string('user_pokemon_name');
        table.string('evolves_to_');
      })
    }
   } catch (error) {
     console.error('Erreur lors de la création de la table :', error);
   } finally {
     await knex.destroy();
   }
}

createTable();