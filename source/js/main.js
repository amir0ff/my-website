let currentScroll = 0;
let canScroll = true; // if false, blocks browser from scrolling - used for non-touch devices and desktops (touch devices ignore this)
let smallDevice = window.matchMedia('only screen and (max-width: 760px)');
/*let portfolio1Shown = false;*/
let portfolio2Shown = false;
let portfolio3Shown = false;

function isElementInViewport(el) {

  //special bonus for those using jQuery
  if (typeof jQuery === 'function' && el instanceof jQuery) {
    el = el[0];
  }

  let rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}

$(function() {
  // Initialize EmailJS
  emailjs.init("uhViB6ixprFe7Rpvz"); // Replace with your actual Public Key from EmailJS dashboard

  // function to smooth scroll to elements on link clicks
  $(function() {
    $('a[href*=\\#]:not([href=\\#])').on('click', function() {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        let target = $(this.hash);

        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {

          canScroll = false;

          // determine where we'll scroll
          let newScroll = 0;
          if (!(smallDevice.matches)) {
            newScroll = target.offset().top - $('.navbar').height();
            // for desktops, we play with the nav bar padding
            if (newScroll < ($('#profile').offset().top - $('.navbar').height() - 150)) {
              $('.navbar').animate({ 'padding-top': '30px' }, 500);
              $('.navbar').css('background', 'none');
              $('.navbar').css('border-color', 'transparent');
            } else {
              $('.navbar').animate({ 'padding-top': '0px' }, 500);
              $('.navbar').css('background', '#0D0D0D');
              $('.navbar').css('border-color', '#0A0A0A');
            }
          } else {
            newScroll = target.offset().top - $('.navbar-collapse:visible').height();
          }

          $('html,body').animate({
            scrollTop: newScroll + 30,
          }, 500, function() {
            canScroll = true;
          });
          return false;
        }
      }
    });
  });

  (function getGitHubRepos() {
    const reposURL = 'https://api.github.com/users/amir0ff/repos?callback=allow';
    $.getJSON(reposURL + '&callback=?', (data) => {
      // Filter out forked repos and the specific repo with clone_url "https://github.com/amir0ff/amir0ff.git"
      const trueRepos = data.data.filter((repo) => 
        !repo.fork && repo.clone_url !== "https://github.com/amir0ff/amir0ff.git"
      );
      // Sort repos by created_at, newest first
      trueRepos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      $.each(trueRepos, (index, repoData) => {
        // Only show language badge if language is present
        let languageBadge = '';
        if (repoData.language) {
          languageBadge = '<span class="badge"><span class="repo-lang-color ' + repoData.language.toLocaleLowerCase() + '"></span> ' + repoData.language + '</span>';
        }
        const repo = $('<div class="card"><div class="card-body">' +
          languageBadge +
          '<a href="' + repoData.html_url + '" target="_blank"><div class="card-header text-left"><h5>' + repoData.name + '</h5></div></a>' +
          '<p class="card-text text-left small">' + repoData.description + '</p></div></div>');
        repo.prependTo('#repositories');
      });
    });
  })();


  (function getBlogPosts() {
    let postsURL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@amir0ff&api_key=czrxuaauatap8cnstfrio4ewqjwklit3ijo2xaya&order_by=pubDate&order_dir=asc&count=14';
    $.getJSON(postsURL, (data) => {
      let filteredPosts = data.items.filter(item => item.categories.length > 0);
      $.each(filteredPosts, (index, posts) => {
        const momentDate = moment(posts.pubDate).format('MMM D, YYYY');
        let formattedText = posts.content.replace(/(<img[^>]+?>|<img>|<\/img>|<p>|<\/p>|<h4>|<\/h4>|<h3>|<\/h3>|<blockquote>|<\/blockquote>|<figure>|<\/figure>|<figcaption>|<\/figcaption>|<a[^>]*>|<strong>|<\/strong>)/img, '').substring(0, 220);
        formattedText += '...';

        let $description = $(posts.description);
        let postCoverImg = $description.find('img').attr('src');
        const post = $('<div class="card"><div class="card-body"><span class="date"><i class="fas fa-clock"></i>' + momentDate + '</span><a href="' + posts.link + '" target="_blank"><div class="cover" style="height:208px;background: url(' + postCoverImg + ') no-repeat center center;background-size: cover;"><i class="fa fa-book-open fa-4x"></i></div><h5>' + posts.title + '</h5></a><div class="card-text">' + formattedText + '</div></div></div>');
        post.prependTo('#feeds');
      });
    });
  })();


  $('#submit').on('click', (event) => {
    event.preventDefault();

    $('.error').hide();

    let sender = $('#name').val();
    let email = $('#email').val();
    let message = $('#message').val();

    if (sender.length === 0) {
      $('#nameError').fadeIn('slow');
    } else if (email.length === 0) {
      $('#emailError').fadeIn('slow');
    } else if (message.length === 0) {
      $('#messageError').fadeIn('slow');
    } else {
      // Check reCAPTCHA
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        alert('Please complete the reCAPTCHA verification.');
        return;
      }

      $('#spinner').fadeIn().css('display', 'inline-block');
      
      // EmailJS integration
      const templateParams = {
        sender: sender,  // Changed from 'name' to 'sender' to match template
        email: email,
        message: message,
        'g-recaptcha-response': recaptchaResponse
      };

      emailjs.send('service_jfz8aoo', 'template_j0y7amc', templateParams)
        .then(() => {
          $('#form-container').fadeOut('slow', () => {
            $('#success').fadeIn();
          });
          grecaptcha.reset(); // Reset reCAPTCHA after successful send
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          alert('Failed to send message. Please try again.');
        })
        .finally(() => {
          $('#spinner').fadeOut();
        });
    }

  });

  // for collapsable nav bar, hide the menu when a link is clicked
  $('.navbar-collapse ul li a').on('click', () => {
    $('.navbar-toggle:visible').trigger('click');
  });

  // don't let user scroll if we are auto-scrolling
  $('body').on({
    'mousewheel': (event) => {
      if (!canScroll) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },
  });

  // do not auto scroll for mobile
  if (smallDevice.matches) {
    /*portfolio1Shown = true;
    $('#portfolio-row-1').css('opacity', 1);*/

    portfolio2Shown = true;
    $('#portfolio-row-2').css('opacity', 1);

    portfolio3Shown = true;
    $('#portfolio-row-3').css('opacity', 1);
  }


  $(window).scroll((event) => {

    // do not auto scroll for mobile
    if (smallDevice.matches) {
      return;
    }

    // if we are blocking scrolling, just do this
    if (!canScroll) {
      event.preventDefault();
      event.stopPropagation();
      currentScroll = $(window).scrollTop();
      return false;
    }

    // show portfolio section when it's in viewport
    /*if (!portfolio1Shown && isElementInViewport($('#portfolio-row-1 img'))) {
        portfolio1Shown = true;
        $('#portfolio-row-1').animate({opacity: 1}, 1000);
    }

    if (!portfolio2Shown && isElementInViewport($('#portfolio-row-2 img'))) {
      portfolio2Shown = true;
      $('#portfolio-row-2').animate({ opacity: 1 }, 1000);
    }

    if (!portfolio3Shown && isElementInViewport($('#portfolio-row-3 img'))) {
      portfolio3Shown = true;
      $('#portfolio-row-3').animate({ opacity: 1 }, 1000);
    }
*/

    // if user starts scrolling and we're at the top, auto scroll to the first section
    if ((canScroll) && (currentScroll === 0)) {
      canScroll = false;
      $('.navbar').animate({ 'padding-top': '0px' }, 500).css('background', '#0D0D0D').css('box-shadow', '0px 1px 2px #020202');
      $('html, body').animate({
        scrollTop: $('#profile').offset().top - $('.navbar').height(),
      }, 550, function() {
        canScroll = true;
      });
    }
    // if we are above the first section and scrolling up, auto scroll to top of page
    else if ((canScroll) && (currentScroll > 0) && ($(window).scrollTop() < ($('#profile').offset().top - $('.navbar').height() - 150))) {
      canScroll = false;
      $('.navbar').animate({ 'padding-top': '30px' }, 500);
      $('.navbar').css('background', 'none');
      $('.navbar').css('box-shadow', 'none');
      $('.navbar').css('border-color', 'transparent');
      $('html, body').animate({
        scrollTop: 0,
      }, 500, () => {
        canScroll = true;
      });
    }
    currentScroll = $(window).scrollTop();

  });


  // if user clicks the logo, auto scroll to top of page
  $('.navbar-brand').on('click', (event) => {
    event.preventDefault();
    if (!(smallDevice.matches)) {
      $('.navbar').animate({ 'padding-top': '30px' }, 500);
      $('.navbar').css('background', 'none');
      $('.navbar').css('box-shadow', 'none');
      $('.navbar').css('border-color', 'transparent');
    }
    canScroll = false;
    $('html, body').animate({
      scrollTop: 0,
    }, 500, function() {
      canScroll = true;
    });
  });

});
