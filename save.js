// App.js - Utilisation des opérations CRUD avec Knex

const db = require('./pokemonModel');
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function main() {
  const Evolutions = {
    'statistiques': { height: POKEAPI_BASE_URL + 'height/56', weight: POKEAPI_BASE_URL + 'weight/56'},
    'evolution': { height: POKEAPI_BASE_URL + 'abilities/', weight: POKEAPI_BASE_URL + 'order/'},
    'description': { height: POKEAPI_BASE_URL + 'species/', weight: POKEAPI_BASE_URL + 'types/'},
  }

  for (Pokemon_name in Evolutions) {
    await db.createPokemon(Pokemon_name, Evolutions[Pokemon_name].height, Evolutions[Pokemon_name].weight);
  }

  // Read
  const getAllPokemons = await db.getAllPokemons();
  console.log('Tous les Pokemon :', getAllPokemons);
}

main().catch(err => console.error(err));
