// Ce script peut être exécuté dans la console du navigateur pour tester l'affichage des poèmes

function testerAffichagePoemes() {
    console.log("Test d'affichage des poèmes...");
    
    // Créer un poème de test
    const poemeTest = {
        id: 'poeme_test_' + new Date().getTime(),
        texte: "Voici un poème de test\nQui permet de vérifier\nSi l'affichage fonctionne correctement",
        date: new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        emotions: ["test", "débogage"]
    };
    
    // Récupérer les poèmes existants
    let poemesSauvegardes = JSON.parse(localStorage.getItem('dropin_poemes') || '[]');
    
    // Ajouter le poème de test
    poemesSauvegardes.push(poemeTest);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('dropin_poemes', JSON.stringify(poemesSauvegardes));
    
    console.log("Poème de test ajouté au localStorage");
    console.log("Rafraîchissez la page pour voir le résultat");
    
    return "Poème de test ajouté avec succès !";
}

function effacerTousLesPoemes() {
    if (confirm("Voulez-vous vraiment effacer tous les poèmes ?")) {
        localStorage.removeItem('dropin_poemes');
        console.log("Tous les poèmes ont été supprimés");
        console.log("Rafraîchissez la page pour voir le résultat");
        return "Poèmes supprimés avec succès !";
    }
    return "Opération annulée";
}

// Pour utiliser ce script:
// 1. Ouvrez la console du navigateur (F12)
// 2. Copiez-collez tout ce fichier dans la console
// 3. Exécutez testerAffichagePoemes() pour ajouter un poème de test
// 4. Exécutez effacerTousLesPoemes() pour effacer tous les poèmes
