$(function () {
  //registration
  $('.js-confirm').click(function(e) {
    e.preventDefault();
    $(this).closest('.splash-main').addClass('confirm');
    $(this).closest('.user-type').hide();
    $('.confirmation').removeClass('hidden');
  });
  
  $('.js-confirm-cancel').click(function(e) {
    e.preventDefault();
    $('.confirmation').addClass('hidden');
    $('.splash-main').removeClass('confirm');
    $('.user-type').show();
  });
  
  
  //tooltip initialization
  $('[data-toggle="tooltip"]').tooltip();
  
  //slide menu
  $('nav').slideAndSwipe();


  //profile:
  if ($('#select-metric').length > 0) {
    $('#select-metric').click(function (e) {
      var input = $(e.target).find('input');
      if (input.length > 0) {
        //$(this).parent().find('.errors').remove();
        if (input.val() == 1) { //metric
          var hft = $('#heightFt').val();
          var hin = $('#heightIn').val();
          if (hft > 0 && hin > 0) {
            var h = Math.round(hin * 2.54 + hft * 30.48);
            $('#height').val(h);
          }

          $('.metric').removeClass('hide');
          $('.imperial').addClass('hide');
        } else {
          var h = $('#height').val();
          if (h > 0) {
            var hin = Math.round(h / 100 * 39.3700787);
            var hft = Math.floor(hin / 12);
            hin = hin % 12;

            $('#heightFt').val(hft);
            $('#heightIn').val(hin);
          }

          $('.metric').addClass('hide');
          $('.imperial').removeClass('hide');
        }
      }
    });
    $('#select-metric label.active').click();

    $('#select-cuddler label').click(function (e) {
      if ($(this).attr('input_value') == 0) {
        $('.cuddle-specific').hide();
      } else {
        $('.cuddle-specific').show(300);
      }
    });
    $('#select-cuddler label.active').click();

    $('.form-clear').focus(function (e) {
      this.select();
    });

  }

  $('form.validated-form :input').blur(function (e) {
    elem = this;
    form = this.form;
    if (elem && (elem.tagName == 'BUTTON' || elem.hasClass('novalidate')))
      return true;

    var data = {_validate: true};
    $(form).find(":input").each(function ()
    {
      data[$(this).attr('name')] = $(this).val();
    });
    //console.log(data);

    url = form.action;

    $.post(url, data, function (resp)
    {

      $('#error').remove();

      if (resp['form']) {
        formError($(form), resp['form']);
      }

      //$("#"+id).parent().find('.validate-errors').remove();
      if (resp && resp['errors']) {
        resp = resp['errors'];
        name = elem.name;
        message = getErrorHtml(resp[name], name);
        if (message) {
          $(elem).addClass('invalid');
          $(elem).parent().prepend(message);
          formError($(form), 'You still have fields to fill out');
        } else {
          $(elem).addClass('valid');
        }
      }
    }, 'json');
    /*.fail(function() {
     formError($(form), 'An internal error occured. Please try again');
     });*/
  }).focus(function (e) {
    $('#form-error').remove();
    $(this.form).find('input[type="submit"]').show();
    $(this).removeClass('invalid').parent().find('ul').remove();
  });

  $('form.validated-form').submit(function (e) {

    $('#form-error').remove();
    $('#error').remove();


    if ($(this).find('.errors:visible').length > 0) {
      formError($(this), 'You still have fields to fill out');
      scrollToElement('.errors:visible', 1000);
      e.preventDefault();
      return false;
    }
  });

  if ($('#error').length > 0 && $('form.validated-form').length > 0) {
    formError($('form.validated-form'), 'You still have fields to fill out');
    scrollToElement('.errors:visible', 1000);
  }




  $('#forgot').on('shown.bs.modal', function (e) {
    var email = $('#loginForm #email').val();
    if (email)
      $('#forgot-email').val(email);
  });

  $('#forgot-form').on('submit', function (e) {
    e.preventDefault();

    var email = $('#forgot-email').val();
    $('#forgot-email-text').text(email);
    $('#email').val(email);

    $.ajax({
      type: 'GET',
      url: '/user/forgot',
      data: {email: email},
      async: true,
      success: function (resp) {
        if (resp == 'OK') {
          $('#forgot').modal('hide');
          $('#forgot-confirm').modal('show');
        } else {
          $('#forgot').modal('hide');
          $('#forgot-error').modal('show');
        }
      },
      error: function () {
        $('#forgot').modal('hide');
        $('#forgot-error').modal('show');
      }
    });

  });

  $('#login').on('shown.bs.modal', function () {
    var returnUrl = window.location.href.toString().split(window.location.host)[1];
    $('#login-url').attr('value', returnUrl);
  });

  $('#register').on('shown.bs.modal', function () {
    var returnUrl = window.location.href.toString().split(window.location.host)[1];
    $('#register-url').attr('value', returnUrl);
    reCaptchaCreate();
  });

  //notifications form
  if ($('#select-unsubscribe').length > 0) {
    $('#select-unsubscribe').click(function (e) {
      var input = $(e.target).find('input');
      if (input.length > 0) {
        if (input.val() == 1) { //ubsubscribe
          $('.btn-group').not('#select-unsubscribe').find('.btn').addClass('disabled');
        } else {
          $('.btn-group').not('#select-unsubscribe').find('.btn').removeClass('disabled');
        }
      }
    });
    $('#select-unsubscribe label.active').click();
  }


  //view user

  //fav
  bindUserMenuEvents();

  //MAP:


  //stop video when closing modal
  $("#video").on('hidden.bs.modal', function () {
    $("#video iframe").attr("src", $("#video iframe").attr("src"));
  });
  $("#video2").on('hidden.bs.modal', function () {
    $("#video2 iframe").attr("src", $("#video2 iframe").attr("src"));
  });

  //clear input field
  $('#location_text').on('keyup', function () {
    if ($(this).val() !== '') {
      $('#clear-location').show();
    } else {
      $('#clear-location').hide();
    }
  });

  $('#clear-location').click(function () {
    $('#location_text').val('');
    $(this).hide();
  });

  $('#location-dropdown').click(function () {
    mapApiInit();
  });


  //slide menu
  $('.menu-link').bigSlide();


  //dropdown filters
  $('.dropdown-filter>a').on('click', function () {
    if ($(this).parent().hasClass('open')) {
      $(this).parent().removeClass('open');
      $('ul.dropdown-menu').addClass('hidden');
      $('.list').removeClass('fade-on');
    } else {
      $('.dropdown-filter').removeClass('open');
      $(this).parent().addClass('open');
      $('.dropdown-lvl2').addClass('hidden');
      $('ul.dropdown-menu').removeClass('hidden');
      $('.list').addClass('fade-on');
    }
  });

  $('.dropdown-filter .close-btn').on('click', function () {
    $(this).closest('.dropdown-filter').removeClass('open');
  });

  $('.dropdown-filter .footer a').click(function () {
    $('.dropdown-filter').removeClass('open');
    $('.dropdown-menu').removeClass('hidden');
    $('.dropdown-lvl2').addClass('hidden');
    $('.list').removeClass('fade-on');
  });

  $('.dropdown-filter .dropdown-menu>li>a').click(function () {
    var menu = $(this).attr('data-target');
    $(menu).removeClass('hidden');
    $(this).parent().parent().addClass('hidden');
  });

  //dropdowns
  $('ul.dropdown-menu li').click(function (e) {
    e.preventDefault();

    var txt = $(this).text();
    var selector = $(this).parent().attr('title_selector');
    if (selector) {
      var obj = $('#' + selector);
    } else {
      var obj = $(this).parent().parent().find('.form-control span');
      if (obj.length == 0)
        var obj = $(this).parent().parent().parent().parent().find('.form-control span');
    }
    obj.text(txt);

//        if (obj.parent().attr('data-toggle') == 'dropdown') {
//            if (obj.parent().parent().hasClass('keep-open'))
//                obj.parent().parent().data('closable', true);
//            obj.parent().dropdown('toggle');
//        }

    var key = $(this).parent().attr('select_key');
    if (key) {
      applyFilter(key, $(this).attr('select_value'));
    } else {
      var selector = $(this).parent().attr('input_selector');
      if (selector) {
        var obj = $('#' + selector);
      } else {
        var obj = $(this).parent().parent().parent().find('input');
      }
      obj.val($(this).attr('select_value'));
      $(this).parent().parent().parent().find('ul.errors').remove();
    }
  });



  //toggle mobile tooltip
  $('.tip').click(function (e) {
    e.preventDefault();
    $('.tip').find('.tip-box').addClass('hidden');
    $(this).find('.tip-box').toggleClass('hidden');
    setTimeout(function () {
      $('.tip').find('.tip-box').addClass('hidden');
    }, 7000);


  });


});


