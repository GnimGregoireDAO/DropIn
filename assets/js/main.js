// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true
});

$(document).ready(function() {
    // Smooth scroll for links
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 800);
    });

    // Add hover effect to mission sections
    $('.mission-section').hover(
        function() {
            $(this).addClass('shadow-lg');
        },
        function() {
            $(this).removeClass('shadow-lg');
        }
    );

    // Animate social links on hover
    $('.social-link').hover(
        function() {
            $(this).addClass('pulse');
        },
        function() {
            $(this).removeClass('pulse');
        }
    );

    // Add loading animation
    $(window).on('load', function() {
        $('.container').addClass('fade-in');
    });
});

// Typing effect for header
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
    
    $('.header p').text(letter);
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000);
    } else {
        setTimeout(type, 100);
    }
}());
