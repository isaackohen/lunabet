let currentTarget = 'lower', hideResultTimer = null;

$.game('dice', function(container, overviewData) {
    currentTarget = 'lower';

    $(container).append(`
        <div class="row h-100 ${$.isOverview(overviewData) ? 'w-100' : ''}">
            <div class="col-12 dice-column">
                <div class="dice-wrapper ${$.isOverview(overviewData) ? 'dice-wrapper-overview' : ''}">
                    <div class="dice-slider"></div>
                </div>
            </div>
            <div class="col-12 dice-footer-column ${$.isOverview(overviewData) ? 'd-none' : ''}">
                <div class="dice-footer">
                    <div class="row">
                        <div class="col-6 col-md-4">
                            <div>${$.lang('general.payout')}</div>
                            <input class="dice-payout" type="text" readonly>
                        </div>
                        <div class="col-6 col-md-4">
                            <div class="dice-header">${$.lang('dice.lower')}</div>
                            <div class="position-relative">
                                <input class="dice-number" type="number" step="1">
                                <button class="dice-append">
                                    <i class="far fa-exchange-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="d-none d-md-block col-md-4">
                            <div>${$.lang('dice.chance')}</div>
                            <input class="dice-chance" readonly type="text">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    $(container).find('.dice-number').on('input', function() {
        const value = parseInt($(this).val());
        if(isNaN(value) || (currentTarget === 'lower' && value > 95) || (currentTarget === 'higher' && value < 5) || value < 4 || value > 96) {
            $(this).toggleClass('error', true);
            return;
        }

        $(this).toggleClass('error', false);
        $(container).find('.dice-slider').slider('value', value);
        $.triggerSidebarUpdate();
    });

    $(container).find('.dice-slider').slider({
        range: 'min',
        min: 0,
        max: 100,
        value: 50,
        slide: function(event, ui) {
            if(ui.value < 4 || ui.value > 96) return false;
            if(currentTarget === 'lower' && ui.value > 95) return false;
            if(currentTarget === 'higher' && ui.value < 5) return false;

            $('#tooltip-value').html(ui.value);
            setTimeout(function() {
                $.triggerSidebarUpdate();
            }, 100);

            $.playSound('/sounds/bet.mp3', 150);
        }
    });

    const tooltip = $('<div class="d_slider-tooltip_container"><div class="d_slider-tooltip"><span id="tooltip-value">50</span></div></div>').hide();
    const stop = function(left, css) {
        return $('<div>'+left+'</div>').css({
            position: 'absolute',
            top: -55,
            color: '#565656',
            'text-align': 'center',
            'font-size': '13px',
            left: `calc(${css})`,
            transform: 'translateX(-50%)'
        });
    };

    $(container).find('.dice-slider').append($('<div id="circle" class="d_slider-circle" style="display: none" />'))
        .append($('<div id="result" class="d_slider-result" style="opacity: 0">0</div>'))
        .append(stop(100, '100%'))
        .append(stop(75, '75%'))
        .append(stop(50, '50%'))
        .append(stop(25, '25%'))
        .append(stop(0, '0'))
        .find('.ui-slider-handle').append(tooltip)
        .hover(function() {
            tooltip.stop(true).fadeIn('fast');
        }, function() {
            tooltip.stop(true).fadeOut('fast');
        });

    $(container).find('.dice-append').on('click', function() {
        currentTarget = currentTarget === 'lower' ? 'higher' : 'lower';

        $(container).find('.dice-slider').slider('option', {
            range: currentTarget === 'lower' ? 'min' : 'max'
        });

        let v = 100 - $(container).find('.dice-slider').slider('value');
        if(currentTarget === 'higher' && v < 5) v = 5;
        if(currentTarget === 'lower' && v > 95) v = 95;
        if(v < 4) v = 4; if(v > 96) v = 96;
        $(container).find('.dice-slider').slider('value', v);
        $('#tooltip-value').html(v);

        $.triggerSidebarUpdate();
    });

    if($.isOverview(overviewData)) {
        $(`.overview-render-target .d_slider-result`).css({ opacity: 1, left: `calc(${overviewData.game.data.value}%)` }).addClass(overviewData.game.status === 'win' ? 'win' : 'lose').html(overviewData.game.data.value);

        $('.overview-render-target .dice-slider').slider('option', {
            range: overviewData.game.data.target === 'lower' ? 'min' : 'max'
        });
        $(`.overview-render-target .dice-slider`).slider('value', overviewData.game.data.target === 'lower' ? overviewData.game.data.high : overviewData.game.data.low);
    }
}, function() {
    return {
        'target': currentTarget,
        'value': $('.game-container .dice-slider').slider('value')
    };
}, function(response) {
    $.blockPlayButton(false);

    let win = response.game.win;

    $.playSound('/sounds/roll.mp3', 300);

    $('#circle, #result').css({ transition: $.isQuick() ? 'none' : '' });

    $('#circle').fadeIn('fast');
    $('#circle').css({
        left: 'calc(' + response.server_seed.result[0].toFixed(2) + '% - 30px)',
        color: win ? 'green' : 'red'
    });

    $('#result').toggleClass('lose', !win);
    $('#result').toggleClass('win', win);

    $('#result').text(response.server_seed.result[0].toFixed(2));
    $('#result').css({ opacity: 1 });
    $('#result').css({
        left: 'calc(' + response.server_seed.result[0].toFixed(2) + '% - 30px)'
    });

    setTimeout(function() {
        $.playSound(`/sounds/${win ? 'guessed' : 'lose'}.mp3`);
    }, 300);

    if(hideResultTimer != null) clearTimeout(hideResultTimer);
    hideResultTimer = setTimeout(function() {
        $('#result').css({ opacity: 0 });
        $('#circle').fadeOut('fast');
    }, 7000);

    $.history().add(function(e) {
        e.toggleClass(`text-${win ? 'success' : 'danger'}`).html(response.server_seed.result[0].toFixed(2));
    });
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}))
});

$.on('/game/dice', function() {
    $.render('dice');

    $.sidebar(function(component) {
        component.bet();
        component.profit();

        component.autoBets();
        component.play();

        component.footer().help().sound().quick().stats();
        component.history('dice');
    }, function() {
        const value = $('.game-container .dice-slider').slider('value');
        $.sidebarData().profit(diceProfit(currentTarget === 'lower' ? 0 : value, currentTarget === 'higher' ? 100 : value));
		$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
        $('.dice-chance').val((currentTarget === 'higher' ? 100 - value : value) + '%');
        $('.dice-number').val(value);
        $('.dice-header').html($.lang('dice.'+currentTarget));
    });
}, ['/css/pages/dice.css']);

const diceProfit = function(min, max) {
    let payout, range;
    if(min === max) payout = 99.0;
    else {
        range = max - min;
        payout = 99.0 / range;
    }

    $('.dice-payout').val(`x${payout.toFixed(2)}`);
    return (payout * $.sidebarData().bet() - $.sidebarData().bet()).toFixed(8);
};
