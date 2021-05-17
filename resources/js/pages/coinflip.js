import gsap from 'gsap';

$.game('coinflip', function(container, overviewData) {
    if($.isOverview(overviewData)) {
        _.forEach(overviewData.game.data.history, function(color) {
            container.prepend(`<div class="coin ${color === 'yellow' ? 'front' : 'back'}"><div class="front"></div><div class="back"></div></div>`);
        });
    } else {
        $(container).append(`<div class="coin front" data-coin><div class="front"></div><div class="back"></div></div>`);

        $.restore(function(game) {
            $('.coinflip-color').fadeIn('fast').find('.block-overlay').remove();
            _.forEach(game.history, function (color) {
                $.history().add(function (e) {
                    e.html(`<div class="coin ${color === 'yellow' ? 'front' : 'back'}"><div class="front"></div><div class="back"></div></div>`);
                });
            });
        });
    }
}, function() {
    return {
        'empty': 'data'
    };
}, function(response) {
    if($.isExtendedGameStarted()) {
        $('.history-coinflip').remove();
        $('.coinflip-color').fadeIn('fast').find('.block-overlay').remove();
    } else {
        $('.coinflip-color').fadeOut('fast');
        if(response !== null && response !== undefined) $.resultPopup(response.game);
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

const flip = function(side, callback) {
    $('[data-coin]').attr('class', `coin ${side}`);

    $.playSound('/sounds/flip.mp3');

    const i = gsap.timeline({
        onComplete: callback
    });

    i.set('.game-content-coinflip', { perspective: 400, transformStyle: 'preserve3d' });
    i.fromTo('[data-coin]', .4, { rotationY: -720 }, { rotationY: -190, z: 120, ease: 'easeOut' });
    i.to('[data-coin]', { duration: .1, rotationY: -170, ease: 'easeOut' });
    i.to('[data-coin]', { duration: .4, rotationY: 0, z: -15, ease: 'easeIn' });
    i.to('[data-coin]', { duration: .1, z: 0, ease: 'easeIn' });
};

const turn = function(color, callback = null) {
    $.blockSidebarButtons(true);
    $.turn({ color: color }, function(response) {
        flip(response.data.color === 'yellow' ? 'front' : 'back', function() {
            if(callback != null) callback(response);

            if(response.type === 'lose') {
                $('.coinflip-color').fadeOut('fast');
                $.finishExtended(false);
                $.playSound('/sounds/lose.mp3');
                $.resultPopup(response.game);
            } else {
                $.blockSidebarButtons(false);
                $.playSound('/sounds/guessed.mp3');

                $.history().add(function (e) {
                    e.html(`<div class="coin ${response.data.color === 'yellow' ? 'front' : 'back'}"><div class="front"></div><div class="back"></div></div>`);
                });
            }
        });
    }, function() {
        if(callback != null) callback({ game: { status: 'lose' }});
    });
};

$.on('/game/coinflip', function() {
    $.render('coinflip');

    $.sidebar(function(component) {
        component.bet();
        component.history('coinflip');

        component.buttons($.lang('general.color'), 'coinflip-color')
            .add($.lang('general.yellow'), function(e) {
                turn('yellow');
                e.removeClass('active');
            }, 'coinflip-yellow', false)
            .add($.lang('general.blue'), function(e) {
                turn('blue');
                e.removeClass('active');
            });

        $('.coinflip-yellow').removeClass('active');
        $('.coinflip-color').hide();

        component.play();

        component.footer().help().sound().stats();
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/coinflip.css']);

