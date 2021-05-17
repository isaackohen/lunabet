require('jquery.animate-number');

$.game('limbo', function(container, overviewData) {
    $(container).append(`
        <div class="result_mul">1.00x</div>
    `);

    if($.isOverview(overviewData)) {
        $(container).html(`
            <div class="mt-2">
                ${$.lang('general.target_payout')}: ${overviewData.game.data.target.toFixed(2)} (${calculate(overviewData.game.data.target).toFixed(2)}%)
            </div>
            <div class="mt-2">
                ${$.lang('general.got')}: x${overviewData.game.data.number.toFixed(2)}
            </div>`);
    } else {
        $(container).append(`
            <div class="limbo-footer">
                <div class="row">
                    <div class="col-6 pr-2">
                        <div>${$.lang('general.target_payout')}</div>
                        <input type="number" oninput="$.triggerSidebarUpdate()" value="2.00" step=".01" placeholder="${$.lang('general.target_payout')}" id="target_payout">
                    </div>
                    <div class="col-6 pl-2">
                        <div>${$.lang('general.win_chance')}</div>
                        <input type="number" oninput="$.triggerSidebarUpdate()" value="50.00" step=".01" placeholder="${$.lang('general.win_chance')}" id="win_chance">
                    </div>
                </div>
            </div>
        `);

        $('#target_payout, #win_chance').keypress(function(event) {
            if ((event.which !== 46 || $(this).val().indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) event.preventDefault();
        });

        $('#target_payout').on('input', function() {
            const value = parseFloat($(this).val());
            if(isNaN(value) || value < 1.01 || value > 1000000) return;
            $('#win_chance').val(calculate(value).toFixed(8));
        });

        $('#win_chance').on('input', function() {
            const value = parseFloat($(this).val());
            if(isNaN(value) || value < 0.000099 || value > 98) return;
            $('#target_payout').val(calculate(value).toFixed(8));
        });
    }
}, function() {
    return {
        'target_payout': parseFloat($('#target_payout').val())
    };
}, function(response) {
    let win = response.game.win;

    $.playSound('/sounds/roll.mp3');
    $('.result_mul').toggleClass('text-danger', !win).toggleClass('text-success', win).animateNumber({
        number: response.game.data.number,
        numberStep: function(now, tween) {
            $(tween.elem).html(`${now.toFixed(2)}x`);
        }
    }, 500);

    $.playSound('/sounds/roll.mp3', 350);

    setTimeout(function() {
        $.playSound(`/sounds/${win ? 'guessed' : 'lose'}.mp3`);
        $.blockPlayButton(false);

        $.history().add(function(e) {
            e.toggleClass(`text-${win ? 'success' : 'danger'}`).html(response.server_seed.result[0].toFixed(2));
        });
    }, 300);
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}))
});

$.on('/game/limbo', function() {
    $.render('limbo');

    $.sidebar(function(component) {
        component.bet();
        component.profit();

        component.autoBets();
        component.play();

        component.footer().help().sound().stats();
        component.history('limbo', true);
    }, function() {
        const target = parseFloat($('#target_payout').val()), win_chance = parseFloat($('#win_chance').val());
        if(isNaN(target) || isNaN(win_chance) || target < 1.01 || target > 1000000 || win_chance < 0.000099 || win_chance > 98) {
            if(isNaN(target) || target < 1.01 || target > 1000000) $('#target_payout').toggleClass('error', true);
            if(isNaN(win_chance) || win_chance < 0.000099 || win_chance > 98) $('#win_chance').toggleClass('error', true);
            return;
        }

        $('#target_payout').toggleClass('error', false);
        $('#win_chance').toggleClass('error', false);

        $.sidebarData().profit(($.sidebarData().bet() * target).toFixed(8));
		$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/limbo.css']);

const calculate = function(value) {
    return (1000000 / value) / 10000;
};
