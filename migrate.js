const knex = require('knex')(require('./knexfile')['development']);

// async function createTable() {
//   try {
//     const exists = await knex.schema.hasTable('Pokemon');
//     if (!exists) {
//       await knex.schema.createTable('Pokemon', table => {
//         table.increments('id').primary();
//         table.string('name');
//         table.integer('height');
//         table.integer('weight');
//       });
//       console.log('La table "Pokemon" a été créée avec succès.');
//     } else {
//       console.log('La table "Evolutions" existe déjà.');
//     }
//   } catch (error) {
//     console.error('Erreur lors de la création de la table :', error);
//   } finally {
//     await knex.destroy();
//   }
// }

// createTable();

exports.up = function(knex) {
  return knex.schema
    .createTable('pokemons', function(table) {
      table.increments('id').primary();
      table.integer('pokedex_id_entry');
      table.string('name').notNullable();
      table.string('types');
      table.string('abilities'); // Modifier cette ligne
    })
    .createTable('evolutions', function(table) {
      table.increments('id').primary();
      table.integer('pokemon_id').unsigned().references('pokemons.id');
      table.integer('evolves_to_id').unsigned().references('pokemons.id');
    })

    .createTable('MyPokemon', function(table) {
      table.increments('id').primary();
      table.int
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('evolutions')
    .dropTableIfExists('pokemons'); 
};