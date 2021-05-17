import gsap from 'gsap';

let _flipState = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
};

function flipCard(container, id, saveState = true) {
    gsap.to(container.find(`[data-card-id="${id}"]`), {duration: 1, css: {rotationY:`+=180`}, ease: 'power2.easeInOut'});
    if(saveState) _flipState[id] = !_flipState[id];
}

function reset() {
    $(`[data-card-id]`).removeClass('active').removeClass('selected');
}

$.game('videopoker', function(container, overviewData) {
    container.append($('<div class="vpCards"></div>'));
    for(let i = 0; i < 5; i++) {
        container.find('.vpCards').append(`
            <div data-card-id="${i}" class="vpCard">
                <div class="face back"></div>
                <div class="face front">
                    <div class="vpCardValue"></div>
                    <div class="vpCardType"></div>
                </div>
            </div>`);
        $(`[data-card-id="${i}"]`).on('click', function() {
            if($(this).hasClass('active')) $(this).toggleClass('selected');
        });
    }

    if(!$.isOverview(overviewData)) {
        container.append(`<button class="btn btn-primary disabled">${$.lang('general.deal')}</button>`);
        container.find('button').on('click', function() {
            if($(this).hasClass('disabled')) return;
            let hold = [];
            _.forEach($('.vpCard.selected'), function(e) {
                hold.push(parseInt($(e).attr('data-card-id')));
            });

            $.blockPlayButton();
            $('.game-content-videopoker button').toggleClass('disabled', true);
            $('.vpCard.active').removeClass('active');

            $.turn({ hold: hold.length === 0 ? [-1, -1, -1, -1, -1, -1] : hold }, function(response) {
                for(let i = 0; i < 5; i++) {
                    if(hold.includes(i)) continue;
                    const card = deck[response.data.deck[i] + 1];
                    flipCard(container, i);
                    setTimeout(function() {
                        $(`[data-card-id="${i}"] .vpCardValue`).attr('class', `vpCardValue ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}`).html(card.value);
                        $(`[data-card-id="${i}"] .vpCardType`).html(`<i class="${deck.toIcon(card)} ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}"></i>`);
                        $(`[data-card-id="${i}"]`).addClass('active');
                        flipCard(container, i);
                    }, hold.length === 5 ? 0 : 1000);
                }
                setTimeout(function() {
                    $.finishExtended(false);
                    $.blockPlayButton(false);
                    $.resultPopup(response.game);
                }, hold.length === 5 ? 0 : 2000);
            });
        });

        $.restore(function(game) {
            for(let i = 0; i < 5; i++) {
                const card = deck[game.history[0].deck[i] + 1];
                container.find(`[data-card-id="${i}"] .vpCardValue`).attr('class', `vpCardValue ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}`).html(card.value);
                $(`[data-card-id="${i}"] .vpCardType`).html(`<i class="${deck.toIcon(card)} ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}"></i>`);
                $(`[data-card-id="${i}"]`).addClass('active');
                flipCard(container, i);
            }
            $('.game-content-videopoker button').removeClass('disabled');
        });
    } else {
        for(let i = 0; i < 5; i++) {
            const card = deck[overviewData.game.data.game_data.deck[i] + 1];
            container.find(`[data-card-id="${i}"] .vpCardValue`).attr('class', `vpCardValue ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}`).html(card.value);
            $(`[data-card-id="${i}"] .vpCardType`).html(`<i class="${deck.toIcon(card)} ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}"></i>`);
            $(`[data-card-id="${i}"]`).addClass('active');
            flipCard(container, i, false);
        }
    }
}, function() {
    return {
        'empty': 'data'
    };
}, function(response) {
    reset();
    if($.isExtendedGameStarted()) {
        let timeout = false;
        for(let i = 0; i < 5; i++) if(_flipState[i]) {
            timeout = true;
            flipCard($(`.game-content-videopoker`), i);
        }
        setTimeout(function() {
            $.blockPlayButton(true);
            $.turn({'empty': 'data'}, function (response) {
                for (let i = 0; i < 5; i++) {
                    const card = deck[response.data.deck[i] + 1];
                    $(`[data-card-id="${i}"] .vpCardValue`).attr('class', `vpCardValue ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}`).html(card.value);
                    $(`[data-card-id="${i}"] .vpCardType`).html(`<i class="${deck.toIcon(card)} ${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}"></i>`);
                    $(`[data-card-id="${i}"]`).addClass('active');
                    flipCard($(`.game-content-videopoker`), i);
                }
                setTimeout(function () {
                    if (!$.isExtendedGameStarted()) return;
                    $('.game-content-videopoker button').toggleClass('disabled', false);
                    $.blockPlayButton(false);
                }, 1000);
            });
        }, timeout ? 1000 : 0);
    } else {
        $('[data-card-id]').removeClass('active');
        $('.game-content-videopoker button').toggleClass('disabled', true);
        if(response !== null && response !== undefined) $.resultPopup(response.game);
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}))
});

