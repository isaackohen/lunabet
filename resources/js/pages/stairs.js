$.game('stairs', function(container, overviewData) {
    const rows = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const stairsColumns = $(`<div class="stairsColumns"></div>`);
    const stairsContainer = $(`<div class="stairsContainer"></div>`);
    let rowIndex = 0;
    _.forEach(rows, function(row) {
        const rowElement = $(`<div class="stairsRow" data-row-id="${rowIndex}"></div>`);
        rowIndex++;

        let i = 0;
        _.forEach(row, function(type) {
            rowElement.append(`<div ${type === 0 ? '' : `data-cell-id="${i}"`} class="stairsCell ${type === 0 ? 'stairsInvisible' : 'stairsVisible'}"></div>`);
            if(type === 1) i++;
        });
        stairsContainer.prepend(rowElement);
    });

    if(!$.isOverview(overviewData)) stairsContainer.append(`<div class="character stand"></div>`);
    if(!$.isOverview(overviewData)) stairsColumns.append(`<div class="stairsMultipliers"></div>`);
    stairsColumns.append(stairsContainer);
    container.append(stairsColumns);

    $(`[data-cell-id]`).on('click', function() {
        if(!$(this).hasClass('active')) return;
        let row = parseInt($(this).parent().attr('data-row-id'));
        let cell = parseInt($(this).attr('data-cell-id'));
        let e = $(this);
        setRow(row, false);
        $.turn({ cell: cell }, function(response) {
            if(response.type === 'fail') {
                setRow(row, true);
                return;
            }

            $('.character').attr('class', 'character run').animate({left: e.position().left}, e.position().left === $('.character').position().left ? 0 : 1000, function() {
                _.forEach(response.data.death, function(deathCell) {
                    dropStone(row, deathCell);
                });

                $('.character').attr('class', 'character climb').animate({top: $(`[data-row-id="${row}"] [data-cell-id="${cell}"]`).position().top - $(this).height()}, 800, function() {
                    if(response.type === 'finish') {
                        $.finishExtended(false);
                        $('.character').attr('class', 'character victory');
                        $.playSound('/sounds/win.mp3');
                        $.resultPopup(response.game);
                    }
                    if(response.type === 'continue') {
                        setRow(row + 1, true);
                        $('.character').attr('class', 'character stand');
                        $.playSound('/sounds/guessed.mp3');
                    }
                    if(response.type === 'lose') {
                        $.finishExtended(false);
                        $('.character').attr('class', 'character death');
                        $.playSound('/sounds/lose.mp3');
                        $.resultPopup(response.game);
                    }
                });
            });

            e.addClass('selected');
            e.append(`<i class="fas fa-ladder" data-ladder></i>`);
        });
    });

    $(`[data-cell-id]`).on('mouseover', function() {
        if(!$(this).hasClass('active')) return;
        $('.character').attr('data-flip', $(this).position().left < $('.character').position().left);
        if($(this).find('i, svg').length === 0) $(this).append(`<i class="fas fa-ladder" data-ladder></i>`);
    });

    $(`[data-cell-id]`).on('mouseleave', function() {
        if(!$(this).hasClass('active')) return;
        $(this).find(`i, svg`).remove();
    });

    if($.isOverview(overviewData)) {
        for(let i = 0; i < overviewData.game.data.history.length; i++) container.find(`[data-row-id="${i}"] [data-cell-id="${overviewData.game.data.history[i]}"]`).addClass('selected');
    } else {
        $.restore(function(game) {
            for(let i = 0; i < game.history.length; i++) $(`[data-row-id="${i}"] [data-cell-id="${game.history[i]}"]`).addClass('selected');
            setRow(game.history.length);
            if(game.history.length > 0) {
                const e = $(`[data-row-id="${game.history.length - 1}"] [data-cell-id="${game.history[game.history.length - 1]}"]`);
                $('.character').css({ top: e.position().top - $('.character').height(), left: e.position().left });
            }
        });
    }
}, function() {
    return {
        'mines': mines
    };
}, function(response) {
    if($.isExtendedGameStarted()) {
        $('[data-cell-id]').removeClass('selected').removeClass('active').find('svg').remove();
        $('.character').fadeOut('fast', function () {
            $(this).attr('data-flip', 'false').attr('style', '').attr('class', 'character stand').fadeIn('fast', function () {
                setRow(0);
            });
        });
    } else {
        $('[data-cell-id]').removeClass('active');
        $('.character').attr('class', 'character victory');
        if(response !== null && response !== undefined) $.resultPopup(response.game);
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

function dropStone(row, cell) {
    const transformId = $.randomId();

    const e = $(`<i class="fas fa-stairs" data-transform-id="${transformId}"></i>`);
    $(`[data-row-id="${row}"] [data-cell-id="${cell}"]`).append(e);
    e.hide().css({top: -40});
    setTimeout(function() {
        $(`[data-transform-id="${transformId}"]`).show().animate({top: -14}, 700);
    }, 300);
}

function setRow(id, active = true) {
    $(`[data-row-id="${id}"] .stairsCell`).toggleClass('active', active);
}

$.on('/game/stairs', function() {
    $.render('stairs');

    $.sidebar(function(component) {
        component.bet();

        const buttonsComponent = component.buttons($.lang('general.mines'));
        for(let i = 1; i <= 7; i++) buttonsComponent.add(i, function() {
            mines = i;

            $(`.stairsMultipliers`).html('');
            _.forEach($.multipliers()[mines], function(multiplier) {
                $(`.stairsMultipliers`).prepend(`<div class="multiplier">${$.abbreviate(multiplier)}</div>`);
            });
        });

        component.play();
        component.footer().help().sound().stats();
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/stairs.css']);

let mines = 1;
