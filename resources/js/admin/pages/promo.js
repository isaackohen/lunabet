const flatpickr = require("flatpickr").default;
$.on('/admin/promo', function() {
    flatpickr('#expires', {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        time_24hr: true
    });
    flatpickr('#expires-freespin', {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        time_24hr: true
    });
    flatpickr('#expiresmore', {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        time_24hr: true
    });

    $('#finish').on('click', function() {
        $('#close').click();
        $.request('/admin/promocode/create', {
            code: $('#code').val(),
            usages: $('#usages').val(),
            expires: $('#expires').val(),
            sum: $('#sum').val(),
            currency: $('#currency').val(),
            check_date: $('#check_date').val(),
            check_reg: $('#check_reg').val()
        }).then(function() {
            window.location.reload();
        }, function(error) {
            if(error >= 1) $.error('Error ' + error);
            else $.error($.parseValidation(error, {
                code: 'Code',
                usages: 'Max usages',
                expires: 'Expires',
                sum: 'Sum',
                currency: 'Currency',
                check_date: 'Prohibition of use',
                check_reg: 'Restriction on use'
            }));
        });
    });
    
        $('#finishmore').on('click', function() {
        $('#close').click();
        $.request('/admin/promocode/createmore', {
            code: $('#amountmore').val(),
            usages: $('#usagesmore').val(),
            expires: $('#expiresmore').val(),
            sum: $('#summore').val(),
            currency: $('#currencymore').val(),
            check_date: $('#check_date-more').val(),
            check_reg: $('#check_reg-more').val()
        }).then(function() {
            window.location.reload();
        }, function(error) {
            if(error >= 1) $.error('Error ' + error);
            if(error == 2) $.error('Amount of promos min. 10, max. 30');
            else $.error($.parseValidation(error, {
                code: 'Amounts promo',
                usages: 'Max usages',
                expires: 'Expires',
                sum: 'Sum',
                currency: 'Currency',
                check_date: 'Prohibition of use',
                check_reg: 'Restriction on use'
            }));
        });
    });
    
        $('#finish-freespin').on('click', function() {
        $('#close').click();
        $.request('/admin/promocode/create', {
            code: $('#code-freespin').val(),
            usages: $('#usages-freespin').val(),
            expires: $('#expires-freespin').val(),
            sum: $('#amount').val(),
            currency: 'freespin',
            check_date: $('#check_date-freespin').val(),
            check_reg: $('#check_reg-freespin').val()
        }).then(function() {
            window.location.reload();
        }, function(error) {
            if(error >= 1) $.error('Error ' + error);
            else $.error($.parseValidation(error, {
                code: 'Code',
                usages: 'Max usages',
                expires: 'Expires',
                sum: 'Amount',
                currency: 'Freespin',
                check_date: 'Prohibition of use',
                check_reg: 'Restriction on use'
            }));
        });
    });

    $('[data-remove]').on('click', function() {
        $.request('/admin/promocode/remove', {
            'id': $(this).attr('data-remove')
        }).then(function() {
            window.location.reload();
        });
    });
});