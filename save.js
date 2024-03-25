// App.js - Utilisation des opérations CRUD avec Knex

const db = require('./pokemonModel');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function main() {
  const Pokemon = {
    'Pikachu': { qty: 10, price: 30},
    'Tortank': { qty: 19, price: 10},
    'old_nick': { qty: 5, price: 30},
  }

  for (boisson_name in Pokemon) {
    await db.createBoisson(boisson_name, Pokemon[boisson_name].qty, Pokemon[boisson_name].price);
  }

  // Read
  const getAllPokemon = await db.getAllPokemon();
  console.log('Tous les Pokemon :', getAllPokemon);
}

main().catch(err => console.error(err));
