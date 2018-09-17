let currentScroll = 0;
let canScroll = true; // if false, blocks browser from scrolling - used for non-touch devices and desktops (touch devices ignore this)
let smallDevice = window.matchMedia("only screen and (max-width: 760px)");
let portfolio1Shown = false;
let portfolio2Shown = false;
let portfolio3Shown = false;

function isElementInViewport(el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
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

// function to smooth scroll to elements on link clicks
$(function () {
    $('a[href*=\\#]:not([href=\\#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            let target = $(this.hash);

            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {

                canScroll = false;

                // determine where we'll scroll
                let newScroll = 0;
                if (!(smallDevice.matches || Modernizr.touch)) {
                    newScroll = target.offset().top - $(".navbar").height();
                    // for desktops, we play with the nav bar padding
                    if (newScroll < ($("#profile").offset().top - $(".navbar").height() - 150)) {
                        $('.navbar').animate({'padding-top': "30px"}, 500);
                        $('.navbar').css('background', 'none');
                        $('.navbar').css('border-color', 'transparent');
                    }
                    else {
                        $('.navbar').animate({'padding-top': "0px"}, 500);
                        $('.navbar').css('background', '#0D0D0D');
                        $('.navbar').css('border-color', '#0A0A0A');
                    }
                }
                else {
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

$(document).ready(function () {

    (function getGitHubRepos() {
        let reposURL = "https://api.github.com/users/ameer157/repos?callback=allow";
        $.getJSON(reposURL + '&callback=?', (data) => {
            addGitHubRepos(data);
        })
    })();

    function addGitHubRepos(data) {
        $.each(data.data, (index, repos) => {
            let repo = $('<div class="card"><div class="card-body"><span class="badge"><span class="repo-lang-color ' + repos.language.toLocaleLowerCase() + '"></span> ' + repos.language + '</span><a href=" ' + repos.html_url + ' " target="_blank"><div class="card-header text-left"><h5>' + repos.name + '</h5></div></a><p class="card-text text-left small">' + repos.description + '</p></div></div>');
            repo.prependTo('#repositories');
        })
    }


    (function getBlogPosts() {
        jQuery(function ($) {
            let feedURL = "https://medium.com/feed/@ameer157";
            $("#rss-feeds").rss(feedURL,
                {
                    ssl: true,
                    limit: 8,
                    filterLimit: 8,
                    filter: (entry) => {
                        // Filter out comments and print only blog posts
                        return entry.categories.length > 1
                    },
                    error: () => {
                        $('#blogError').fadeIn("slow");
                    },
                    dateFormat: 'MMM D, YYYY',
                    layoutTemplate: '<div class="row card-deck">{entries}</div>',
                    entryTemplate: '<div class="card"><div class="card-body"><span class="date"><i class="fas fa-clock"></i>{date}</span><a href="{url}" target="_blank"><div class="cover"><i class="fa fa-book-open fa-4x"></i>{teaserImage}</div><h5>{title}</h5></a><div class="card-text"><p>{shortBodyPlain}</p></div></div></div>'
                })
        })
    })();


    $('#submit').click(function (e) {
        e.preventDefault();

        $('.error').hide();

        let theName = $('#name').val();
        let theEmail = $('#email').val();
        let theMessage = $('#message').val();

        if (theName.length == 0) {
            $('#nameError').fadeIn("slow");
        }
        else if (theEmail.length == 0) {
            $('#emailError').fadeIn("slow");
        }
        else if (theMessage.length == 0) {
            $('#messageError').fadeIn("slow");
        }
        else {
            $('#spinner').fadeIn().css("display", "inline-block");
            $.post("php/send.php", {name: theName, email: theEmail, message: theMessage})
                .done(function (data) {

                    $('#form-container').fadeOut("slow", function () {
                        $('#success').fadeIn();
                    });

                });
        }

    });

    // for collapsable nav bar, hide the menu when a link is clicked
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });

    // don't let user scroll if we are auto-scrolling
    $('body').on({
        'mousewheel': function (e) {
            if (!canScroll) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    });

    // do not auto scroll for mobile
    if (smallDevice.matches || Modernizr.touch) {
        portfolio1Shown = true;
        $('#portfolio-row-1').css('opacity', 1);

        portfolio2Shown = true;
        $('#portfolio-row-2').css('opacity', 1);

        portfolio3Shown = true;
        $('#portfolio-row-3').css('opacity', 1);
    }


    $(window).scroll(function (e) {

        // do not auto scroll for mobile
        if (smallDevice.matches || Modernizr.touch) {
            return;
        }

        // if we are blocking scrolling, just do this
        if (!canScroll) {
            e.preventDefault();
            e.stopPropagation();
            currentScroll = $(window).scrollTop();
            return false;
        }

        // show portfolio section when it's in viewport
        if (!portfolio1Shown && isElementInViewport($('#portfolio-row-1 img'))) {
            portfolio1Shown = true;
            $('#portfolio-row-1').animate({opacity: 1}, 1000);
        }

        if (!portfolio2Shown && isElementInViewport($('#portfolio-row-2 img'))) {
            portfolio2Shown = true;
            $('#portfolio-row-2').animate({opacity: 1}, 1000);
        }

        if (!portfolio3Shown && isElementInViewport($('#portfolio-row-3 img'))) {
            portfolio3Shown = true;
            $('#portfolio-row-3').animate({opacity: 1}, 1000);
        }


        // if user starts scrolling and we're at the top, auto scroll to the first section
        if ((canScroll) && (currentScroll == 0)) {
            canScroll = false;
            $('.navbar').animate({'padding-top': "0px"}, 500).css('background', '#0D0D0D').css('box-shadow', '0px 1px 2px #020202');
            $('html, body').animate({
                scrollTop: $("#profile").offset().top - $(".navbar").height()
            }, 500, function () {
                canScroll = true;
            });
        }
        // if we are above the first section and scrolling up, auto scroll to top of page
        else if ((canScroll) && (currentScroll > 0) && ($(window).scrollTop() < ($("#profile").offset().top - $(".navbar").height() - 150))) {
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
    $(".navbar-brand").click(function (e) {
        e.preventDefault();
        if (!(smallDevice.matches || Modernizr.touch)) {
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
