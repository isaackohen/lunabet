var debug = false,
    width = 800,
    height = 600,
    in_progress_color = '#ffcc00',
    crash_color = '#ff1f44',
    cashoutTexts = [];
var crashed = false,
    placedBetThisRound = false,
    betValue,
    startTimestamp = 0,
    currentMultiplier = 1,
    autoCashout = 2,
    id;
var linePosition = {
  x: 0,
  y: 0
};
var panZoom = {
  x: 50,
  y: 50,
  scale: 1,
  apply: function apply(ctx) {
    ctx.setTransform(this.scale, 0, 0, this.scale, this.x, this.y);
  },
  reset: function reset() {
    this.x = 50;
    this.y = 50;
    this.scale = 1;
  }
};
$.game('crash', function (container, overviewData) {
  if (!$.isOverview(overviewData)) {
    id = $.randomId();
    container.append("<div class=\"crashCustomHistory\"></div>");
    container.append("\n            <canvas width=\"800\" height=\"600\"></canvas>\n            <div class=\"crashMultiplayerTable\"></div>\n        ");
    var ctx = container.find('canvas')[0].getContext('2d');
    var autobetTake = null;
    $.extendedAutoBetHandler(function (take) {
      autobetTake = take;
    });
    reset(ctx);

    var updateMultiplier = function updateMultiplier() {
      if ($.currentBettingType() === 'manual') $('.play-button').html($.lang('general.take', {
        value: (betValue * parseFloat(currentMultiplier)).toFixed(8),
        icon: window.Laravel.currency[$.currency()].icon
      }));
    };

    var startGame = function startGame() {
      animatePathDrawing(ctx, 50, height - 50, 350, height - 50, width - 50, 50, 10000);

      if (placedBetThisRound) {
        $('.play-button').removeClass('disabled');
        updateMultiplier();
      }

      function nextMultiplier() {
        var timeInMilliseconds = 0,
            simulation = 1,
            suS = 0,
            diffS = +new Date() / 1000 - startTimestamp;

        while (timeInMilliseconds / 1000 < diffS) {
          simulation += 0.05 / 15 + suS;
          timeInMilliseconds += 2000 / 15 / 3;

          if (simulation >= 5.5) {
            suS += 0.05 / 15;
            timeInMilliseconds += 4000 / 15 / 3;
          }
        } //console.log(`sim ${simulation}`, `tMS ${timeInMilliseconds}`, `diffS ${diffS}`, `suS ${suS}`);


        currentMultiplier = simulation.toFixed(2);

        if (currentMultiplier > 1000) {
          startTimestamp = +new Date();
          currentMultiplier = 1;
        }

        $("[data-update=\"true\"]").html("x".concat(parseFloat(currentMultiplier).toFixed(2)));

        if (placedBetThisRound) {
          updateMultiplier();

          if (parseFloat(currentMultiplier) >= autoCashout) {
            if ($.currentBettingType() === 'manual') $('.play-button').click();else autobetTake();
          }
        }
      }

      let interval = setInterval(function() {
        if (!window.location.pathname.includes('/crash')) return;

        if (crashed) {
          clearInterval(interval);
          return;
        }

        nextMultiplier();
      }, 66);
    };

    startTimestamp = $.gameData()['timestamp'];
    startGame();

    setTimeout(function () {
      return $('.play-button').addClass('disabled');
    }, 100);
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

    _.forEach($.multipliers()[1], function (m) {
      var color = hex[0];
      if (m.multiplier > 250) color = hex[9];else if (m.multiplier > 100) color = hex[8];else if (m.multiplier > 10) color = hex[7];else if (m.multiplier > 7) color = hex[6];else if (m.multiplier > 5) color = hex[5];else if (m.multiplier > 4) color = hex[4];else if (m.multiplier > 3) color = hex[3];else if (m.multiplier > 2) color = hex[2];else if (m.multiplier > 1) color = hex[1];
      $('.crashCustomHistory').append($.customHistoryPopover($("<div class=\"crashCustomHistoryElement\" style=\"background: ".concat(color[0], "; border-bottom: 1px solid ").concat(color[1], "\">").concat(m.multiplier.toFixed(2) + 'x', "</div>")), {
        serverSeed: m.server_seed,
        clientSeed: m.client_seed,
        nonce: m.nonce
      }));
    });

    $.multiplayer(function (event, data) {
      switch (event) {
        case 'MultiplayerBettingStateChange':
          if (!placedBetThisRound && $.currentBettingType() === 'manual') $('.play-button').toggleClass('disabled', !data.state);
          break;

        case 'MultiplayerGameBet':
          $.multiplayerBets().add(data.user, data.game);
          break;

        case 'MultiplayerBetCancellation':
          cashoutTexts.push({
            name: data.user.name,
            alpha: 1,
            multiplier: parseFloat(currentMultiplier).toFixed(2),
            x: linePosition.x,
            y: linePosition.y
          });
          $("[data-players-cashout-id=\"".concat(data.game._id, "\"]")).html("x".concat(parseFloat(currentMultiplier).toFixed(2))).attr('data-update', 'false').addClass('text-success');
          break;

        case 'MultiplayerGameFinished':
          crashed = true;
          $('[data-update="true"]').addClass('text-danger');
          var color = hex[0];
          if (parseFloat(currentMultiplier) > 1) color = hex[1];
          if (parseFloat(currentMultiplier) > 2) color = hex[2];
          if (parseFloat(currentMultiplier) > 3) color = hex[3];
          if (parseFloat(currentMultiplier) > 4) color = hex[4];
          if (parseFloat(currentMultiplier) > 5) color = hex[5];
          if (parseFloat(currentMultiplier) > 7) color = hex[6];
          if (parseFloat(currentMultiplier) > 10) color = hex[7];
          if (parseFloat(currentMultiplier) > 100) color = hex[8];
          if (parseFloat(currentMultiplier) > 250) color = hex[9];
          var el = $.customHistoryPopover($("<div class=\"crashCustomHistoryElement\" style=\"background: ".concat(color[0], "; border-bottom: 1px solid ").concat(color[1], "\">").concat(parseFloat(currentMultiplier).toFixed(2) + 'x', "</div>")), {
            clientSeed: data.client_seed,
            serverSeed: data.server_seed,
            nonce: data.nonce
          });
          $('.crashCustomHistory').prepend(el);
          el.hide().slideDown('fast');
          $('.crashCustomHistoryElement:nth-child(10)').remove();
          if ($.currentBettingType() === 'auto' && $.autoBetActive()) $.autoBetNext();
          setTimeout(function () {
            return reset($('.game-content-crash canvas')[0].getContext('2d'));
          }, 5000);
          break;

        case 'MultiplayerTimerStart':
          var users = $('.crashMultiplayerTable .user');
          setTimeout(function () {
            return users.slideUp('fast');
          }, 3000);
          placedBetThisRound = false;
          $.multiplayerBets().clear();
          setRoundTimer(6, function () {
            startTimestamp = +new Date() / 1000;
            startGame();
          });
          break;
      }
    });
  }
}, function () {
  return {
    'empty': 'data'
  };
}, function (response) {
  if (response === null || placedBetThisRound) {
    placedBetThisRound = false;
    if ($.currentBettingType() === 'manual') $('.play-button').html($.lang('general.play'));
    return;
  }

  placedBetThisRound = true;
  betValue = response.wager;
  if ($.currentBettingType() === 'manual') $('.play-button').addClass('disabled');
}, function (error) {
  $.error($.lang('general.error.unknown_error', {
    'code': error
  }));
});