$.on('/game/videopoker', function() {
    $.render('videopoker');

    $.sidebar(function(component) {
        component.bet();

        component.play();
        component.footer().help().sound().stats();
        component.history('videopoker', true);

        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.f_r')}</div><div>x800.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.s_f')}</div><div>x60.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.k')}</div><div>x22.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.f_h')}</div><div>x9.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.f')}</div><div>x6.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.s')}</div><div>x4.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.t')}</div><div>x3.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.t_p')}</div><div>x2.00</div>`);
        }, 'append');
        $.history().add(function(e) {
            e.html(`<div>${$.lang('general.videopoker.p')}</div><div>x1.00</div>`);
        }, 'append');
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/videopoker.css']);

const deck = {
    1: {type: 'spades', value: 'A'},
    2: {type: 'spades', value: '2'},
    3: {type: 'spades', value: '3'},
    4: {type: 'spades', value: '4'},
    5: {type: 'spades', value: '5'},
    6: {type: 'spades', value: '6'},
    7: {type: 'spades', value: '7'},
    8: {type: 'spades', value: '8'},
    9: {type: 'spades', value: '9'},
    10: {type: 'spades', value: '10'},
    11: {type: 'spades', value: 'J'},
    12: {type: 'spades', value: 'Q'},
    13: {type: 'spades', value: 'K'},
    14: {type: 'hearts', value: 'A'},
    15: {type: 'hearts', value: '2'},
    16: {type: 'hearts', value: '3'},
    17: {type: 'hearts', value: '4'},
    18: {type: 'hearts', value: '5'},
    19: {type: 'hearts', value: '6'},
    20: {type: 'hearts', value: '7'},
    21: {type: 'hearts', value: '8'},
    22: {type: 'hearts', value: '9'},
    23: {type: 'hearts', value: '10'},
    24: {type: 'hearts', value: 'J'},
    25: {type: 'hearts', value: 'Q'},
    26: {type: 'hearts', value: 'K'},
    27: {type: 'clubs', value: 'A'},
    28: {type: 'clubs', value: '2'},
    29: {type: 'clubs', value: '3'},
    30: {type: 'clubs', value: '4'},
    31: {type: 'clubs', value: '5'},
    32: {type: 'clubs', value: '6'},
    33: {type: 'clubs', value: '7'},
    34: {type: 'clubs', value: '8'},
    35: {type: 'clubs', value: '9'},
    36: {type: 'clubs', value: '10'},
    37: {type: 'clubs', value: 'J'},
    38: {type: 'clubs', value: 'Q'},
    39: {type: 'clubs', value: 'K'},
    40: {type: 'diamonds', value: 'A'},
    41: {type: 'diamonds', value: '2'},
    42: {type: 'diamonds', value: '3'},
    43: {type: 'diamonds', value: '4'},
    44: {type: 'diamonds', value: '5'},
    45: {type: 'diamonds', value: '6'},
    46: {type: 'diamonds', value: '7'},
    47: {type: 'diamonds', value: '8'},
    48: {type: 'diamonds', value: '9'},
    49: {type: 'diamonds', value: '10'},
    50: {type: 'diamonds', value: 'J'},
    51: {type: 'diamonds', value: 'Q'},
    52: {type: 'diamonds', value: 'K'},
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
        return `<span class="${card.type === 'hearts' || card.type === 'diamonds' ? 'text-danger' : ''}">${card.value} <i class="${deck.toIcon(card)}"></i></span>`;
    }
};
