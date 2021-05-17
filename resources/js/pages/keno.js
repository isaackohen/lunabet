let tiles = [];

$.game('keno', function(container, overviewData) {
    $(container).html(`<div class="keno_grid"></div>`);

    for (let i = 0; i < 40; i++) $(container).find('.keno_grid').append(
        `<div data-keno-id="${i}">
            <svg width="64" height="64" preserveAspectRatio="xMidYMid meet">
                <use href="#gem"></use>
            </svg>
            <span>${i}</span>
        </div>`);

    $(`.game-container [data-keno-id]`).on('click', function () {
        let id = parseInt($(this).attr('data-keno-id'));
        if (tiles.length >= 10 && !tiles.includes(id)) return;

        $(this).toggleClass('active');
        $.playSound('/sounds/click.mp3');

        if (!tiles.includes(id)) tiles.push(id);
        else tiles.splice(tiles.indexOf(id), 1);

        $('.game-container [data-keno-id].selected').removeClass('selected');

        updateHistory();
    });

    if($.isOverview(overviewData)) {
        for(let i = 0; i < overviewData.game.data.user_tiles.length; i++)
            $(`.overview-render-target [data-keno-id="${overviewData.game.data.user_tiles[i]}"]`).addClass('active');
        $.chain(10, 100, function(i) {
            const number = overviewData.game.data.tiles[i - 1];
            $(`.overview-render-target [data-keno-id="${number}"]`).addClass('selected');
            $.playSound(`/sounds/${overviewData.game.data.user_tiles.includes(number) ? 'open' : 'empty'}.mp3`);
        });
    }
}, function() {
    return {
        'tiles': tiles
    };
}, function(response) {
    $('.game-container [data-keno-id].selected').removeClass('selected');

    let foundHistoryIndex = 2;
    $.chain(10, 100, function(i) {
        const number = response.server_seed.result[i - 1];
        $(`.game-container [data-keno-id="${number}"]`).addClass('selected');
        $.playSound(`/sounds/${tiles.includes(number) ? 'open' : 'empty'}.mp3`);

        if(tiles.includes(number)) {
            $('.history-keno').removeClass('highlight');
            $(`.history-keno:nth-child(${foundHistoryIndex})`).addClass('highlight');
            foundHistoryIndex++;
        }

        if(i === 9) {
            $.blockPlayButton(false);
            $.resultPopup(response.game);
        }
    });
}, function(error) {
    if(error === 1) $.error($.lang('general.error.empty'));
    else $.error($.lang('general.error.unknown_error', {'code': error}));
});

$.on('/game/keno', function() {
    $.render('keno');

    $.sidebar(function(component) {
        component.bet();

        component.buttons(null, 'mt-2')
            .add($.lang('general.autopick'), function() {
                $('.autopick').addClass('active');
                $('.clear').removeClass('active');

                $(`.clear`).click();

                let picked = [];
                while(picked.length <= 10) {
                    let rand = $.random(1, 40);
                    if(picked.includes(rand)) continue;
                    picked.push(rand);
                }

                $.chain(10, 100, function(index) {
                    $(`[data-keno-id="${picked[index]}"]`).click();
                });
            }, 'autopick', '', false)
            .add($.lang('general.clear'), function() {
                $('.autopick').addClass('active');
                $('.clear').removeClass('active');
                $('.game-container [data-keno-id].selected').removeClass('selected');

                tiles = [];
                $(`.game-container [data-keno-id]`).removeClass('active');
                updateHistory();
            }, 'clear');

        component.autoBets();
        component.play();

        component.footer().help().sound().stats();
        component.history('keno');
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/keno.css']);

const updateHistory = function() {
    $('.history-keno').remove();
    if(tiles.length > 0) {
        let multipliers = $.multipliers()[tiles.length].sort(function(a, b) {
            return a - b;
        }).reverse();
        for(let i = 0; i < multipliers.length; i++) {
            $.history().add(function (e) {
                e.html(`<div>${multipliers[i]}x</div><div>${multipliers.length - i - 1} <i class="fad fa-square d-none d-lg-inline-block"></i></div>`);
            });
        }
    }
};
