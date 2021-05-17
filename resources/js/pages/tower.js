$.game('tower', function(container, overviewData) {
    container.append(`<div class="towerColumns"></div>`).find('.towerColumns').append(`<div class="towerField"></div>`);
    for(let row = 0; row < 10; row++) {
        const r = $(`<div class="towerRow" data-row-id="${row}"></div>`);
        for(let column = 0; column < 5; column++) r.append(`<div class="cell" data-cell-id="${column}"></div>`);

        container.find('.towerField').append(r);
    }

    if(!$.isOverview(overviewData)) {
        container.find('.towerColumns').prepend($(`<div class="towerMultipliers"></div>`));

        for(let row = 0; row < 10; row++) {
            for(let column = 0; column < 5; column++) {
                $(`[data-row-id="${row}"] [data-cell-id="${column}"]`).on('click', function() {
                    if(!$(this).hasClass('active')) return;

                    setRow(row, false);
                    $(this).addClass('selected');
                    $.turn({ cell: column }, function(response) {
                        if(response.type === 'fail') {
                            setRow(row, true);
                            $(this).removeClass('selected');
                            return;
                        }

                        for(let i = 0; i < 5; i++) {
                            const safe = !response.data.death.includes(i);
                            $(`[data-row-id="${row}"] [data-cell-id="${i}"]`).toggleClass(safe ? 'green' : 'red').append(`<img src="/img/game/mines-${safe ? 'gem' : 'mine'}.svg" alt>`);
                        }

                        if(response.type === 'lose') $.playSound('/sounds/lose.mp3');
                        if(response.type === 'finish') $.playSound('/sounds/win.mp3');
                        if(response.type === 'finish' || response.type === 'lose') {
                            for(let i = 0; i < response.data.grid.length; i++) {
                                let row = response.data.grid[i];
                                for(let j = 0; j < 5; j++) {
                                    const e = container.find(`[data-row-id="${i}"] [data-cell-id="${j}"]`);
                                    if(e.hasClass('red') || e.hasClass('green')) continue;
                                    e.addClass(row.includes(j) ? 'red' : 'green').append(`<img src="/img/game/mines-${row.includes(j) ? 'mine' : 'gem'}.svg" alt>`);
                                }
                            }
                            $.finishExtended(false);
                            $.resultPopup(response.game);
                        }
                        if(response.type === 'continue') {
                            $.playSound('/sounds/guessed.mp3');
                            setRow(row + 1, true);
                        }
                    });
                });
            }
        }

        $.restore(function(game) {
            for(let i = 0; i < game.history.length; i++) $(`[data-row-id="${i}"] [data-cell-id="${game.history[i]}"]`).addClass('selected');
            setRow(game.history.length);
        });
    } else {
        for(let i = 0; i < overviewData.game.data.history.length; i++) container.find(`[data-row-id="${i}"] [data-cell-id="${overviewData.game.data.history[i]}"]`).addClass('selected');
        for(let i = 0; i < overviewData.game.data.game_data.grid.length; i++) {
            let row = overviewData.game.data.game_data.grid[i];
            for(let j = 0; j < 5; j++) {
                container.find(`[data-row-id="${i}"] [data-cell-id="${j}"]`).addClass(row.includes(j) ? 'red' : 'green').append(`<img src="/img/game/mines-${row.includes(j) ? 'mine' : 'gem'}.svg" alt>`);
            }
        }
    }
}, function() {
    return {
        'mines': mines
    };
}, function(response) {
    if($.isExtendedGameStarted()) {
        $('.cell').removeClass('active').removeClass('selected').removeClass('red').removeClass('green').find('img').remove();
        setRow(0, true);
    } else {
        $('.cell').removeClass('active');
        if(response !== null && response !== undefined) $.resultPopup(response.game);
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

function setRow(id, active = true) {
    $(`[data-row-id="${id}"] .cell`).toggleClass('active', active);
}

$.on('/game/tower', function() {
    $.render('tower');

    $.sidebar(function(component) {
        component.bet();

        const buttonsComponent = component.buttons($.lang('general.mines'));
        for(let i = 1; i <= 4; i++) buttonsComponent.add(i, function() {
            mines = i;

            $(`.towerMultipliers`).html('');
            _.forEach($.multipliers()[mines], function(multiplier) {
                $(`.towerMultipliers`).append(`<div class="multiplier">${$.abbreviate(multiplier)}</div>`);
            });
        });

        component.play();
        component.footer().help().sound().stats();
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/tower.css']);

let mines = 1;
