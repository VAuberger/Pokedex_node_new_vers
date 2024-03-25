const knex = require('knex')(require('./knexfile')['development']);

async function createTable() {
  try {
    const exists = await knex.schema.hasTable('Evolutions');
    if (!exists) {
      await knex.schema.createTable('Pokemon', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('height');
        table.integer('weight');
      });
      console.log('La table "Pokemon" a été créée avec succès.');
    } else {
      console.log('La table "Pokemon" existe déjà.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la table :', error);
  } finally {
    await knex.destroy();
  }
}

createTable();