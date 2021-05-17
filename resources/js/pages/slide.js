var targetPayout = 5;
$.game('slide', function (container, overviewData) {
  if (!$.isOverview(overviewData)) {
    var card = function card(mul) {
      return "<div class=\"slide_card\" data-slide=\"".concat(mul, "\">\n                <div class=\"hexagon\">x").concat(mul.toFixed(2), "</div>\n                <div class=\"slide_card_footer\"></div>\n            </div> ");
    };

    var clone = function clone() {
      for (var i = 0; i < 2; i++) {
        $('.slide_container_row').append($('.slide_container_row').children().clone(true, true));
      }
    };

    var spin = function spin(id, size) {
      $(".slide_container_row").css({
        position: 'relative',
        left: 0
      });
      var amount = size * 2,
          gw = $('.slide_card').outerWidth(true),
          center = gw / 2,
          containerCenter = $('.slide_container').outerWidth(true) / 2;

      $('.slide_container_row').stop().animate({
        left: "-=".concat(amount * gw + id * gw - containerCenter + center)
      }, 6000);
    };

    container.append("\n            <div class=\"slideCustomHistory\"></div>\n            <div class=\"slide_container_line\"></div>\n            <div class=\"slide_container\">\n                <div class=\"slide_container_row\"></div>\n            </div>\n        ");
    var hex = {
      0: ['#ffc000', '#997300'],
      1: ['#ffa808', '#a16800'],
      2: ['#ffa808', '#a95b00'],
      3: ['#ff9010', '#a95b00'],
      4: ['#ff7818', '#914209'],
      5: ['#ff6020', '#b93500'],
      6: ['#ff4827', '#c01d00'],
      7: ['#ff302f', '#c80100'],
      8: ['#ff1837', '#91071c'],
      9: ['#ff003f', '#990026']
    };

    _.forEach($.gameData().history, function (m) {
      var color = hex[0];
      if (m.multiplier > 250) color = hex[9];else if (m.multiplier > 100) color = hex[8];else if (m.multiplier > 10) color = hex[7];else if (m.multiplier > 7) color = hex[6];else if (m.multiplier > 5) color = hex[5];else if (m.multiplier > 4) color = hex[4];else if (m.multiplier > 3) color = hex[3];else if (m.multiplier > 2) color = hex[2];else if (m.multiplier > 1) color = hex[1];
      $('.slideCustomHistory').append($.customHistoryPopover($("<div class=\"slideCustomHistoryElement\" style=\"cursor: pointer; background: ".concat(color[0], "; border-bottom: 1px solid ").concat(color[1], "\">").concat(m.multiplier.toFixed(2) + 'x', "</div>")), {
        serverSeed: m.server_seed,
        clientSeed: m.client_seed,
        nonce: m.nonce
      }));
    });

    _.forEach($.gameData().data.slides, function (slide) {
      return $('.slide_container_row').append(card(slide));
    });

    clone();
    if ($.gameData().timestamp === -1) spin($.gameData().data.index, $.gameData().data.slides.length);else {
      var now = +new Date() / 1000;
      var left = parseInt(now - $.gameData().timestamp);
      if (left >= 0 && left <= 6) setRoundTimer(left);
    }
    $.multiplayer(function (event, data) {
      switch (event) {
        case 'MultiplayerBettingStateChange':
          if ($.currentBettingType() === 'manual') $('.play-button').toggleClass('disabled', !data.state);
          break;

        case 'MultiplayerGameBet':
          $.multiplayerBets().add(data.user, data.game);
          break;

        case 'MultiplayerGameFinished':
          $('.slide_container_row').html('');
          _.forEach(data.data.slides, function (slide) {
            return $('.slide_container_row').append(card(slide));
          });

          clone();
          spin(data.data.index, data.data.slides.length);
          setTimeout(function () {
            $("[data-slide=\"".concat(data.data._result, "\"]")).addClass('selected');
            var color = hex[0];
            if (parseFloat(data.data._result) > 1) color = hex[1];
            if (parseFloat(data.data._result) > 2) color = hex[2];
            if (parseFloat(data.data._result) > 3) color = hex[3];
            if (parseFloat(data.data._result) > 4) color = hex[4];
            if (parseFloat(data.data._result) > 5) color = hex[5];
            if (parseFloat(data.data._result) > 7) color = hex[6];
            if (parseFloat(data.data._result) > 10) color = hex[7];
            if (parseFloat(data.data._result) > 100) color = hex[8];
            if (parseFloat(data.data._result) > 250) color = hex[9];
            var el = $.customHistoryPopover($("<div class=\"slideCustomHistoryElement\" style=\"background: ".concat(color[0], "; border-bottom: 1px solid ").concat(color[1], "\">").concat(parseFloat(data.data._result).toFixed(2) + 'x', "</div>")), {
              clientSeed: data.client_seed,
              serverSeed: data.server_seed,
              nonce: data.nonce
            });
            $('.slideCustomHistory').prepend(el);
            el.hide().slideDown('fast');
            $('.slideCustomHistoryElement:nth-child(3)').remove();
			$.blockPlayButton(false);
          }, 6000);
          break;

        case 'MultiplayerTimerStart':
          $.multiplayerBets().clear();
          setRoundTimer(6);
          break;
      }
    });
  }
}, function () {
  return {
    target: targetPayout
  };
}, function () {
  if ($.currentBettingType() === 'manual') $('.play-button').addClass('disabled');
}, function (error) {
  $.error($.lang('general.error.unknown_error', {
    'code': error
  }));
});

var setRoundTimer = function setRoundTimer(seconds) {
  seconds *= 1000;
  $('.slide-time').hide().stop().css({
    'width': '100%'
  }).fadeIn('fast').animate({
    'width': '0%'
  }, {
    duration: seconds,
    easing: 'linear'
  });
};

$.on('/game/slide', function () {
  $.render('slide');
  $.sidebar(function (component) {
    component.bet();
    component.history('slide');
    $.history().add(function (e) {
      return e.addClass('slide-time');
    });
    //component.autoBets();
    component.play();
    component.multiplayerBets();
        component.footer().sound().stats();

    _.forEach($.gameData().players, function (data) {
      $.multiplayerBets().add(data.user, data.game);
    });
  });
}, ['/css/pages/slide.css']); 