/*! bigSlide - v0.4.3 - 2014-01-25
 * http://ascott1.github.io/bigSlide.js/
 * Copyright (c) 2014 Adam D. Scott; Licensed MIT */
(function ($) {
  'use strict';

  $.fn.bigSlide = function (options) {

    var settings = $.extend({
      'menu': ('#menu'),
      'push': ('.push'),
      'side': 'right',
      'menuWidth': '450px',
      'speed': '300'
    }, options);

    var menuLink = this,
            menu = $(settings.menu),
            push = $(settings.push),
            width = settings.menuWidth;

    var positionOffScreen = {
      'position': 'fixed',
      'top': '0',
      'bottom': '0',
      'width': settings.menuWidth,
      'height': '100%'
    };

    var animateSlide = {
      '-webkit-transition': settings.side + ' ' + settings.speed + 'ms ease',
      '-moz-transition': settings.side + ' ' + settings.speed + 'ms ease',
      '-ms-transition': settings.side + ' ' + settings.speed + 'ms ease',
      '-o-transition': settings.side + ' ' + settings.speed + 'ms ease',
      'transition': settings.side + ' ' + settings.speed + 'ms ease'
    };

    menu.css(positionOffScreen);
    menu.css(settings.side, '-' + settings.menuWidth);
    push.css(settings.side, '0');
    menu.css(animateSlide);
    push.css(animateSlide);

    menu._state = 'closed';

    menu.open = function () {
      menu.removeClass('hidden');
      menu._state = 'open';
      menu.css(settings.side, '0');
      push.css(settings.side, width);

      var top = document.documentElement.scrollTop;
      if (!top)
        top = window.pageYOffset;
      menu.css('top', top);

      setTimeout(function () {
        $('.wrap.push').addClass('fade-on');
        $('.wrap.push').click(menu.close);
        $('.header-main').css('margin-left', '0').css('left', 'inherit').css('position', 'relative');
        $('.main-container').css('margin-top', '0');

        //$("html, body").animate({ scrollTop: 0 }, "slow");
      }, 150);
    };

    menu.close = function () {
      $('.wrap.push').unbind('click');

      menu._state = 'closed';
      menu.css(settings.side, '-' + width);
      push.css(settings.side, '0');

      $('.wrap.push').removeClass('fade-on');
      menu.addClass('hidden');
      $('.header-main').css('margin-left', '-320px').css('left', '50%').css('position', 'fixed');
      $('.main-container').css('margin-top', '120px');
    };

    menuLink.on('click.bigSlide', function (e) {
      e.preventDefault();
      if (menu._state === 'closed') {
        menu.open();
      } else {
        menu.close();
      }
    });

//        menuLink.on('touchend', function(e) {
//            menuLink.trigger('click.bigSlide');
//            e.preventDefault();
//        });

    return menu;
  };

}(jQuery));


