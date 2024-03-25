// db.js - Fichier pour gérer les opérations CRUD avec Knex

const knex = require('knex')(require('./knexfile')['development']);

// Create
async function createPokemon(name, quantity, price) {
  return await knex('Pokemon').insert({ name, quantity, price });
}

// Read
async function getAllPokemons() {
  return await knex.select().from('Pokemon');
}

async function getPokemonById(id) {
  return await knex('Pokemon').where({ id }).first();
}

// Update
async function updatePokemon(id, quantity) {
  return await knex('Pokemon').where({ id }).update({ quantity });
}

// Delete
async function deletPokemon(id) {
  return await knex('Pokemon').where({ id }).del();
}

module.exports = {
  createPokemon,
  getAllPokemons,
  getPokemonById,
  updatePokemon,
  deletPokemon
};

// npm install knex sqlite3