var limdu = require('limdu');
const prompt = require("prompt-sync")({ sigint: true });
const db = require('./pokemonModel');

(async function() {

	const Pokemons = await db.getAllPokemons()
	console.log(Pokemons)
	// First, define our base classifier type (a multi-label classifier based on winnow):
	var TextClassifier = limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
		binaryClassifierType: limdu.classifiers.Winnow.bind(0, {retrain_count: 10})
	});

	// Now define our feature extractor - a function that takes a sample and adds features to a given features set:
	var WordExtractor = function(input, features) {
		input.split(" ").forEach(function(word) {
			features[word]=1;
		});
	};

	// Initialize a classifier with the base classifier type and the feature extractor:
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
		{input: "C'est qui mon pokemon ?", output: "description"},
		{input: "Donne moi plus d'informations sur mon pokemon", output: "description"},
		{input: "Donne moi les prochaines évolutions de mon pokemon", output: "evolution"},
	]);

	// Initialize a classifier with the base classifier type and the feature extractor:
	var intentClassifierAccept = new limdu.classifiers.EnhancedClassifier({
		classifierType: TextClassifier,
		featureExtractor: WordExtractor
	});

	// Train and test:
	intentClassifierAccept.trainBatch([
		{input: "Je veux bien le savoir", output: "oui"},
		{input: "Avec plaisir", output: "oui"},
		{input: "Oui", output: "oui"},
		{input: "ok", output: "oui"},
		{input: "je ne le veut pas", output: "non"},
		{input: "Non, merci", output: "non"},
		{input: "Non je veux pas", output: "non"},
		{input: "Non", output: "non"},
	]);



	console.log('Bonjour')
	const rhum_want = prompt("Que puis-je pour toi ?");
	predicted_response = intentClassifier.classify(rhum_want);

	let current_boisson = null
	// console.log('predicted_response', predicted_response)
	for (Pokemon of Pokemons) {
		if (Pokemon.name == predicted_response[0]) {
			console.log("Le pokemon", Pokemon['name'], "stats : ", Pokemon['price'], " chacal")
			current_boisson = Pokemon 
			break
		}
	}

	const yesno = prompt(`Souhaitez-vous payer votre ${current_boisson.name} ?`);
	predicted_response = intentClassifierAccept.classify(yesno);
	if (predicted_response[0] == 'non') {
		console.log('Merci et à la prochaine!')
	}

	if (predicted_response[0] == 'oui') {

		const want_qty = prompt(`Avez-vous besoin de combien de ${current_boisson.name} ?`);
		console.log(`Vous voulez ${Number(want_qty)} ${current_boisson.name}(s)`)
		boisson_from_db = await db.getPokemonById(current_boisson.id)
		if ((boisson_from_db.quantity <= 0)) {
			console.log(`Nous n'avons plus de ${boisson_from_db.name}!`)
		} else if ((boisson_from_db.quantity - Number(want_qty)) <= 0) {
			console.log(`Nous n'avons pas suffisamment de ${boisson_from_db.name} pour vous servir!`)
		} else {
			db.updateBoisson(current_boisson.id, boisson_from_db.quantity - Number(want_qty))
			if (Number(want_qty) == 1) {
				console.log('Ok merci prennez votre boisson!')
			} else {
				console.log('Ok merci prennez vos Pokemons!')
			}
		}
	}

})()