class Ruler {

    constructor(ctx, x1, y1, x2, y2, isDebug) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = isDebug ? 'yellow' : ($.currentTheme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)');
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        this.ctx = ctx;
    }

    addText(label, x, y, align = 'center') {
        const textSize = 15;
        this.ctx.fillStyle = $.currentTheme() === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.5)';
        this.ctx.textAlign = align;
        this.ctx.font = `${textSize}px Proxima Nova Med`;
        this.ctx.fillText(label, x, y + textSize);
    }

}

function drawGrid(ctx) {
  var scale = 1 / panZoom.scale;
  var gridScale = Math.pow(2, Math.log2(128 * scale) | 0);
  var size = Math.max(width, height) * scale + gridScale * 2;
  var x = ((-panZoom.x * scale - gridScale) / gridScale | 0) * gridScale;
  var y = ((-panZoom.y * scale - gridScale) / gridScale | 0) * gridScale;
  panZoom.apply(ctx);
  ctx.lineWidth = 1;
  ctx.strokeStyle = $.currentTheme() === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();

  for (var i = 0; i < size; i += gridScale) {
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i, y + size);
    ctx.moveTo(x, y + i);
    ctx.lineTo(x + size, y + i);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, 53, height);
  ctx.clearRect(0, 0, width, 53);
  ctx.clearRect(0, height - 53, width, height);
  ctx.clearRect(width - 53, 0, width, height);
}

