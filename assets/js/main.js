AOS.init({
    duration: 1000, // Durée des animations en millisecondes
    once: true // Les animations ne se déclenchent qu'une seule fois
});

$(document).ready(function() {
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 800); // Durée du défilement en millisecondes
    });

    $('.mission-section').hover(
        function() {
            $(this).addClass('shadow-lg'); // Ajoute une ombre lors du survol
        },
        function() {
            $(this).removeClass('shadow-lg'); // Retire l'ombre lorsque le survol cesse
        }
    );

    $('.social-link').hover(
        function() {
            $(this).addClass('pulse'); // Ajoute une animation de pulsation
        },
        function() {
            $(this).removeClass('pulse'); // Retire l'animation de pulsation
        }
    );

    $(window).on('load', function() {
        $('.container').addClass('fade-in'); // Ajoute une animation de fondu
    });
});

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