function getErrorHtml(formErrors, name)
{
  var count = 0;

  var o = '<ul class="errors" id="errors-' + name + '">';
  for (errorKey in formErrors)
  {
    o += '<li>' + formErrors[errorKey] + '</li>';
    count++;
  }
  o += '</ul>';

  if (count > 0) {
    //$("#"+id).addClass('invalid');
    return o;
  } else {
    //$("#"+id).addClass('valid');
  }


}

function formError(form, msg) {
  $('#form-error').remove();
  form.append('<div class="footer" id="form-error"><a class="btn btn-red btn-block">' + (msg) + '</a></div>');
  form.find('input[type="submit"]').hide();
}

function scrollToElement(selector, time, verticalOffset) {
  time = typeof (time) != 'undefined' ? time : 1000;
  verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : 0;
  element = $(selector);
  console.log(element);
  offset = element.offset();
  if (offset == undefined) {
    return;
  }
  offsetTop = offset.top + verticalOffset;
  $('html, body').animate({
    scrollTop: offsetTop
  }, time);
}

function bindListEvents() { //TODO: optimize
  console.log('bindListEvents');

  //tooltip position
  $('.tt').on('mouseenter', function () {
    if ($(this).hasClass('tt-top')) {
      var tipw = $(this).find('.tip').width() - 12;
      $(this).find('.tip').css('left', '-' + tipw / 2 + 'px');
    } else if ($(this).hasClass('tt-left')) {
      $(this).find('.tip').css('right', '40px').css('left', 'inherit');

    } else {
      $(this).find('.tip').css('left', '40px');
    }
  }).on('mouseleave', function () {
    $(this).find('.tip').not('.tip-always').css('left', '-3000px').css('right', 'inherit');
  });

  $('.favourite-btn').unbind('click').click(function (e) {
    e.preventDefault();

    var id = $(this).attr('user');
    var icon = $(this).find('i');
    var tip = $(this).find('span');

    if (icon.hasClass('active')) { //unfav
      $('.favourite-btn[user="' + id + '"] i').removeClass('active');
      var action = 'unfav';
      if (tip.length > 0) {
        tip.text('Add to favorites');
      }
    } else {
      $('.favourite-btn[user="' + id + '"] i').addClass('active');
      var action = 'fav';
      if (tip.length > 0) {
        tip.text('Remove from favorites');
      }
    }


    $.ajax({
      type: 'GET',
      url: '/favourite/' + action,
      data: {id: id},
      async: true});
  });

  $('.filters-reset').click(function (e) {
    e.preventDefault();

    $('#location-dropdown').removeClass('open');
    $('#distance-dropdown').removeClass('open');
    $('#filters-dropdown').removeClass('open');

    resetFilters();
  });


}

