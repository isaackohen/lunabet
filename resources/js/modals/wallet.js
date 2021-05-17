const clipboard = require('clipboard-polyfill');
const qr = require('qrcode');

$(document).ready(function() {
    $(document).on('click', '[data-wallet-toggle-tab]', function() {
        if($(this).hasClass('active')) return;
        const tab = $(this).attr('data-wallet-toggle-tab');
        $(`[data-wallet-toggle-tab]`).removeClass('active');
        $(`[data-wallet-toggle-tab="${tab}"]`).addClass('active');
        $(`[data-wallet-tab-content]`).hide();
        $(`[data-wallet-tab-content="${tab}"]`).fadeIn('fast');
    });

    $(document).on('click', '[data-wallet-history-toggle-tab]', function() {
        if($(this).hasClass('active')) return;
        const tab = $(this).attr('data-wallet-history-toggle-tab');
        $(`[data-wallet-history-toggle-tab]`).removeClass('active');
        $(`[data-wallet-history-toggle-tab="${tab}"]`).addClass('active');
        $(`[data-history-tab]`).hide();
        $(`[data-history-tab="${tab}"]`).fadeIn('fast');
    });

    $(document).on('click', `[data-wallet-toggle-tab="deposit"]`, updateDepositCurrency);
    $(document).on('click', `[data-wallet-toggle-tab="history"]`, function() {
        $('.wallet_modal').uiBlocker();
        loadHistory();
    });

    $(document).on('click', '#withdraw', function() {
        $('.wallet_modal').uiBlocker(true);
        $.request('wallet/withdraw', {
            sum: parseFloat($('#withdraw-amount-value').val()),
            wallet: $('#withdraw-address-value').val(),
            currency: $.currency()
        }).then(function() {
            $('.wallet_modal').uiBlocker(false);
            $('[data-wallet-toggle-tab]').removeClass('active');
            $('[data-wallet-toggle-tab="history"]').addClass('active');
            $('[data-wallet-tab-content]').hide();
            Intercom('trackEvent', 'withdrawRequest');
            $('[data-wallet-tab-content="history"]').fadeIn('fast');
            loadHistory(function() {
                $('[data-wallet-history-toggle-tab="withdraws"]').click();
            });
        }, function(error) {
            $('.wallet_modal').uiBlocker(false);
            if(error === 1) $.error($.lang('general.error.invalid_withdraw'));
            if(error === 2) $.error($.lang('general.error.invalid_wager'));
            if(error === 3) $.error($.lang('general.error.only_one_withdraw'));
        });
    });

    $(document).on('click', `[data-wallet-tab-content="deposit"] input`, function() {
        clipboard.writeText($(this).val());
        $.success($.lang('wallet.copied'));
    });
});

function loadHistory(callback = null) {
    $.get('/modals.wallet_modal/history', function(response) {
        $('#wallet-history-content').html(response);
        $('.wallet_modal').uiBlocker(false);
        $('[data-wallet-history-toggle-tab]').removeClass('active');
        $('[data-wallet-history-toggle-tab="payments"]').addClass('active');

        if(callback != null) callback();
    });
}

function updateDepositCurrency() {
    const currency = window.Laravel.currency[$.currency()];
    $(`#currency-label`).html($.lang('wallet.deposit.address', { currency: currency.name }));
    //$(`#deposit-warning`).html($.lang('wallet.deposit.confirmations', { currency: currency.name, confirmations: currency.requiredConfirmations }));

    const canvas = $(`<canvas></canvas>`);
    $(`[data-wallet-tab-content="deposit"] .qr`).html(`
        <div class="loader">
            <div></div>
        </div>
    `).append(canvas);

    $(`[data-wallet-tab-content="deposit"] .input-loader`).append(`
        <div class="loader">
            <div></div>
        </div>
    `);

    $('#withdraw-warning').html($.lang('wallet.withdraw.fee', { fee: currency.withdrawFee.toFixed(8), icon: currency.icon }));
    $('#withdraw-address').html($.lang('wallet.withdraw.address', { currency: currency.name, icon: currency.icon }));
    $('#withdraw-min').html($.lang('wallet.withdraw.amount', { min: currency.minimalWithdraw.toFixed(8), icon: currency.icon }));

    $(`[data-wallet-tab-content="deposit"] input`).val(``);
    $(`[data-wallet-tab-content="deposit"] .walletNotification`).fadeOut('fast');
    $(`[data-wallet-tab-content="deposit"] .walletMinDeposit`).fadeOut('fast');

    setTimeout(function() {
        $.each($('i'), (i, e) => $.transformIcon($(e)));
    }, 100);
}

$.wallet = function() {
    $.modal('wallet_modal').then(() => {
        $.updateBalanceSelector();
    });
};

$.updateBalanceSelector = function() {
    const formatIcon = function(icon) {
        return $(`<span><i class="${$(icon.element).data('icon')}" style="color: ${$(icon.element).data('style')}"></i> ${icon.text}</span>`)
    };

    $(`#currency-selector-deposit, .currency-selector-withdraw`).select2({
        templateSelection: formatIcon,
        templateResult: formatIcon,
        minimumResultsForSearch: -1,
        allowHtml: true
    });

    $('#currency-selector-deposit, .currency-selector-withdraw').on('select2:selecting', function(e) {
        $.setCurrency(e.params.args.data.id);
        updateDepositCurrency();
    });

    $(`#currency-selector-deposit`).val($.currency()).trigger('change');
    $(`.currency-selector-withdraw`).val($.currency()).trigger('change');
    updateDepositCurrency();
};

$.demoWallet = function() {
    $.modal('demo-wallet').then(() => {
        if(parseFloat($(`[data-demo-currency-value="${$.currency()}"]`).html()) > 0) {
            $('.demo-wallet .wallet-content').html(`<div class="notice">${$.lang('general.wallet.demo.error')}</div>`);
        } else {
            $('.demo-wallet .wallet-content').html(`<div class="notice">
                <div class="btn btn-primary">${$.lang('general.wallet.demo.obtain')}</div>
            </div>`);
            $('.demo-wallet .btn').on('click', function() {
                $('.demo-wallet').uiBlocker(true);
                $.request('promocode/demo').then(function() {
                    $('.demo-wallet').uiBlocker(false);
                    $.modal('demo-wallet', 'hide');
                }, function() {
                    $('.demo-wallet').uiBlocker(false);
                    $.error($.lang('general.wallet.demo.error'));
                });
            });
        }
    });
};

$.cancelWithdraw = function(id) {
    $('.wallet_modal').uiBlocker(true);
    $.request('wallet/cancel_withdraw', { id: id }).then(function() {
        $.success($.lang('wallet.history.withdraw_cancelled'));
        $('[data-wallet-toggle-tab="history"]').click();
    }, function(error) {
        $('.wallet_modal').uiBlocker(false);
        $.error(error);
    });
};