function redrawCanvas(ctx) {
  drawGrid(ctx);
  var textSize = 80;
  ctx.fillStyle = $.currentTheme() === 'dark' ? 'white' : 'black';
  ctx.font = "".concat(textSize, "px Open Sans");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("".concat(parseFloat(currentMultiplier).toFixed(2), "x"), width / 2, height / 2);
  var rulerY = new Ruler(ctx, 50, 50, 50, height - 50);
  var rulerX = new Ruler(ctx, 48, height - 50, width - 50, height - 50);
  var secondsRunning = startTimestamp === 0 ? 0 : parseInt(+new Date() / 1000 - startTimestamp - 2);
  var timeOffset = secondsRunning < 10 ? 0 : secondsRunning - 10;
  var offset = 30;

  var multiplierOffset = function multiplierOffset(num, i) {
    return secondsRunning < 10 ? num : parseFloat(currentMultiplier) / i;
  };

  rulerY.addText("x".concat(multiplierOffset(2.5, 1).toFixed(1)), 50 / 2, 50);
  rulerY.addText("x".concat(multiplierOffset(2.2, 2).toFixed(1)), 50 / 2, 50 + (height - 50 + offset / 2) / 6);
  rulerY.addText("x".concat(multiplierOffset(1.9, 3).toFixed(1)), 50 / 2, 50 + (height - 50 + offset / 2) / 6 * 2);
  rulerY.addText("x".concat(multiplierOffset(1.6, 4).toFixed(1)), 50 / 2, 50 + (height - 50 + offset / 2) / 6 * 3);
  rulerY.addText("x".concat(multiplierOffset(1.3, 5).toFixed(1)), 50 / 2, 50 + (height - 50 + offset / 2) / 6 * 4);
  rulerY.addText("x".concat(multiplierOffset(1.0, 6).toFixed(1)), 50 / 2, 50 + offset + (height - 50 - offset / 2) / 6 * 5);
  rulerX.addText("".concat(2 + timeOffset, "s"), 50 / 2 + (width - 50 - offset / 2) / 5, height - (50 - 10), 'right');
  rulerX.addText("".concat(4 + timeOffset, "s"), 50 / 2 + (width - 50 - offset / 2) / 5 * 2, height - (50 - 10), 'right');
  rulerX.addText("".concat(6 + timeOffset, "s"), 50 / 2 + (width - 50 - offset / 2) / 5 * 3, height - (50 - 10), 'right');
  rulerX.addText("".concat(8 + timeOffset, "s"), 50 / 2 + (width - 50 - offset / 2) / 5 * 4, height - (50 - 10), 'right');
  rulerX.addText("".concat(10 + timeOffset, "s"), 50 / 2 + (width - 50 - offset / 2) / 5 * 5, height - (50 - 10), 'right');

  if (debug) {
    new Ruler(ctx, 50, 50, width - 50, 50, true);
    new Ruler(ctx, width - 50, 50, width - 50, height - 50, true);
  }

  _.forEach(cashoutTexts, function (e) {
    if (e.alpha <= 0) return;
    ctx.fillStyle = "rgba(".concat($.currentTheme() === 'dark' ? '255, 255, 255' : '0, 0, 0', ", ").concat(e.alpha, ")");
    ctx.font = "15px Open Sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("".concat(e.name, " x").concat(e.multiplier), e.x, e.y + (25 - e.alpha * 10));
    e.alpha -= 0.01;
  });
}

function clear(ctx) {
  ctx.clearRect(0, 0, width, height);
}

function reset(ctx) {
  clear(ctx);
  redrawCanvas(ctx);
  drawLineCircle(ctx, 50, height - 50);
}

$(document).on('page:themeChange', function () {
  if (!window.location.pathname.includes('crash')) return;
  var ctx = $('.game-content-crash canvas')[0].getContext('2d');
  reset(ctx);
});

var setRoundTimer = function setRoundTimer(seconds, callback) {
  seconds *= 1000;
  $('.crash-time').hide().css({
    'width': '100%'
  }).fadeIn('fast').animate({
    'width': '0%'
  }, {
    duration: seconds,
    easing: 'linear'
  });
  setTimeout(function () {
    crashed = false;
    currentMultiplier = 1.0;
    panZoom.reset();
    callback();
  }, seconds);
  crashed = true;
};