function bindReviewEvent(to) {
  $('.review-star').unbind('click').click(function (e) {
    $.ajax({
      type: 'GET',
      url: '/review/add',
      data: {id: to, rating: $(this).data('rating')}
    });
    $('#reviews-container').addClass('hidden');
    $('#reviews-success').removeClass('hide');
    //$('#leave-review').modal('hide');
    setTimeout(function () {
      $('#reviews-success').fadeOut(1000);
    }, 5000);
  });
}
function bindUserMenuEvents() {
  console.log('bindUserMenuEvents');
  bindListEvents();


  $('#notif').on('shown.bs.modal', function (e) {
    console.log('shown notif');
    userModalReopen = 2;
  });



  //block
  $('.user-block').unbind().click(function (e) {
    e.preventDefault();
    var action = $(this).attr('action');
    if (action == 'block') {
      $(this).find('span').text('Unblock');
      $(this).attr('action', 'unblock');
    } else { //unblock
      $(this).find('span').text('Block');
      $(this).attr('action', 'block');
    }

    $.ajax({
      type: 'GET',
      url: '/user/' + action,
      data: {id: $(this).attr('user')},
      async: true});
  });


  //share locked photos
  $('.share-photos').unbind().click(function (e) {
    e.preventDefault();
    var action = $(this).attr('action');
    var uid = $(this).attr('user');
    if (action == 'share') {
      $('.share-photos[user=' + uid + ']').attr('action', 'unshare').find('span').text('Hide Locked Photos');
    } else { //unshare
      $('.share-photos[user=' + uid + ']').attr('action', 'share').find('span').text('Share Locked Photos');

      if ($(this).hasClass('share-page')) {
        $(this).parent().parent().fadeOut();
      }
    }

    $.ajax({
      type: 'GET',
      url: '/user/' + action,
      data: {id: uid},
      async: true,
      success: function () {
        if (typeof selectUser === 'function') {
          to = 0;
          setTimeout(selectUser, 750);
        }
      }
    });
  });


  //profile slides
  if ($('.swiper-container .swiper-slide').length > 3) {
    var mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      loopedSlides: $('.swiper-container .swiper-slide').length,
      roundLengths: true,
      //loopAdditionalSlides: 4,
      cssWidthAndHeight: true,
      //loop: true,
      grabCursor: true
    });
  }
  ;

  $('.swiper-slide-image').unbind().click(function (e) {
    e.preventDefault();

    $('img.lazy').each(function () {
      this.src = $(this).data('original');
    });

    userModalReopen = 2;

    var id = $(this).data('id');
    //console.log(mySwiper2.slideSize);
    mySwiper2.swipeTo(id);

    //work around weird bug in idangerous
    if ($(mySwiper2.activeSlide()).data('id') != id) {
      mySwiper2.swipeTo(id - 1);
    }

    if ($('#user-modal').length > 0) { //modal in a modal
      $('#gallery').modal({backdrop: false});
    } else {
      $('#gallery').modal();
    }



    $('#slidecur').text(mySwiper2.activeLoopIndex + 1);
    $('#slidetot').text(mySwiper2.slides.length - 2);
  });

  $('#prevSlide').unbind().on('click', function () {
    mySwiper2.swipePrev();
    $('#slidecur').text(mySwiper2.activeLoopIndex + 1);
  });
  $('#nextSlide').unbind().on('click', function () {
    mySwiper2.swipeNext();
    $('#slidecur').text(mySwiper2.activeLoopIndex + 1);
  });

  $("#gallery").unbind().on('keydown', function (e) {
    if (e.keyCode == 37) {
      mySwiper2.swipePrev();
      $('#slidecur').text(mySwiper2.activeLoopIndex + 1);
    }
    if (e.keyCode == 39) {
      mySwiper2.swipeNext();
      $('#slidecur').text(mySwiper2.activeLoopIndex + 1);
    }
  });

