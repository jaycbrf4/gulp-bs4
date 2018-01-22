$(document).ready(function () {

$('a.nivo').nivoLightbox({effect: 'fade' });

});

// scroll to top
$(window).scroll(function(){
  if ($(this).scrollTop() > 100) {
    $('.scrollup').fadeIn();
    } else {
    $('.scrollup').fadeOut();
}
  }); 
    // function for scroll to top link to scroll to top
    $('.scrollup').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
   });

// init wow.js to trigger animations
new WOW().init();