$.on('/game/crash', function () {
  $.render('crash');
  $.sidebar(function (component) {
    component.bet();
    component.history('crash');
    $.history().add(function (e) {
      e.addClass('crash-time');
    });
    component.input($.lang('general.autoStop'), function (v) {
      if (!isNaN(v) && parseFloat(v) >= 1.1 && parseFloat(v) <= 1000) autoCashout = parseFloat(v);
    }, '2.00');
    component.autoBets();
    component.play();
    component.multiplayerBets();
    component.footer().help().sound().stats();
    }, function() {
            $.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/crash.css']);
/**
 * Animates bezier-curve
 *
 * @param ctx
 * @param x0        The x-coord of the start point
 * @param y0        The y-coord of the start point
 * @param x1        The x-coord of the control point
 * @param y1        The y-coord of the control point
 * @param x2        The x-coord of the end point
 * @param y2        The y-coord of the end point
 * @param duration  The duration in milliseconds
 */

function animatePathDrawing(ctx, x0, y0, x1, y1, x2, y2, duration) {
  var start = null,
      _id = id;

  var step = function animatePathDrawingStep(timestamp) {
    if (start === null) start = timestamp;
    var delta = timestamp - start,
        progress = Math.min(delta / duration, 1); // Clear canvas

    ctx.clearRect(0, 0, width, height);

    if (debug) {
      var drawDebug = function drawDebug(x, y) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.rect(x, y, 10, 10);
        ctx.stroke();
      };

      drawDebug(x0, y0);
      drawDebug(x1, y1);
      drawDebug(x2, y2);
    }

    redrawCanvas(ctx);
    drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, 0, progress);

    if (!(progress < 1)) {
      drawLineCircle(ctx, x2, y2);
      panZoom.x -= 1;
      panZoom.y += 1;
    }

    if (!crashed && id === _id) window.requestAnimationFrame(step);
  };

  if (id === _id) window.requestAnimationFrame(step);
}

function drawLineCircle(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
  ctx.lineWidth = 3;
  ctx.strokeWidth = 3;
  ctx.fillStyle = crashed ? crash_color : in_progress_color;
  ctx.fill();
  linePosition.x = x;
  linePosition.y = y;
}
/**
 * Draws a splitted bezier-curve
 *
 * @param ctx       The canvas context to draw to
 * @param x0        The x-coord of the start point
 * @param y0        The y-coord of the start point
 * @param x1        The x-coord of the control point
 * @param y1        The y-coord of the control point
 * @param x2        The x-coord of the end point
 * @param y2        The y-coord of the end point
 * @param t0        The start ratio of the splitted bezier from 0.0 to 1.0
 * @param t1        The start ratio of the splitted bezier from 0.0 to 1.0
 */


function drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, t0, t1) {
  ctx.beginPath();

  if (0.0 === t0 && t1 === 1.0) {
    ctx.strokeStyle = crashed ? crash_color : in_progress_color;
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
  } else if (t0 !== t1) {
    var t00 = t0 * t0,
        t01 = 1.0 - t0,
        t02 = t01 * t01,
        t03 = 2.0 * t0 * t01;
    var nx0 = t02 * x0 + t03 * x1 + t00 * x2,
        ny0 = t02 * y0 + t03 * y1 + t00 * y2;
    t00 = t1 * t1;
    t01 = 1.0 - t1;
    t02 = t01 * t01;
    t03 = 2.0 * t1 * t01;
    var nx2 = t02 * x0 + t03 * x1 + t00 * x2,
        ny2 = t02 * y0 + t03 * y1 + t00 * y2;
    var nx1 = lerp(lerp(x0, x1, t0), lerp(x1, x2, t0), t1),
        ny1 = lerp(lerp(y0, y1, t0), lerp(y1, y2, t0), t1);

    if (debug) {
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.rect(nx1, ny1, 10, 10);
      ctx.stroke();
    }

    ctx.strokeStyle = crashed ? crash_color : in_progress_color;
    drawLineCircle(ctx, nx2, ny2);
    ctx.moveTo(nx0, ny0);
    ctx.lineWidth = 6;
    ctx.quadraticCurveTo(nx1, ny1, nx2, ny2);
  }

  ctx.stroke();
  ctx.closePath();
}
/**
 * Linearly interpolates between two numbers
 */


function lerp(v0, v1, t) {
  return (1.0 - t) * v0 + t * v1;
}
