$.game('hilo', function(container, overviewData) {
    if($.isOverview(overviewData)) {
        _.forEach(overviewData.game.data.history, function(index) {
            const card = deck[index];
            container.append(`<div class="card_history ${card.type === 'hearts' || card.type === 'diamonds' ? 'card_history_red' : 'card_history_black'}">
                <div>${card.value}</div>
                <i class="${deck.toIcon(card)}"></i>
            </div>`);
        });
    } else {
        container.append(`
            <div class="hilo_card">
                <div class="hilo-card-value"></div>
                <i id="card_icon"></i>
                <div class="hilo-replace">
                    <i class="far fa-redo"></i>
                </div>
            </div>
        `);

        $('.hilo-replace').on('click', function() {
            replace();
            $.playSound('/sounds/card_slide.mp3');
        });

        $.restore(function(game) {
            $('.hilo-replace').fadeOut('fast');
            $('.hilo-turn, .hilo-skip').fadeIn('fast');
            $.blockSidebarButtons(false);

            if(game.history.length >= 3) $('.hilo-skip .game-sidebar-buttons-container-button').addClass('disabled');

            setCard(deck[game.history[game.history.length - 1]]);
            clearHistory();

            _.forEach(game.history, function (index) {
                addToHistory(deck[index]);
            });
        });
    }
}, function() {
    return {
        'starting': startingCardIndex
    };
}, function(response) {
    if($.isExtendedGameStarted()) {
        clearHistory();
        $('.hilo-replace').fadeOut('fast');
        $('.hilo-turn, .hilo-skip').fadeIn('fast');
        $.blockSidebarButtons(false);
        turnId = 0;
        $('.hilo-skip .game-sidebar-buttons-container-button').removeClass('disabled');
    } else {
        $('.hilo-replace').fadeIn('fast');
        $('.hilo-turn, .hilo-skip').fadeOut('fast');
        if(response !== undefined && response !== null) $.resultPopup(response.game);
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

let startingCardIndex, turnId = 0;

const turn = function(type) {
    turnId++;
    if(turnId >= 3) $('.hilo-skip .game-sidebar-buttons-container-button').toggleClass('disabled', true);

    $.blockSidebarButtons(true);
    $.turn({ type: type }, function(response) {
        if(response.type === 'fail') {
            $.blockSidebarButtons(false);
            return;
        }

        setCard(deck[response.data.current]);
        $.blockSidebarButtons(false);

        if(response.type === 'lose') {
            $.finishExtended(false);
            $.playSound('/sounds/lose.mp3');
            $.resultPopup(response.game);
        } else $.playSound('/sounds/card_slide.mp3');
    });
};

const setCard = function(card) {
    if (card === undefined) {
        console.error('Tried to set undefined card');
        card = deck[1];
    }

    startingCardIndex = _.findKey(deck, card);

    $('.hilo-card-value').fadeOut('fast', function () {
        $(this).html(card.value);
        $(this).fadeIn('fast');
    });

    $('#card_icon').fadeOut('fast', function () {
        $('#card_icon').attr('class', deck.toIcon(card));
        $('#card_icon').fadeIn('fast');
        setTimeout(function() {
            $('#card_icon').css({opacity: 1});
        }, 200);

        let isRed = card.type === 'hearts' || card.type === 'diamonds';
        $('.hilo_card').toggleClass('card_history_red', isRed);
        $('.hilo_card').toggleClass('card_history_black', !isRed);
    });

    addToHistory(card);
    recalculateMultipliers();
};

const recalculateMultipliers = function() {
    let calculateMultiplier = function (type) {
        if(type === 'higher') return (12.350 / (13 - (deck[startingCardIndex].slot - 1)));
        if(type === 'lower') return (12.350 / (deck[startingCardIndex].slot));
        if(type === 'same') return 16.83;
    };

    let sameProbability = 5.88,
        lowerProbability = (deck[startingCardIndex].slot / 13) * 100 - (sameProbability),
        higherProbability = 100 - lowerProbability - (sameProbability);

    const noHigher = (startingCardIndex % 13) + 1 === 1, noLower = (startingCardIndex % 13) + 1 === 2;

    if(noHigher) lowerProbability = 100 - sameProbability;
    if(noLower) higherProbability = 100 - sameProbability;

    $('.hilo-higher').removeClass('disabled').fadeOut('fast', function () {
        if(noHigher) $(this).addClass('disabled');
        $('.hilo-higher .multiplier').html((noHigher ? 0 : calculateMultiplier('higher')).toFixed(2)+'x');
        $('.hilo-higher .chance').html((noHigher ? 0 : higherProbability).toFixed(2)+'%');
        $('.hilo-higher').fadeIn('fast');
    });

    $('.hilo-same').removeClass('disabled').fadeOut('fast', function() {
        $('.hilo-same .multiplier').html(calculateMultiplier('same').toFixed(2)+'x');
        $('.hilo-same .chance').html(sameProbability.toFixed(2)+'%');
        $('.hilo-same').fadeIn('fast');
    });

    $('.hilo-lower').removeClass('disabled').fadeOut('fast', function () {
        if(noLower) $(this).addClass('disabled');
        $('.hilo-lower .multiplier').html((noLower ? 0 : calculateMultiplier('lower')).toFixed(2)+'x');
        $('.hilo-lower .chance').html((noLower ? 0 : lowerProbability).toFixed(2)+'%');
        $('.hilo-lower').fadeIn('fast');
    });
};

const addToHistory = function(card) {
    $.history().add(function(e) {
        e.html($(`<div class="card_history ${card.type === 'hearts' || card.type === 'diamonds' ? 'card_history_red' : 'card_history_black'}">
                <div>${card.value}</div>
                <i class="${deck.toIcon(card)}"></i>
            </div>`).hide().fadeIn('fast'));
    });
};

const clearHistory = function() {
    $.each($('.card_history'), function (i, e) {
        $(e).fadeOut('fast', function () {
            $(e).remove();
        });
    });
};

const replace = function() {
    if($.isExtendedGameStarted()) return;
    clearHistory();

    const next = function() {
        const number = $.random(1, Object.keys(deck).length);
        const card = deck[number];
        if(card === undefined || card.slot === 1 || card.slot === 13) {
            next();
            return;
        }

        startingCardIndex = number;
        setCard(card);
        recalculateMultipliers();
    };

    next();
};

$.on('/game/hilo', function() {
    $.render('hilo');

    $.sidebar(function(component) {
        component.bet();

        const template = function(label) {
            return `
                <div class="label">${label}</div>
                <div class="multiplier">0.00x</div>
                <div class="chance">0.00%</div>
            `;
        };

        component.buttons(null, 'hilo-turn mt-2')
            .add(template($.lang('general.hilo-higher')), function(e) {
                turn('higher');
                e.removeClass('active');
            }, 'hilo-higher', false);
        component.buttons(null, 'hilo-turn mt-2')
            .add(template($.lang('general.hilo-same')), function(e) {
                turn('same');
                e.removeClass('active');
            }, 'hilo-same', false);
        component.buttons(null, 'hilo-turn mt-2')
            .add(template($.lang('general.hilo-lower')), function(e) {
                turn('lower');
                e.removeClass('active');
            }, 'hilo-lower', false);
        component.buttons(null, 'hilo-skip mt-2')
            .add($.lang('general.hilo-skip'), function(e) {
                if(e.hasClass('disabled')) return;

                turn('skip');
                e.removeClass('active');
            }, 'hilo-skip-c', false);

        $('.hilo-lower, .hilo-higher, .hilo-same, .hilo-skip, .hilo-skip-c').removeClass('active');
        $('.hilo-turn, .hilo-skip').hide();

        component.history('hilo');
        replace();

        component.play();

        component.footer().help().sound().stats();
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/hilo.css']);

const deck = {
    1: {type: 'spades', value: 'A', slot: 1},
    2: {type: 'spades', value: '2', slot: 2},
    3: {type: 'spades', value: '3', slot: 3},
    4: {type: 'spades', value: '4', slot: 4},
    5: {type: 'spades', value: '5', slot: 5},
    6: {type: 'spades', value: '6', slot: 6},
    7: {type: 'spades', value: '7', slot: 7},
    8: {type: 'spades', value: '8', slot: 8},
    9: {type: 'spades', value: '9', slot: 9},
    10: {type: 'spades', value: '10', slot: 10},
    11: {type: 'spades', value: 'J', slot: 11},
    12: {type: 'spades', value: 'Q', slot: 12},
    13: {type: 'spades', value: 'K', slot: 13},
    14: {type: 'hearts', value: 'A', slot: 1},
    15: {type: 'hearts', value: '2', slot: 2},
    16: {type: 'hearts', value: '3', slot: 3},
    17: {type: 'hearts', value: '4', slot: 4},
    18: {type: 'hearts', value: '5', slot: 5},
    19: {type: 'hearts', value: '6', slot: 6},
    20: {type: 'hearts', value: '7', slot: 7},
    21: {type: 'hearts', value: '8', slot: 8},
    22: {type: 'hearts', value: '9', slot: 9},
    23: {type: 'hearts', value: '10', slot: 10},
    24: {type: 'hearts', value: 'J', slot: 11},
    25: {type: 'hearts', value: 'Q', slot: 12},
    26: {type: 'hearts', value: 'K', slot: 13},
    27: {type: 'clubs', value: 'A', slot: 1},
    28: {type: 'clubs', value: '2', slot: 2},
    29: {type: 'clubs', value: '3', slot: 3},
    30: {type: 'clubs', value: '4', slot: 4},
    31: {type: 'clubs', value: '5', slot: 5},
    32: {type: 'clubs', value: '6', slot: 6},
    33: {type: 'clubs', value: '7', slot: 7},
    34: {type: 'clubs', value: '8', slot: 8},
    35: {type: 'clubs', value: '9', slot: 9},
    36: {type: 'clubs', value: '10', slot: 10},
    37: {type: 'clubs', value: 'J', slot: 11},
    38: {type: 'clubs', value: 'Q', slot: 12},
    39: {type: 'clubs', value: 'K', slot: 13},
    40: {type: 'diamonds', value: 'A', slot: 1},
    41: {type: 'diamonds', value: '2', slot: 2},
    42: {type: 'diamonds', value: '3', slot: 3},
    43: {type: 'diamonds', value: '4', slot: 4},
    44: {type: 'diamonds', value: '5', slot: 5},
    45: {type: 'diamonds', value: '6', slot: 6},
    46: {type: 'diamonds', value: '7', slot: 7},
    47: {type: 'diamonds', value: '8', slot: 8},
    48: {type: 'diamonds', value: '9', slot: 9},
    49: {type: 'diamonds', value: '10', slot: 10},
    50: {type: 'diamonds', value: 'J', slot: 11},
    51: {type: 'diamonds', value: 'Q', slot: 12},
    52: {type: 'diamonds', value: 'K', slot: 13},
    toIcon: function(card) {
        let icons = {
            'spades': 'fas fa-spade',
            'hearts': 'fas fa-heart',
            'clubs': 'fas fa-club',
            'diamonds': 'fas fa-diamond'
        };
        return icons[card.type];
    },
    toString: function(card) {
        return card.value + ' <i class="' + deck.toIcon(card) + '"></i>';
    }
};
