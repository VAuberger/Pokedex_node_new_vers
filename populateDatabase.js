const axios = require('axios');
const knex = require('knex')(require('./knexfile').development);

const fetchPokemonData = async () => {
    try {
        // Fetch a list of Pokémon
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const pokemons = response.data.results;

        for (const pokemon of pokemons) {
            // Fetch detailed data for each Pokémon
            const pokemonDetail = await axios.get(pokemon.url);
            
            // Extract and transform the data you need
            const pokemonData = {
                name: pokemonDetail.data.name,
                // Add more fields as per your table structure
            };

            // Insert the Pokémon into the pokemons table
            await knex('pokemons').insert(Pokemon);

            // If the Pokémon has evolutions, fetch and insert them similarly
            // You might need to access a different endpoint and process the data accordingly
        }
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
};

fetchPokemonData().then(() => {
    console.log('Finished populating the database');
    process.exit(0);
});