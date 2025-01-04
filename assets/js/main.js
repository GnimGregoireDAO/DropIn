// Initialisation de AOS (Animate On Scroll) pour les animations au défilement
AOS.init({
    duration: 1000, // Durée des animations en millisecondes
    once: true // Les animations ne se déclenchent qu'une seule fois
});

$(document).ready(function() {
    // Défilement fluide pour les liens
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 800); // Durée du défilement en millisecondes
    });

    // Effet de survol pour les sections de mission
    $('.mission-section').hover(
        function() {
            $(this).addClass('shadow-lg'); // Ajoute une ombre lors du survol
        },
        function() {
            $(this).removeClass('shadow-lg'); // Retire l'ombre lorsque le survol cesse
        }
    );

    // Animation des liens sociaux au survol
    $('.social-link').hover(
        function() {
            $(this).addClass('pulse'); // Ajoute une animation de pulsation
        },
        function() {
            $(this).removeClass('pulse'); // Retire l'animation de pulsation
        }
    );

    // Animation de chargement
    $(window).on('load', function() {
        $('.container').addClass('fade-in'); // Ajoute une animation de fondu
    });
});

// Effet de saisie pour le texte de l'en-tête
const texts = ['contre le décrochage scolaire', 'pour votre réussite', 'à vos côtés'];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    
    $('.header p').text(letter); // Met à jour le texte de l'en-tête
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000); // Pause de 2 secondes avant de recommencer
    } else {
        setTimeout(type, 100); // Intervalle de 100ms entre chaque lettre
    }
}());
