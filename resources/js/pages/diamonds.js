import gsap from 'gsap';

$.game('diamonds', function(container, overviewData) {
    $(container).append(`
        <div class="diamonds-grid">
            <div data-diamonds-slot="1"><div class="shadow" data-shadow-id="1"></div></div>
            <div data-diamonds-slot="2"><div class="shadow" data-shadow-id="2"></div></div>
            <div data-diamonds-slot="3"><div class="shadow" data-shadow-id="3"></div></div>
            <div data-diamonds-slot="4"><div class="shadow" data-shadow-id="4"></div></div>
            <div data-diamonds-slot="5"><div class="shadow" data-shadow-id="5"></div></div>
        </div>
    `);

    if($.isOverview(overviewData)) {
        $.chain(5, 200, function(i) {
            $.setDiamond(container, i, overviewData.game.data.diamonds[i - 1], $.grep(overviewData.game.data.diamonds, function (e) {
                return e === overviewData.game.data.diamonds[i - 1];
            }).length >= 2);
        });
    }
}, function() {
    return {
        'empty': 'data'
    };
}, function(response) {
    $.clear($('.game-content'));
    $.chain(5, 200, function(i) {
        $.setDiamond($('.game-content'), i, response.game.data.diamonds[i - 1], $.grep(response.game.data.diamonds, function (e) {
            return e === response.game.data.diamonds[i - 1];
        }).length >= 2);
        if(i === 5) {
            $(`[data-m="${response.game.multiplier.toFixed(2)}"]`).addClass('highlight');
            $.blockPlayButton(false);
            $.resultPopup(response.game);
        }
    });
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

$.clear = function(container) {
    gsap.killTweensOf(['[data-diamonds-slot="1"] img', '[data-diamonds-slot="2"] img', '[data-diamonds-slot="3"] img', '[data-diamonds-slot="4"] img', '[data-diamonds-slot="5"] img',
        '[data-shadow-id="1"]', '[data-shadow-id="2"]', '[data-shadow-id="3"]', '[data-shadow-id="4"]', '[data-shadow-id="5"]']);
    container.find(`[data-diamonds-slot]`).attr('class', '').find('img').fadeOut(300, function() {
        $(this).remove();
    });
};

$.setDiamond = function(container, slot, color, highlight) {
    container.find(`[data-diamonds-slot="${slot}"]`).addClass('dropShadow').addClass(highlight ? color : '')
        .append(`<img src="/img/diamonds/${color}.svg" alt>`).hide().fadeIn(300);

    const down = function() {
        gsap.to(`[data-diamonds-slot="${slot}"] img`, {
            duration: 0.45,
            y: '+=4px',
            rotate: 1.0 + ($.random(1, 2) / 10),
            ease: 'sine.out',
            onComplete: up
        });
        gsap.to(`[data-shadow-id="${slot}"]`, {
            scale: 0.95,
            duration: 0.45,
            ease: 'sine.out'
        });
    };

    const up = function() {
        gsap.to(`[data-diamonds-slot="${slot}"] img`, {
            duration: 0.4,
            y: '-=4px',
            rotate: 0 - ($.random(1, 2) / 10),
            ease: 'sine.out',
            onComplete: down
        });
        gsap.to(`[data-shadow-id="${slot}"]`, {
            scale: 0.9,
            duration: 0.4,
            ease: 'sine.out'
        });
    };

    up();

    $.playSound(`/sounds/open${$.random(1, 2)}.mp3`);
};

$.on('/game/diamonds', function() {
    $.render('diamonds');

    $.sidebar(function(component) {
        component.bet();

        component.autoBets();
        component.play();

        component.footer().help().sound().stats();

        component.history('diamonds', true);

        const append = function(e, opacity) {
            e.append(`<i class="fad fa-gem" style="opacity: ${opacity}"></i>`);
        };

        const full = 1, double = 0.5, empty = 0.2;

        $.history().add(function(e) {
            e.attr('data-m', '50.00').append(`<div>50.00x (0.04%)</div>`);
            const c = $(`<div></div>`); e.append(c);
            for(let i = 0; i < 5; i++) append(c, full);
        }, 'append');
        $.history().add(function(e) {
            e.attr('data-m', '5.00').append(`<div>5.00x (1.25%)</div>`);
            const c = $(`<div></div>`); e.append(c);
            for(let i = 0; i < 4; i++) append(c, full);
            append(c, empty);
        }, 'append');
        $.history().add(function(e) {
            e.attr('data-m', '4.00').append(`<div>4.00x (2.50%)</div>`);
            const c = $(`<div></div>`); e.append(c);
            for(let i = 0; i < 3; i++) append(c, full);
            for(let i = 0; i < 2; i++) append(c, double);
        }, 'append');
        $.history().add(function(e) {
            e.attr('data-m', '3.00').append(`<div>3.00x (12.49%)</div>`);
            const c = $(`<div></div>`); e.append(c);
            for(let i = 0; i < 2; i++) append(c, full);
            for(let i = 0; i < 2; i++) append(c, double);
            append(c, empty);
        }, 'append');
        $.history().add(function(e) {
            e.attr('data-m', '2.00').append(`<div>2.00x (18.74%)</div>`);
            const c = $(`<div></div>`); e.append(c);
            append(c, full);
            append(c, full);
            append(c, double);
            append(c, double);
            append(c, empty);
        }, 'append');
        $.history().add(function(e) {
            e.attr('data-m', '0.10').append(`<div>0.10x (49.98%)</div>`);
            const c = $(`<div></div>`); e.append(c);
            append(c, full);
            append(c, full);
            append(c, empty);
            append(c, empty);
            append(c, empty);
        }, 'append');
        $.history().add(function(e) {
            e.attr('data-m', '0.00').append(`<div>0.00x (14.99%)</div>`);
            const c = $(`<div></div>`); e.append(c);
            for(let i = 0; i < 5; i++) append(c, empty);
        }, 'append');
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/diamonds.css']);

$(document).on('pjax:start', function() {
    $.clear($('.game-content-diamonds'));
});
