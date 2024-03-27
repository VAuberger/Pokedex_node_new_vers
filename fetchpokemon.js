const axios = require('axios');
const readline = require('readline');
const db_pokemon = require('./pokemonModel');
var limdu = require('limdu');
const prompt = require("prompt-sync")({ sigint: true });


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function fetchPokemon(pokemonName) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonData = response.data;


    var TextClassifier = limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
      binaryClassifierType: limdu.classifiers.Winnow.bind(0, {retrain_count: 10})
    });
  
    // Now define our feature extractor - a function that takes a sample and adds features to a given features set:
    var WordExtractor = function(input, features) {
      input.split(" ").forEach(function(word) {
        features[word]=1;
      });
    };
    var intentClassifierAccept = new limdu.classifiers.EnhancedClassifier({
      classifierType: TextClassifier,
      featureExtractor: WordExtractor
    });


    var intentClassifier = new limdu.classifiers.EnhancedClassifier({
      classifierType: TextClassifier,
      featureExtractor: WordExtractor
    });
  
    // Train and test:
    intentClassifier.trainBatch([
      {input: "Donne moi les statistiques de mon pokemon", output: "statistiques"},
      {input: "Donne moi les stats de mon pokemon", output: "statistiques"},
      {input: "Je veux connaître les performances de mon pokemon", output: "statistiques"},
      {input: "Je veux connaître l'évolution de mon pokemon", output: "evolution"},
      {input: "il évolue en quoi ?", output: "evolution"},
      {input: "Mon type de pokemon il bat quel type de pokemons", output: "forces_faiblesses"},
      {input: "Mon pokémon il est fort contre qui", output: "forces_faiblesses"},
      {input: "Donne moi les prochaines évolutions de mon pokemon", output: "evolution"},
      {input: "Retirer un pokemon de mon pokedex", output: "delete_pokemon"},
      {input: "Je veux voir mon pokedex", output: "consult_pokedex"},
    ]);

    intentClassifierAccept.trainBatch([
      {input: "Je veux bien le savoir", output: "oui"},
      {input: "Avec plaisir", output: "oui"},
      {input: "Oui", output: "oui"},
      {input: "ok", output: "oui"},
      {input: "je ne le veux pas", output: "non"},
      {input: "Non, merci", output: "non"},
      {input: "Non je veux pas", output: "non"},
      {input: "Non", output: "non"},
    ]);
    
    const yesno = prompt(`Souhaiteriez-vous enregistrer ${pokemonName} ? `);
    predicted_response = intentClassifierAccept.classify(yesno);
    if (predicted_response[0] == 'oui') {
      await db_pokemon.createPokemon(pokemonData.id, pokemonData.name, pokemonData.types.map(type => type.type.name).join(', '), pokemonData.abilities.map(ability => ability.ability.name).join(', '));
      console.log(`Votre ${pokemonName} a été transféré au Professeur. `)
    } else {      
        console.log(`Le pokémon n'a pas été sauvegardé.`)
    }

    const analyse_pokemon = prompt(`Que souhaitez-vous savoir sur votre ${pokemonName} ? `)
    predicted_response = intentClassifier.classify(analyse_pokemon);
    if(predicted_response[0] === "evolution") {
      const response = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${pokemonData.name}`);
      pokemonData = response.data;
      console.log('Evolutions : ', pokemonData.chain.map(evolves_to => evolves_to.evolves_to.name).join(', '));
    } else if(predicted_response[0] === "forces_faiblesses") {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonData.types}`);
      pokemonData = response.data;
      console.log("Voici une liste avec l'ensemble des types envers lesquels vôtre pokémon est plus efficace : ", pokemonData.damage_relations.map(double_damage_to => double_damage_to.double_damage_to.name).join("\r\n"));
    } else if(predicted_response[0] === "statistiques") {
      console.log('Nom du Pokémon : ', pokemonData.name);
      console.log('Taille : ', pokemonData.height);
      console.log('Poids : ', pokemonData.weight);
      console.log('Type : ', pokemonData.weight);
      console.log('Capacités : ', pokemonData.abilities.map(ability => ability.ability.name).join(', '));
    } else if(predicted_response[0] === "consult_pokedex") {
      const getAllPokemons = await db_pokemon.getAllPokemons();
      console.log(`Voici tous vos pokémons actuellement stockés dans le pokédex :`, getAllPokemons)
    } else if(predicted_response[0] === "delete_pokemon") {
      const getAllPokemons = await db_pokemon.deletPokemon(pokemonData.id);
      console.log(`Nombre de pokémon(s) retirés :`, getAllPokemons)
    }

    return pokemonData;
  } catch (error) {
    console.error('Pokémon introuvable : ', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Automatisation de la demande du pokemon en input
function askForPokemon() {
  return new Promise((resolve, reject) => {
    console.log('Bonjour BourgPalette Man');
    rl.question('Quel Pokémon souhaiteriez-vous analyser ?\n', (answer) => {
      resolve(answer);
    });
  });
}

// Appeler le tout
async function main() {
  try {
    const pokemonName = await askForPokemon();
    await fetchPokemon(pokemonName);
  } catch (error) {
    console.error('Une erreur !!! : ', error);
  } finally {
    rl.close();
  }
}

main();
