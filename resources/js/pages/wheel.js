let mode, target, latestGame;

$.game('wheel', function(container, overviewData) {
    const e = $('<div class="wheel-container"></div>');
    $(container).append(e);

    if($.isOverview(overviewData)) {
        if(overviewData.game.data.mode === 'double') double(e); else x50(e);
        $('.overview-render-target .wheel').wheel('start', 'value', overviewData.game.data.segment);
    }
}, function() {
    return {
        'mode': mode,
        'target': target
    };
}, function(response) {
    $('.game-container .wheel').wheel('start', 'value', response.server_seed.result[mode === 'double' ? 0 : 1]);
    latestGame = response;
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

$.on('/game/wheel', function() {
    $.render('wheel');

    $.sidebar(function(component) {
        component.bet();

        component.buttons($.lang('general.color'), 'wheel-double')
            .add('x2.00', function() {
                target = 'red';
            }, 'wheel-button wheel-button-red')
            .add('x14.00', function() {
                target = 'green';
            }, 'wheel-button wheel-button-green')
            .add('x2.00', function() {
                target = 'black';
            }, 'wheel-button wheel-button-black');
        component.buttons($.lang('general.color'), 'wheel-x50')
            .add('x2.00', function() {
                target = 'black';
            }, 'wheel-button wheel-button-black')
            .add('x3.00', function() {
                target = 'red';
            }, 'wheel-button wheel-button-red')
            .add('x5.00', function() {
                target = 'green';
            }, 'wheel-button wheel-button-green')
            .add('x50.00', function() {
                target = 'yellow';
            }, 'wheel-button wheel-button-yellow');
        component.buttons($.lang('general.game_mode'))
            .add('Double', function() {
                mode = 'double';
                double($('.wheel-container'));

                $('.wheel-x50').hide();
                $('.wheel-double').show();
                $('.wheel-button-red').click();
            })
            .add('X50', function() {
                mode = 'x50';
                x50($('.wheel-container'));

                $('.wheel-x50').show();
                $('.wheel-double').hide();
                $('.wheel-button-black').click();
            });

        component.autoBets();
        component.play();

        component.footer().help().sound().quick(function() {
            if(mode === 'double') double($('.game-content .wheel-container')); else x50($('.game-content .wheel-container'));
        }).stats();
        component.history('wheel', true);
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/wheel.css']);

const common = function(container) {
    container.find('.wheel').wheel('onStep', function() {
        $.playSound('/sounds/tick.mp3');
    });
    container.find('.wheel').wheel('onComplete', function() {
        $.blockPlayButton(false);

        if(!container.parent().hasClass('overview-render-target')) {
            $.resultPopup(latestGame.game);
            $.history().add(function(e) {
                e.toggleClass(`wheel-history-${latestGame.game.data.color}`);
            });
        }
    })
};

const green = "#3bc248", red = "#e76376", black = "#1c2028", yellow = "#fec545";

const double = function(container) {
    $(container).html(`<div class="wheel"></div>`);
    container.find('.wheel').wheel({
        slices: fill([green, red, black, red, black, red, black, red, black, red, black, red, black, red, black]),
        width: 360,
        frame: 1,
        type: "spin",
        duration: $.isQuick() ? 1500 : 8000,
        line: {
            width: 0,
            color: "transparent"
        },
        outer: {
            width: 8,
            color: "rgba(255, 255, 255, 0.1)"
        },
        inner: {
            width: 0,
            color: "transparent"
        },
        center: {
            width: 90,
            rotate: true
        },
        marker: {
            animate: "true"
        }
    });
    common(container);
};

const x50 = function(container) {
    $(container).html(`<div class="wheel"></div>`);
    container.find('.wheel').wheel({
        slices: fill([
            yellow, green, black, red, black, red, black, red, black, green, black, green, black, red, black, red, black,
            red, black, green, black, green, black, red, black, red, black, red, black, red, black, red, black, green, black,
            green, black, red, black, red, black, red, black, green, black, green, black, red, black, red, black, red, black, red, black, green
        ]),
        width: 360,
        frame: 1,
        type: "spin",
        duration: $.isQuick() ? 1500 : 8000,
        line: {
            width: 0,
            color: "transparent"
        },
        outer: {
            width: 8,
            color: "rgba(255, 255, 255, 0.1)"
        },
        inner: {
            width: 0,
            color: "transparent"
        },
        center: {
            width: 90,
            rotate: true
        },
        marker: {
            animate: "true"
        }
    });
    common(container);
};

const fill = function(slices) {
    let output = [], i = 0;
    _.forEach(slices, function(slice) {
        output.push({
            value: i,
            background: slice
        });
        i++;
    });
    return output;
};
