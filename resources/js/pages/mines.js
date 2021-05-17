const displayGrid = function(container, grid) {
    for(let i = 0; i < 5 * 5; i++) $.setMine(container, i, grid[i] === 1 ? MINE_TYPE_LOSE : MINE_TYPE_SAFE, false);
};

$.game('mines', function(container, overviewData) {
    $(container).append(`<div class="mines_grid"></div>`);
    for(let i = 0; i < 5 * 5; i++)
        container.find('.mines_grid').append(`<div class="mine disabled" data-mine-id="${i}">
            <img alt src="/img/game/mines-mine.svg">
            <img alt src="/img/game/mines-gem.svg">
        </div>`);

    const turn = function(mineId, callback = null) {
        $.turn({ id: mineId }, function(response) {
            if(response.type === 'fail') return;
            if(response.type === 'lose') {
                if(!Array.isArray(mineId)) $.setMine(container, mineId, MINE_TYPE_LOSE, true);
                $.finishExtended(false);
                $.blockPlayButton(true);
                if(Array.isArray(mineId)) $(container).find('.mine').attr('data-type', null).removeClass('mines-0').removeClass('mines-1');
                setTimeout(function () {
                    $.blockPlayButton(false);
                    displayGrid(container, response.data.grid);

                    $.resultPopup(response.game);
                }, Array.isArray(mineId) ? 200 : 800);
            } else {
                if(!Array.isArray(mineId)) {
                    $.setMine(container, mineId, MINE_TYPE_SAFE, true);
                    $('.history-mines').removeClass('highlight');
                    $(`.history-mines:nth-child(${historyIndex})`).addClass('highlight');
                    historyIndex++;
                }
                if(response.type === 'finish') {
                    $.resultPopup(response.game);
                    $.finishExtended(false);
                }
            }

            if(Array.isArray(mineId)) _.forEach(mineId, function(id) {
                $(`[data-mine-id="${id}"]`).addClass('selected');
            });
            else $(`[data-mine-id="${mineId}"]`).addClass('selected');
            if(callback != null) callback(response);
        }, function() {
            if(callback != null) callback({ game: { status: 'lose' }});
        });
    };

    container.find('.mine').on('click', function() {
        const mineId = parseInt($(this).attr('data-mine-id'));
        if(!$.isExtendedGameStarted() && $.currentBettingType() === 'auto') {
            $(`[data-mine-id="${mineId}"]`).toggleClass('autoBetPick');
            return;
        }

        if(!$.isExtendedGameStarted() || $(this).hasClass('disabled')) return;
        turn(mineId);
    });

    if($.isOverview(overviewData)) {
        displayGrid(container, overviewData.game.data.game_data.grid);
        _.forEach(overviewData.game.data.history, function(selected) {
            $(`[data-mine-id="${selected}"]`).addClass('selected');
        });
    } else {
        $.restore(function(game) {
            container.find('.mine').removeClass('disabled');
            _.forEach(game.history, function(e) {
                container.find(`[data-mine-id="${e}"]`).addClass('selected');
                $.setMine(container, parseInt(e), MINE_TYPE_SAFE, false);
            });
        });

        $.extendedAutoBetHandler(function(take) {
            if(container.find('.autoBetPick').length > 25 - mines) {
                $.error($.lang('general.error.autobet_mines_error'));
                $.autoBetStop();
                $.finishExtended(true);
                return;
            }

            if(container.find('.autoBetPick').length === 0) {
                $.error($.lang('general.error.autobet_pick_something'));
                $.autoBetStop();
                $.finishExtended(true);
                return;
            }

            let picked = [];
            _.forEach(container.find('.autoBetPick'), function(e) {
                picked.push(parseInt($(e).attr('data-mine-id')));
            });

            turn(picked, take);
        });
    }
}, function() {
    return {
        mines: mines < 4 || mines > 24 ? 5 : mines
    };
}, function(response) {
    historyIndex = 1;
    if($.isExtendedGameStarted()) $('.game-container .mine.disabled').attr('data-type', '').removeClass('disabled').removeClass('mine-1').removeClass('remove-0').removeClass('selected');
    else {
        $('.game-container .mine').toggleClass('disabled', true);
        if(response != null && response.game.data.game_data.grid !== undefined) {
            displayGrid($('.game-content'), response.game.data.game_data.grid);
            $.resultPopup(response.game);
        }
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

const MINE_TYPE_LOSE = 1, MINE_TYPE_SAFE = 0;

$.setMine = function(container, id, type, sound) {
    if(sound) $.playSound(`/sounds/${type === MINE_TYPE_SAFE ? 'open' : 'lose'}.mp3`, 50);
    const e = container.find(`[data-mine-id='${id}']`);
    e.attr('class', `disabled mine mines-${type} ${e.hasClass('selected') ? 'selected' : ''} ${e.hasClass('autoBetPick') ? 'autoBetPick' : ''}`).attr('data-type', type === MINE_TYPE_SAFE ? 'open' : 'lose');
};

$.on('/game/mines', function() {
    $.render('mines');

    $.sidebar(function(component) {
        component.bet();
        component.history('mines', true);

        component.buttons($.lang('general.mines'))
            .add('5', function() {
                mines = 5;
                updateHistory();
            })
            .add('10', function() {
                mines = 10;
                updateHistory();
            })
            .add('15', function() {
                mines = 15;
                updateHistory();
            })
            .add('24', function() {
                mines = 24;
                updateHistory();
            })
            .add($.lang('general.edit'), function(e) {
                if(e.find('input').length === 0) {
                    e.html(`<input type="number" placeholder="${$.lang('general.mines')}">`);
                    e.find('input').on('keyup change input', function() {
                        mines = parseInt(e.find('input').val());
                        if(isNaN(mines) || mines < 4 || mines > 24) e.find('input').toggleClass('error', true);
                        else {
                            e.find('input').toggleClass('error', false);
                            updateHistory();
                        }
                    });
                } else mines = e.find('input').val();

                if(mines < 4 || mines > 24) e.find('input').toggleClass('error', true);
                else {
                    e.find('input').toggleClass('error', false);
                    updateHistory();
                }
            });

        component.autoBets();
        component.play();

        component.footer().help().sound().stats();
    }, function() {
            $.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/mines.css']);

let mines, historyIndex = 1;

const updateHistory = function() {
    $('.history-mines').remove();
    let multipliers = $.multipliers()[mines];
    _.forEach(multipliers, function(key, value) {
        $.history().add(function (e) {
            e.html(`<div>${value}</div><div>${$.abbreviate(key)}x`);
        }, 'append');
    });
};