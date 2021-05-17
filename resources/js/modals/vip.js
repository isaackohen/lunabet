$(document).ready(function() {
    $(document).on('click', '.expandableBlockHeader', function() {
        $(this).parent().find('.expandableBlockContent').slideToggle('fast');
        $(this).find('svg:last-child').toggleClass('fa-angle-up').toggleClass('fa-angle-left');
    });

    $(document).on('click', '.vip_bonus .btn', function() {
        if($(this).hasClass('disabled')) return;
        $('.vip_bonus').uiBlocker();
        $.request('promocode/vipBonus').then(function() {
            $.vipBonus();
        }, function(error) {
            $('.vip_bonus').uiBlocker(false);
            $.error($.lang('general.error.unknown_error', {'code': error}));
        });
    });
});

$.vip = function() {
    if($.isGuest()) {
        $.auth();
        return;
    }

    $.modal('vip');
};

$.gotovipBonus = function() {
    if($.isGuest()) {
        $.auth();
        return;
    }


        $.get('/modals.vip_bonus/info', function(response) {
            $('.vip_bonus_content').html(response);
        });
};

$.vipBonus = function() {
    if($.isGuest()) {
        $.auth();
        return;
    }

    $.modal('vip_bonus').then((e) => {
        e.uiBlocker();

        $.get('/modals.vip_bonus/info', function(response) {
            $('.vip_bonus_content').html(response);
            e.uiBlocker(false);
        });
    });
};

$.vipIcon = function(level) {
    switch (level) {
        case 1: return `<svg><use href="#vip-emerald"></use></svg>`;
        case 2: return `<svg><use href="#vip-ruby"></use></svg>`;
        case 3: return `<svg><use href="#vip-gold"></use></svg>`;
        case 4: return `<svg><use href="#vip-platinum"></use></svg>`;
        case 5: return `<svg><use href="#vip-diamond"></use></svg>`;
        default: return `N/A`;
    }
};