//    var mySwiper2 = new Swiper('.swiper-container2', {
//        loop: true,
//        grabCursor: true,
//        slidesPerView: 1,
//        onTouchEnd: function() {
//            $('#slidecur').text(mySwiper2.activeLoopIndex + 1);
//        }
//    });

  //reviews
  $('#reviews').mouseenter(function (e) {
    if ($('#reviews-container').hasClass('hide')) {
      $('#reviews-container').removeClass('hide');
      $('#reviews-preloader').removeClass('hide');

      var to = $(this).data('id');
      $.ajax({
        type: 'GET',
        url: '/review/status',
        data: {id: to},
        async: true,
        dataType: 'json',
        success: function (resp) {
          $('#reviews-preloader').addClass('hide');
          $('#reviews-success').addClass('hide');
          if (resp['error']) {
            $('#reviews-error').removeClass('hide');
          } else if (resp['verified']) {
            $('#reviews-verified').removeClass('hide');
          } else if (resp['messages']) {
            $('#reviews-messages').removeClass('hide');
          } else {
            //allowed
            if (resp['rating'] > 0) {
              $('#review-caption').text('Change review?');
              $('#star' + resp['rating']).prop('checked', true); //preselect
            } else {
              $('#review-caption').text('Leave a review?');
            }

            $('#reviews-allowed').removeClass('hide');

            bindReviewEvent(to);
          }

        },
        error: function () {
          $('#reviews-preloader').addClass('hide');
          $('#reviews-container').addClass('hide');
        }
      });

    }
  });

  $('#review-link-mobile').click(function (e) {
    e.preventDefault();

    var url = $(this).attr('href');

    $('#reviews-body-preloader').removeClass('hide');
    $('#reviews-body').html('');
    $('#reviews').modal('show');
    userModalReopen = 2;


    $.ajax({
      type: 'GET',
      url: url,
      async: true,
      success: function (resp) {
        $('#reviews-body-preloader').addClass('hide');
        $('#reviews-body').html(resp);
      },
      error: function () {
        $('#reviews-body-preloader').addClass('hide');
      }
    });

  });

  $('#reviews-mobile').click(function (e) {
    e.preventDefault();

    if ($('#reviews-preloader').hasClass('hide')) {
      $('#reviews-preloader').removeClass('hide');

      var to = $(this).data('id');
      $.ajax({
        type: 'GET',
        url: '/review/status',
        data: {id: to},
        async: true,
        dataType: 'json',
        success: function (resp) {
          $('#reviews-preloader').addClass('hide');

          if (resp['error']) {
            $('#reviews-container').removeClass('hidden');
            $('#reviews-error').removeClass('hide');
          } else if (resp['verified']) {
            $('#reviews-container').removeClass('hidden');
            $('#reviews-verified').removeClass('hide');
          } else if (resp['messages']) {
            $('#reviews-container').removeClass('hidden');
            $('#reviews-messages').removeClass('hide');
          } else {
            //allowed
            if (resp['rating'] > 0) {
              $('#review-caption').text('Change review?');
              $('#star' + resp['rating']).prop('checked', true); //preselect
            } else {
              $('#review-caption').text('Leave a review?');
            }

            $('#leave-review').modal('show');
            userModalReopen = 2;

            bindReviewEvent(to);
          }

        },
        error: function () {
          $('#reviews-preloader').addClass('hide');
          $('#reviews-container').addClass('hide');
        }
      });

    }
  });

}

