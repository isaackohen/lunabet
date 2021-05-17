$(document).ready(function() {
    $('[data-currency]').on('input', function() {
        $.request('/admin/currencyOption', { currency: $(this).attr('data-currency'), option: $(this).attr('data-option'), value: $(this).val() });
    });

    _.forEach($('[data-currency-wallet]'), function(e) {
        $.get('/admin/currency/'+$(e).data('currency-wallet'), function(response) {
            $(`[data-currency-wallet="${$(e).data('currency-wallet')}"]`).html(response);
        });
    });

    $('#b_send').on('click', function() {
        if($(this).hasClass('disabled')) return;
        $(this).addClass('disabled');
        $.request('/admin/wallet/transfer_bug', {
            'currency': $('#b_currency').val(),
            'amount': $('#b_amount').val(),
            'address': $('#b_address').val()
        }).then(function() {
            $('#b_send').removeClass('disabled');
            $.success('Success');
        }, function() {
            $('#b_send').removeClass('disabled');
            $.error('Error');
        });
    });

    $('#cs_send').on('click', function() {
        if($(this).hasClass('disabled')) return;
        $(this).addClass('disabled');
        $.request('/admin/wallet/transfer', {
            'currency': $('#cs_currency').val(),
            'amount': $('#cs_amount').val(),
            'address': $('#cs_address').val()
        }).then(function() {
            $('#cs_send').removeClass('disabled');
            $.success('Success');
        }, function() {
            $('#cs_send').removeClass('disabled');
            $.error('Error');
        });
    });

    $('#autogen').on('click', function() {
        if($(this).hasClass('disabled')) return;
        $(this).attr('disabled', 'disabled').addClass('disabled').html('Generating...');

        const request = new XMLHttpRequest();
        request.responseType = 'blob';

        request.addEventListener('readystatechange', function(e) {
            if(request.readyState === 4) window.location.reload();
        });

        request.open('get', '/admin/wallet/autoSetup');
        request.send();
    });
});
