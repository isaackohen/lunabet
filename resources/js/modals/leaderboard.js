var currency = 'usd';
var days = 'all'

function updateLeaderCurrency() {
    $('.leader-stage').uiBlocker();
    $.allLeaderboard();
    setTimeout(function() {
        $.each($('i'), (i, e) => $.transformIcon($(e)));
    }, 100);
}

$.leaderboard = function() {
    $.modal('leaderboard').then((e) => {
        $('.leader-stage').uiBlocker();
        $.allLeaderboard();
    });
};

$.allLeaderboard = function() {
        $('.leader-stage').uiBlocker();
        $.get('/modals.leaderboard/stat?currency=' + currency + '&days=' + days, function(response) {
            $('.leader-stage').html(response);
            $('.leader-stage').uiBlocker(false);
            $.updateLeaderSelector();
        });
};

$.updateLeaderSelector = function() {
    const formatIcon = function(icon) {
        return $(`<span><i class="${$(icon.element).data('icon')}" style="color: ${$(icon.element).data('style')}"></i> ${icon.text}</span>`)
    };

    $(`#currency-selector-leader`).select2({
        templateSelection: formatIcon,
        templateResult: formatIcon,
        minimumResultsForSearch: -1,
        allowHtml: true
    });
    
    $(`#days-selector-leader`).select2({
        templateSelection: formatIcon,
        templateResult: formatIcon,
        minimumResultsForSearch: -1,
        allowHtml: true
    });

    $('#currency-selector-leader').on('select2:selecting', function(e) {
        currency = e.params.args.data.id;
        updateLeaderCurrency();
    });
    
    $('#days-selector-leader').on('select2:selecting', function(e) {
        days = e.params.args.data.id;
        updateLeaderCurrency();
    });

    $(`#currency-selector-leader`).val(currency).trigger('change');
    
    $(`#days-selector-leader`).val(days).trigger('change');
}; 