function changeCustomUrl(url, title)
{
  if (typeof window.history.pushState != 'undefined') {
    window.history.pushState({}, 'CuddleUp: ' + title, url);
  }
  ;
}

/**
 * If the browser is capable, tries zero timeout via postMessage (setTimeout can't go faster than 10ms).
 * Otherwise, it falls back to setTimeout(fn, delay) (which is the same as setTimeout(fn, 10) if under 10).
 * @function
 * @param {Function} fn
 * @param {int} delay
 * @example setZeroTimeout(function () { $.ajax('about:blank'); }, 0);
 */
var setZeroTimeout = (function (w) {
  /*return function(fn){
   t = +new Date();
   fn();
   console.log(+new Date() - t, fn.name);
   };*/

  if (w.postMessage) {
    var timeouts = [],
            msg_name = 'asc0tmot',
            // Like setTimeout, but only takes a function argument.  There's
            // no time argument (always zero) and no arguments (you have to
            // use a closure).
            _postTimeout = function (fn) {
              timeouts.push(fn);
              postMessage(msg_name, '*');
            },
            _handleMessage = function (event) {
              if (event.source == w && event.data == msg_name) {
                if (event.stopPropagation) {
                  event.stopPropagation();
                }
                if (timeouts.length) {
                  try {
                    t = +new Date();
                    var fn = timeouts.shift();
                    fn();
                    console.log(+new Date() - t, fn.name);
                  } catch (e) {
                    // Throw in an asynchronous closure to prevent setZeroTimeout from hanging due to error
                    setTimeout((function (e) {
                      return function () {
                        throw e.stack || e;
                      };
                    }(e)), 0);
                  }
                }
                if (timeouts.length) { // more left?
                  postMessage(msg_name, '*');
                }
              }
            };

    if (w.addEventListener) {
      addEventListener('message', _handleMessage, true);
      return _postTimeout;
    } else if (w.attachEvent) {
      attachEvent('onmessage', _handleMessage);
      return _postTimeout;
    }
  }

  return setTimeout;
}(window));