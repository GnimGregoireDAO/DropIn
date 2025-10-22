document.addEventListener("DOMContentLoaded", function () {
  // Éléments DOM
  const premierMotInput = document.getElementById("premier-mot");
  const commencerBtn = document.getElementById("commencer-poeme");
  const poemConstruction = document.getElementById("poem-construction");
  const currentPoem = document.getElementById("current-poem");
  const wordSuggestions = document.getElementById("word-suggestions");
  const finaliserBtn = document.getElementById("finaliser-poeme");
  const recommencerBtn = document.getElementById("recommencer-poeme");
  const poemesListe = document.getElementById("poemes-liste");
  
  // Nouveaux éléments pour la barre d'outils
  const addLinebreakBtn = document.getElementById("add-linebreak");
  const addSpaceBtn = document.getElementById("add-space");
  const undoWordBtn = document.getElementById("undo-word");
  const refreshSuggestionsBtn = document.getElementById("refresh-suggestions");
  const currentEmotionDisplay = document.querySelector("#current-emotion .emotion-value");
  
  // Variables pour suivre l'historique du poème
  let poemHistory = [];
  let currentEmotion = "confusion"; // Emotion par défaut

  // Nouvel élément pour l'explication des émotions
  let emotionExplanation;
  // Données pour les suggestions et explications des émotions
  // Structure: émotion -> [explication, [suggestions]]
  const emotionsData = {
    joie: {
      explanation:
        "La joie est une émotion positive intense qui crée un sentiment de bien-être et de satisfaction. Elle nous donne de l'énergie et nous permet de voir le monde sous un angle positif.",
      suggestions: [
        "rayonne",
        "sourire",
        "éclate",
        "bonheur",
        "lumière",
        "chaleur",
        "rire",
        "danse",
        "vibre",
        "étincelle",
      ],
    },
    tristesse: {
      explanation:
        "La tristesse est une réponse naturelle à la perte, aux déceptions ou aux situations douloureuses. Elle nous permet de ralentir, de réfléchir et parfois de demander du soutien.",
      suggestions: [
        "larmes",
        "pluie",
        "ombre",
        "nuit",
        "sombre",
        "seul",
        "silence",
        "vide",
        "manque",
        "mélancolie",
      ],
    },
    colère: {
      explanation:
        "La colère est une émotion puissante qui signale qu'une limite a été franchie ou qu'une injustice a été commise. Elle peut nous donner l'énergie de défendre nos valeurs.",
      suggestions: [
        "feu",
        "brûle",
        "tempête",
        "crie",
        "rouge",
        "frappe",
        "éclate",
        "bouillonne",
        "révolte",
        "flamme",
      ],
    },
    peur: {
      explanation:
        "La peur est un mécanisme de protection qui nous alerte face aux dangers potentiels. Elle peut nous paralyser mais aussi nous pousser à agir pour nous protéger.",
      suggestions: [
        "tremble",
        "ombre",
        "invisible",
        "menace",
        "doute",
        "fuis",
        "glace",
        "paralyse",
        "battement",
        "prudence",
      ],
    },
    espoir: {
      explanation:
        "L'espoir est cette lueur qui nous permet d'entrevoir un avenir meilleur même dans les moments difficiles. Il nous donne la force de persévérer.",
      suggestions: [
        "demain",
        "lumière",
        "horizon",
        "chemin",
        "rêve",
        "possible",
        "avenir",
        "étoile",
        "promesse",
        "aube",
      ],
    },
    confusion: {
      explanation:
        "La confusion survient quand nous manquons de repères ou d'informations claires. Elle nous invite à prendre du recul et à chercher à mieux comprendre.",
      suggestions: [
        "labyrinthe",
        "brume",
        "perdu",
        "cherche",
        "brouillard",
        "tourmente",
        "énigme",
        "illusion",
        "puzzle",
        "question",
      ],
    },
    perdu: {
      explanation:
        "Se sentir perdu, c'est ne plus savoir quelle direction prendre. Cette émotion peut être une invitation à redéfinir ce qui compte vraiment pour nous.",
      suggestions: [
        "chemin",
        "boussole",
        "errance",
        "vide",
        "recherche",
        "abandon",
        "inconnu",
        "ténèbres",
        "dérive",
        "direction",
      ],
    },
    anxiété: {
      explanation:
        "L'anxiété est cette inquiétude persistante face à l'inconnu ou au futur. Elle nous alerte sur nos insécurités mais peut aussi nous pousser à mieux nous préparer.",
      suggestions: [
        "souffle",
        "pression",
        "anticipe",
        "tremble",
        "accélère",
        "contrôle",
        "spirale",
        "prévoir",
        "tension",
        "attente",
      ],
    },
    solitude: {
      explanation:
        "La solitude est ce sentiment d'être seul, déconnecté des autres. Elle peut être douloureuse mais aussi une opportunité de se reconnecter à soi-même.",
      suggestions: [
        "isolé",
        "silence",
        "distance",
        "mur",
        "île",
        "écho",
        "vide",
        "désert",
        "séparé",
        "absence",
      ],
    },
    fatigue: {
      explanation:
        "La fatigue est le signal que notre corps ou notre esprit a besoin de repos. Elle nous rappelle nos limites et l'importance de prendre soin de nous.",
      suggestions: [
        "lourd",
        "pèse",
        "épuisé",
        "soupir",
        "sommeil",
        "repos",
        "limite",
        "ralentir",
        "fardeau",
        "pause",
      ],
    },
  };

  // Extraire les suggestions pour compatibilité avec le code existant
  const suggestionsByEmotion = {};
  for (const [emotion, data] of Object.entries(emotionsData)) {
    suggestionsByEmotion[emotion] = data.suggestions;
  } // Fonction pour détecter l'émotion à partir du premier mot
  function detectEmotion(word) {
    word = word.toLowerCase().trim();

    // Pour cette version simple, on vérifie juste si le mot est une clé de notre dictionnaire
    if (emotionsData[word]) {
      return word;
    }

    // Sinon on vérifie si le mot correspond à d'autres émotions communes
    const emotionKeywords = {
      joie: [
        "heureux",
        "content",
        "joyeux",
        "ravi",
        "souriant",
        "enthousiaste",
        "euphorique",
        "bonheur",
        "félicité",
        "allégresse",
        "gaieté",
      ],
      tristesse: [
        "triste",
        "malheureux",
        "mélancolique",
        "chagrin",
        "déprimé",
        "abattu",
        "nostalgique",
        "morose",
        "peine",
        "chagriné",
        "affligé",
      ],
      colère: [
        "fâché",
        "énervé",
        "furieux",
        "irrité",
        "agacé",
        "révolté",
        "enragé",
        "exaspéré",
        "frustré",
        "indigné",
        "hostile",
      ],
      peur: [
        "effrayé",
        "anxieux",
        "inquiet",
        "apeuré",
        "terrifié",
        "angoissé",
        "craintif",
        "alarmé",
        "affolé",
        "paniqué",
      ],
      espoir: [
        "optimiste",
        "confiant",
        "motivé",
        "inspiré",
        "déterminé",
        "ambitieux",
        "aspiration",
        "attente",
        "promesse",
        "foi",
      ],
      confusion: [
        "confus",
        "perplexe",
        "embrouillé",
        "désorienté",
        "indécis",
        "troublé",
        "incertain",
        "égaré",
        "embarrassé",
      ],
      perdu: [
        "abandonné",
        "délaissé",
        "égaré",
        "seul",
        "isolé",
        "désemparé",
        "déboussolé",
        "détaché",
      ],
      anxiété: [
        "angoisse",
        "stress",
        "nerveux",
        "agité",
        "tendu",
        "préoccupé",
        "soucieux",
        "oppressé",
        "tourmenté",
      ],
      solitude: [
        "seul",
        "isolé",
        "abandonné",
        "délaissé",
        "rejeté",
        "esseulé",
        "solitaire",
        "déserté",
        "isolement",
      ],
      fatigue: [
        "épuisé",
        "exténué",
        "las",
        "harassé",
        "usé",
        "vidé",
        "surmenage",
        "lassitude",
        "faible",
        "accablé",
      ],
    };

    for (let emotion in emotionKeywords) {
      if (emotionKeywords[emotion].includes(word)) {
        return emotion;
      }
    }

    // Si nous avons une phrase au lieu d'un mot, nous essayons de détecter l'émotion
    // en cherchant des mots-clés dans la phrase
    const words = word.split(/\s+/);
    for (let emotion in emotionKeywords) {
      for (let i = 0; i < words.length; i++) {
        if (emotionKeywords[emotion].includes(words[i])) {
          return emotion;
        }
      }
    }

    // Si on ne trouve pas, on retourne une émotion par défaut
    return "confusion";
  }  // Générer des suggestions basées sur le texte actuel et l'émotion
  function generateSuggestions(text, emotion) {
    const emotionData = emotionsData[emotion] || emotionsData["confusion"];
    const suggestions = emotionData.suggestions;

    // Mettre à jour l'indicateur d'émotion actuelle
    updateCurrentEmotion(emotion);

    // Afficher l'explication de l'émotion si elle existe
    if (!emotionExplanation) {
      emotionExplanation = document.createElement("div");
      emotionExplanation.classList.add("emotion-explanation");

      // Insérer l'explication avant les suggestions
      const suggestionsContainer = document.querySelector(
        ".suggestions-container"
      );
      suggestionsContainer.insertBefore(
        emotionExplanation,
        suggestionsContainer.firstChild
      );
    }

    // Mettre à jour le contenu de l'explication
    emotionExplanation.innerHTML = `
            <div class="emotion-bubble">
                <h5>À propos de cette émotion: <span class="emotion-name">${emotion}</span></h5>
                <p>${emotionData.explanation}</p>
            </div>
        `;

    // Afficher les suggestions
    wordSuggestions.innerHTML = "";

    // Créer trois groupes de suggestions pour varier
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    const selectedSuggestions = shuffled.slice(0, 3);

    selectedSuggestions.forEach((word) => {
      const wordElement = document.createElement("span");
      wordElement.classList.add("suggestion-word");
      wordElement.textContent = word;

      // Ajouter le mot au poème lors du clic
      wordElement.addEventListener("click", function () {
        appendToPoem(word);
        // Générer de nouvelles suggestions
        generateSuggestions(currentPoem.textContent, emotion);
      });

      wordSuggestions.appendChild(wordElement);
    });
  }

  // Mettre à jour l'indicateur d'émotion actuelle
  function updateCurrentEmotion(emotion) {
    currentEmotion = emotion;
    if (currentEmotionDisplay) {
      currentEmotionDisplay.textContent = emotion;
    }
  }

  // Ajouter un mot au poème et à l'historique
  function appendToPoem(word) {
    const currentText = currentPoem.textContent;
    let newText;

    // Si le poème est vide, commencer avec le mot
    if (!currentText.trim()) {
      newText = word;
    } else {
      // Sinon, ajouter le mot avec un espace
      if (currentText.endsWith('\n')) {
        newText = currentText + word;
      } else {
        newText = currentText + ' ' + word;
      }
    }

    // Sauvegarder dans l'historique avant de modifier
    poemHistory.push(currentText);
    
    // Mettre à jour le poème
    currentPoem.textContent = newText;
  }

  // Ajouter un saut de ligne au poème
  function addLineBreak() {
    // Sauvegarder dans l'historique avant de modifier
    poemHistory.push(currentPoem.textContent);
    
    if (!currentPoem.textContent.endsWith('\n')) {
      currentPoem.textContent += '\n';
    }
  }

  // Ajouter un espace au poème
  function addSpace() {
    // Sauvegarder dans l'historique avant de modifier
    poemHistory.push(currentPoem.textContent);
    
    if (!currentPoem.textContent.endsWith(' ') && currentPoem.textContent.length > 0) {
      currentPoem.textContent += ' ';
    }
  }

  // Annuler la dernière action
  function undoLastAction() {
    if (poemHistory.length > 0) {
      currentPoem.textContent = poemHistory.pop();
    }
  }

  // Rafraîchir les suggestions basées sur l'émotion actuelle
  function refreshSuggestions() {
    // Animation de transition
    wordSuggestions.classList.add('refreshing');
    
    setTimeout(() => {
      // Générer de nouvelles suggestions
      generateSuggestions(currentPoem.textContent, currentEmotion);
      
      // Supprimer l'animation
      wordSuggestions.classList.remove('refreshing');
    }, 300);
  }

  // Ajouter un mot au poème
  function appendToPoem(word) {
    const currentText = currentPoem.textContent;

    // Si le poème est vide, commencer avec le mot
    if (!currentText.trim()) {
      currentPoem.textContent = word;
    } else {
      // Sinon, ajouter le mot avec un espace
      if (currentText.endsWith("\n")) {
        currentPoem.textContent += word;
      } else {
        currentPoem.textContent += " " + word;
      }
    }
  }

  // Ajouter un saut de ligne au poème
  function addLineBreak() {
    if (!currentPoem.textContent.endsWith("\n")) {
      currentPoem.textContent += "\n";
    }
  } // Charger les poèmes sauvegardés dans le localStorage
  function loadSavedPoems() {
    const savedPoems = JSON.parse(
      localStorage.getItem("dropin_poemes") || "[]"
    );

    if (savedPoems.length > 0) {
      // Supprimer le message "pas de poèmes"
      poemesListe.innerHTML = "";

      // Afficher chaque poème sauvegardé
      savedPoems.forEach((poem) => {
        const poemCard = createPoemCard(poem.text, poem.emotion, poem.date);
        poemesListe.appendChild(poemCard);
      });
    }
  }

  // Créer une carte de poème
  function createPoemCard(poemText, emotion, dateString) {
    const poemCard = document.createElement("div");
    poemCard.classList.add("col-md-6", "col-lg-4", "mb-4");

    poemCard.innerHTML = `
            <div class="poeme-card">
                <div class="poeme-text">${poemText}</div>
                <div class="poeme-emotions">
                    <span class="emotion-tag">#${emotion}</span>
                </div>
                <div class="poeme-date">${dateString}</div>
            </div>
        `;

    return poemCard;
  }

  // Sauvegarder le poème dans la galerie et le localStorage
  function savePoem() {
    const poemText = currentPoem.textContent.trim();

    if (poemText) {
      const date = new Date();
      const formattedDate = `${date.toLocaleDateString()} à ${date
        .toLocaleTimeString()
        .slice(0, 5)}`;

      // Déterminer l'émotion principale du poème
      const firstWord = poemText.split(" ")[0].toLowerCase();
      const emotion = detectEmotion(firstWord);

      // Créer l'objet poème
      const poem = {
        text: poemText,
        emotion: emotion,
        date: formattedDate,
        timestamp: Date.now(),
      };

      // Sauvegarder dans le localStorage
      const savedPoems = JSON.parse(
        localStorage.getItem("dropin_poemes") || "[]"
      );
      savedPoems.push(poem);
      localStorage.setItem("dropin_poemes", JSON.stringify(savedPoems));

      // Si c'est le premier poème, vider le conteneur
      if (savedPoems.length === 1) {
        poemesListe.innerHTML = "";
      }

      // Créer et ajouter la carte au DOM
      const poemCard = createPoemCard(poem.text, poem.emotion, poem.date);
      poemesListe.prepend(poemCard);

      // Animation d'apparition
      poemCard.style.opacity = "0";
      setTimeout(() => {
        poemCard.style.opacity = "1";
        poemCard.style.transition = "opacity 0.5s ease";
      }, 10);

      // Réinitialiser l'interface d'écriture
      resetPoemInterface();

      // Afficher un message de confirmation
      showMessage("Votre poème a été sauvegardé avec succès!", "success");
    }
  }

  // Fonction pour afficher des messages temporaires
  function showMessage(message, type = "info") {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `message-${type}`);
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    // Animation d'entrée
    setTimeout(() => {
      messageDiv.classList.add("show");
    }, 10);

    // Disparition après 3 secondes
    setTimeout(() => {
      messageDiv.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(messageDiv);
      }, 500);
    }, 3000);
  } // Réinitialiser l'interface d'écriture
  function resetPoemInterface() {
    currentPoem.textContent = "";
    premierMotInput.value = "";
    poemConstruction.style.display = "none";

    // Réinitialiser l'explication d'émotion si elle existe
    if (emotionExplanation) {
      emotionExplanation.innerHTML = "";
    }
  } // Charger les poèmes sauvegardés au démarrage
  loadSavedPoems();

  // Event listeners  commencerBtn.addEventListener("click", function () {
    const premierMot = premierMotInput.value.trim();

    if (premierMot) {
      // Réinitialiser l'historique
      poemHistory = [];
      
      // Afficher la zone de construction du poème
      poemConstruction.style.display = "block";

      // Mettre le premier mot dans le poème
      currentPoem.textContent = premierMot;

      // Générer des suggestions basées sur l'émotion détectée
      const emotion = detectEmotion(premierMot);
      currentEmotion = emotion;
      
      // Mettre à jour l'indicateur d'émotion
      updateCurrentEmotion(emotion);
      
      // Générer les suggestions
      generateSuggestions(premierMot, emotion);

      // Scroll jusqu'à la zone de construction
      poemConstruction.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Permettre l'utilisation de la touche Entrée pour commencer
  premierMotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && premierMotInput.value.trim()) {
      commencerBtn.click();
    }
  });
  finaliserBtn.addEventListener("click", savePoem);

  recommencerBtn.addEventListener("click", resetPoemInterface);

  // Fonctionnalité pour ajouter manuellement un saut de ligne
  document.addEventListener("keydown", function (e) {
    // Si on est en train d'écrire un poème et qu'on appuie sur Ctrl+Entrée
    if (
      poemConstruction.style.display !== "none" &&
      e.ctrlKey &&
      e.key === "Enter"
    ) {
      addLineBreak();
      e.preventDefault();
    }
  });
  
  // Event listeners pour les boutons de la barre d'outils
  if (addLinebreakBtn) {
    addLinebreakBtn.addEventListener("click", addLineBreak);
  }
  
  if (addSpaceBtn) {
    addSpaceBtn.addEventListener("click", addSpace);
  }
  
  if (undoWordBtn) {
    undoWordBtn.addEventListener("click", undoLastAction);
  }
  
  if (refreshSuggestionsBtn) {
    refreshSuggestionsBtn.addEventListener("click", function() {
      refreshSuggestions();
    });
  }
;
