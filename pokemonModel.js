// db.js - Fichier pour gérer les opérations CRUD avec Knex

const knex = require('knex')(require('./knexfile')['development']);

// Create
async function createPokemon(pokedex_id_entry, name, types, abilities) {
  return await knex('pokemons').insert({ pokedex_id_entry, name, types, abilities });
}

// Read
async function getAllPokemons() {
  return await knex.select().from('pokemons');
}

async function getPokemonById(id) {
  return await knex('pokemons').where({ id }).first();
}

// Update
async function updatePokemon(id, quantity) {
  return await knex('pokemons').where({ id }).update({ height });
}

// Delete
async function deletPokemon(pokedex_id_entry) {
  return await knex('pokemons').where({ pokedex_id_entry }).del();
}

module.exports = {
  createPokemon,
  getAllPokemons,
  getPokemonById,
  updatePokemon,
  deletPokemon
};

// npm install knex sqlite3