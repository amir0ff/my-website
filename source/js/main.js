var currentScroll   = 0;
var canScroll       = true; // if false, blocks browser from scrolling - used for non-touch devices and desktops (touch devices ignore this)
var smallDevice     = window.matchMedia("only screen and (max-width: 760px)");
var designs1Shown   = false;
var designs2Shown   = false;
var designs3Shown   = false;


// Bootstrap's Tooltip JS
  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

// function to smooth scroll to elements on link clicks
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);

      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {

        canScroll = false;

        // determine where we'll scroll
        var newScroll = 0;
        if (!(smallDevice.matches || Modernizr.touch))
        {
          newScroll = target.offset().top - $(".navbar").height() ;
          // for desktops, we play with the nav bar padding
          if (newScroll < ($("#profile").offset().top - $(".navbar").height() -150))
          {
            $('.navbar').animate({'padding-top': "30px"}, 500);
            $('.navbar').css('background', 'none');
            $('.navbar').css('border-color', 'transparent');
          }
          else
          {
            $('.navbar').animate({'padding-top': "0px"}, 500);
            $('.navbar').css('background', '#0D0D0D');
            $('.navbar').css('border-color', '#0A0A0A');
          }
        }
        else
        {
          newScroll = target.offset().top - $('.navbar-collapse:visible').height();
        }

        $('html,body').animate({
          scrollTop: newScroll + 30
        }, 500, function () {
          canScroll = true;
        });
        return false;
      }
    }
  });
});


// Sending email script
$( document ).ready(function() {

  $('#submit').click(function(e) {
    e.preventDefault();

    $('.error').hide();

    var theName = $('#name').val();
    var theEmail = $('#email').val();
    var theMessage = $('#message').val();

    if (theName.length == 0)
    {
      $('#nameError').fadeIn("slow");
    }
    else if (theEmail.length == 0)
    {
      $('#emailError').fadeIn("slow");
    }
    else if (theMessage.length == 0)
    {
      $('#messageError').fadeIn("slow");
    }
    else
    {
      $('#spinner').fadeIn().css("display","inline-block");
      $.post( "php/send.php", { name: theName, email: theEmail, message: theMessage } )
      .done(function( data ) {

        $('#form-container').fadeOut("slow", function() {
            $('#success').fadeIn();
          });

      });
    }

  });

  // for collapsable nav bar, hide the menu when a link is clicked
  $('.navbar-collapse ul li a').click(function(){
    $('.navbar-toggle:visible').click();
  });

  // don't let user scroll if we are auto-scrolling
  $('body').on({'mousewheel': function(e) {
      if (!canScroll)
      {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  })

  // do not auto scroll for mobile
  if (smallDevice.matches || Modernizr.touch) {
      designs1Shown = true;
      $('#showcase-row-1').css('opacity', 1);

      designs2Shown = true;
      $('#showcase-row-2').css('opacity', 1);

      designs3Shown = true;
      $('#showcase-row-3').css('opacity', 1);
  }


  $(window).scroll(function(e) {

    // do not auto scroll for mobile
    if (smallDevice.matches || Modernizr.touch) {
        return;
    }

    // if we are blocking scrolling, just do this
    if (!canScroll)
    {
      e.preventDefault();
      e.stopPropagation();
      currentScroll = $(window).scrollTop();
      return false;
    }

    // show designs section when it's in viewport
    if (!designs1Shown && isElementInViewport($('#showcase-row-1 img'))) {
        designs1Shown = true;
        $('#showcase-row-1').animate({opacity: 1}, 1000);
    }

    if (!designs2Shown && isElementInViewport($('#showcase-row-2 img'))) {
        designs2Shown = true;
        $('#showcase-row-2').animate({opacity: 1}, 1000);
    }

    if (!designs3Shown && isElementInViewport($('#showcase-row-3 img'))) {
        designs3Shown = true;
        $('#showcase-row-3').animate({opacity: 1}, 1000);
    }


    // if user starts scrolling and we're at the top, auto scroll to the first section
    if ((canScroll) && (currentScroll == 0))
    {
      canScroll = false;
      $('.navbar').animate({'padding-top': "0px"}, 500);
      $('.navbar').css('background', '#0D0D0D');
      $('.navbar').css('box-shadow', '0px 1px 2px #020202');
      $('html, body').animate({
          scrollTop: $("#profile").offset().top - $(".navbar").height() + 5
        }, 500, function () {
        canScroll = true;
      });
    }
    // if we are above the first section and scrolling up, auto scroll to top of page
    else if ((canScroll) && ( currentScroll > 0) && ($(window).scrollTop() < ($("#profile").offset().top - $(".navbar").height() -150)))
    {
      canScroll = false;
      $('.navbar').animate({'padding-top': "30px"}, 500);
      $('.navbar').css('background', 'none');
      $('.navbar').css('box-shadow', 'none');
      $('.navbar').css('border-color', 'transparent');
      $('html, body').animate({
        scrollTop: 0
      }, 500, function () {
        canScroll = true;
      });
    }
    currentScroll = $(window).scrollTop();

  });


  // if user clicks the logo, auto scroll to top of page
  $(".navbar-brand").click(function(e) {
      e.preventDefault();
      if (!(smallDevice.matches || Modernizr.touch))
      {
        $('.navbar').animate({'padding-top': "30px"}, 500);
        $('.navbar').css('background', 'none');
        $('.navbar').css('box-shadow', 'none');
        $('.navbar').css('border-color', 'transparent');
      }
      canScroll = false;
      $('html, body').animate({
       scrollTop: 0
      }, 500, function () {
        canScroll = true;
      });
  });

});
