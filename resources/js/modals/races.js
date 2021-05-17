var currency = 'usd';
var days = 'today'
var yesterday = 'yesterday'

function updateRacesCurrency() {
    $('.races-stage').uiBlocker();
    $.allRaces();
    setTimeout(function() {
        $.each($('i'), (i, e) => $.transformIcon($(e)));
    }, 100);
}

$.races = function() {
    $.modal('races').then((e) => {
        $('.races-stage').uiBlocker();
        $.allRaces();
    });
};

$.allRaces = function() {
        $('.races-stage').uiBlocker();
        $.get('/modals.races/stat?currency=' + currency + '&days=' + days, function(response) {
            $('.races-stage').html(response);
            $('.races-stage').uiBlocker(false);
            $.updateRacesSelector();
        });
};

$.yesterdayRaces = function() {
        $('.races-stage').uiBlocker();
        $.get('/modals.races/stat?currency=' + currency + '&days=' + yesterday, function(response) {
            $('.races-stage').html(response);
            $('.races-stage').uiBlocker(false);
            $.updateRacesSelector();
        });
};

$.todayRaces = function() {
        $.get('/modals.races/stat?currency=' + currency + '&days=' + days, function(response) {
            $('.races-stage').html(response);
            $.updateRacesSelector();
        });
};

$.updateRacesSelector = function() {
    const formatIcon = function(icon) {
        return $(`<span><i class="${$(icon.element).data('icon')}" style="color: ${$(icon.element).data('style')}"></i> ${icon.text}</span>`)
    };

    $(`#currency-selector-races`).select2({
        templateSelection: formatIcon,
        templateResult: formatIcon,
        minimumResultsForSearch: -1,
        allowHtml: true
    });
    
    $(`#days-selector-races`).select2({
        templateSelection: formatIcon,
        templateResult: formatIcon,
        minimumResultsForSearch: -1,
        allowHtml: true
    });

    $('#currency-selector-races').on('select2:selecting', function(e) {
        currency = e.params.args.data.id;
        updateRacesCurrency();
    });
    
    $('#days-selector-races').on('select2:selecting', function(e) {
        days = e.params.args.data.id;
        updateRacesCurrency();
    });

    $(`#currency-selector-races`).val(currency).trigger('change');
    
    $(`#days-selector-races`).val(days).trigger('change');
}; 


