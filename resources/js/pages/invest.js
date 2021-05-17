import bitcoin from 'bitcoin-units';

$.on('/invest', function() {
    let html = '';
    _.each(window.Laravel.currency, (key, value) => {
        html += `<option value="${value}" data-icon="${key.icon}">${$(`[data-currency-value="${value}"]`).html()}</option>`;
    });
    const formatIcon = function(icon) {
        return $(`<span><i class="${$(icon.element).data('icon')}" style="color: ${$(icon.element).data('style')}"></i> ${icon.text}</span>`)
    };

    $(document).trigger('win5x:currencyChange');

    if($('.investRow .select2').length > 0) $('.currency-selector-withdraw').select2('destroy');

    $('.currency-selector-withdraw').html(html).val($.currency()).select2({
        templateSelection: formatIcon,
        templateResult: formatIcon,
        allowHtml: true
    });

    $('.currency-selector-withdraw').on('select2:selecting', function(e) {
        $.setCurrency(e.params.args.data.id);
    });

    $('[data-invest-tab]').on('click', function() {
        if($(this).hasClass('active')) return;
        $('[data-invest-tab]').removeClass('active');
        $(this).addClass('active');

        $('[data-invest-tab-container]').hide();
        $(`[data-invest-tab-container="${$(this).attr('data-invest-tab')}"]`).fadeIn('fast');
    });

    loadStats(true);

    $('#investbtn').on('click', function() {
        if($(this).hasClass('disabled')) return;
        $(this).addClass('disabled');

        $.request('invest', { amount: bitcoin(parseFloat($('#investamount').val()), $.unit()).to('btc').value() }).then(function() {
            $('#investbtn').removeClass('disabled');
            loadHistory(true);
            loadStats();
        }, function() {
            $('#investbtn').removeClass('disabled');
            $.error($.lang('general.chat_commands.modal.tip.invalid_amount'));
        });
    });
}, ['css/pages/invest.css']);

setInterval(function() {
    if(!window.location.pathname.includes('/invest')) return;
    loadStats();
    loadHistory();
}, 15000);

function loadHistory(displayLoader = false) {
    if(displayLoader) {
        $('[data-invest-tab-container="history"] .live-table').hide();
        $('[data-invest-tab-container="history"] .loader').fadeIn('fast');
    }

    $.request('investment/history').then(function(response) {
        $('[data-invest-tab-container="history"] .live_games').html('');

        _.forEach(response, (e) => {
            $('[data-invest-tab-container="history"] .live_games').append(`
                <tr>
                    <th>
                        <div>
                            ${bitcoin(e.amount, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} <i class="${window.Laravel.currency[$.currency()].icon}" style="color: ${window.Laravel.currency[$.currency()].style}"></i>
                        </div>
                    </th>
                    <th>
                        <div>
                            ${e.share.toFixed(2)}%
                        </div>
                    </th>
                    <th>
                        <div>
                            <span class="text-${e.profit > e.amount ? 'success' : (e.profit === e.amount ? '' : 'danger')}">
                                ${bitcoin(e.profit, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} <i class="${window.Laravel.currency[$.currency()].icon}" style="color: ${window.Laravel.currency[$.currency()].style}"></i>
                            </span>
                        </div>
                    </th>
                    <th>
                        <div>
                            ${e.status === 1 ? $.lang('invest.history.cancelled') : (e.profit > 0 ?
                                `<a data-disinvest="${e.id}" class="disinvestButton" href="javascript:void(0)">${$.lang('invest.history.disinvest')}</a>`
                                : $.lang('invest.history.dead'))}
                        </div>
                    </th>
                </tr>
            `);

            $('[data-invest-tab-container="history"] .live-table').show();
            $('[data-invest-tab-container="history"] .loader').fadeOut('fast');
        });

        $('[data-disinvest]').on('click', function() {
            $('[data-invest-tab-container="history"] .live-table').hide();
            $('[data-invest-tab-container="history"] .loader').fadeIn('fast');

            const done = function() {
                loadHistory(true);
                loadStats();
            };

            $.request('disinvest', { id: $(this).data('disinvest') }).then(done, done);
        });
    });
}

function loadStats(displayLoader = false) {
    if(displayLoader) {
        $('.investRow .stats .stat').hide();
        $('.investRow .stats .loader').fadeIn('fast');
    }

    $.request('investment/stats', {
        currency: $.currency()
    }).then(function(response) {
        $('[data-stat="your_bankroll"]').html(`${bitcoin(response.your_bankroll, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} <i class="${window.Laravel.currency[$.currency()].icon}" style="color: ${window.Laravel.currency[$.currency()].style}"></i>`);
        $('[data-stat="your_bankroll_percent"]').html(`${response.your_bankroll_percent.toFixed(2)}%`);
        $('[data-stat="your_share"]').html(`${response.your_bankroll_share.toFixed(2)}%`);
        $('[data-stat="investment_profit"]').html(`${bitcoin(response.investment_profit, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} <i class="${window.Laravel.currency[$.currency()].icon}" style="color: ${window.Laravel.currency[$.currency()].style}"></i>`);
        $('[data-stat="site_bankroll"]').html(`${bitcoin(response.site_bankroll, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} <i class="${window.Laravel.currency[$.currency()].icon}" style="color: ${window.Laravel.currency[$.currency()].style}"></i>`);
        $('[data-stat="site_profit"]').html(`${bitcoin(response.site_profit, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} <i class="${window.Laravel.currency[$.currency()].icon}" style="color: ${window.Laravel.currency[$.currency()].style}"></i>`);

        $('.investRow .stats .stat').show();
        $('.investRow .stats .loader').fadeOut('fast');
    });
}

$(document).on('win5x:currencyChange', function() {
    loadStats(true);
    $('#investMin').html($.lang('invest.sidebar.amount', { min: bitcoin(window.Laravel.currency[$.currency()].investMin, 'btc').to($.unit()).value().toFixed(8) }));
});
