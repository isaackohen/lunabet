let game, player, split, dealer, deal, blackjack = false, splitted = false;

$.game('blackjack', function(container, overviewData) {
    if($.isOverview(overviewData)) return;

    $.restore(function(game) {
        setTimeout(function () {
            deal.dealCard(player, {
                'index': game.user_data.player[0].index + 1,
                'rank': game.user_data.player[0].value,
                'suit': game.user_data.player[0].type,
                'value': game.user_data.player[0].blackjack_value,
                'type': 'up'
            });
            setTimeout(function () {
                deal.dealCard(dealer, {
                    'index': game.user_data.dealer[0].index + 1,
                    'rank': game.user_data.dealer[0].value,
                    'suit': game.user_data.dealer[0].type,
                    'value': game.user_data.dealer[0].blackjack_value,
                    'type': 'up'
                });
                setTimeout(function () {
                    deal.dealCard(player, {
                        'index': game.user_data.player[1].index + 1,
                        'rank': game.user_data.player[1].value,
                        'suit': game.user_data.player[1].type,
                        'value': game.user_data.player[1].blackjack_value,
                        'type': 'up'
                    });
                    setTimeout(function () {
                        deal.dealCard(dealer, {
                            'index': 1,
                            'rank': '',
                            'suit': '',
                            'value': 0,
                            'type': 'down'
                        }, true);

                        if(game.user_data.split.length > 0) {
                            for(let i = 0; i < game.user_data.split.length; i++)
                                deal.dealCard(split, {
                                    'index': game.user_data.split[i].index + 1,
                                    'rank': game.user_data.split[i].value,
                                    'suit': game.user_data.split[i].type,
                                    'value': game.user_data.split[i].blackjack_value,
                                    'type': 'up'
                                });
                            splitted = game.user_data.currentHand === 1;
                            if(splitted) $('.arrowSplit').fadeIn('fast');
                            else $('.arrowPlayer').fadeIn('fast');
                        }

                        if(game.user_data.player.length > 2) {
                            for(let i = 2; i < game.user_data.player.length; i++)
                                deal.dealCard(player, {
                                    'index': game.user_data.player[i].index + 1,
                                    'rank': game.user_data.player[i].value,
                                    'suit': game.user_data.player[i].type,
                                    'value': game.user_data.player[i].blackjack_value,
                                    'type': 'up'
                                });
                        }

                        $.blockPlayButton(false);
                        $.blockSidebarButtons(false);

                        $('.splitB').toggleClass('disabled', game.user_data.player[0].blackjack_value !== game.user_data.player[1].blackjack_value || game.user_data.player.length !== 2);

                        $('.play-button').fadeOut('fast');
                        $('.double, .hit, .stand, .splitB').fadeIn('fast');
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    });

    class Player {

        constructor(ele, score) {
            this.hand = [];
            this.ele = ele;
            this.score = score;
        }

        getHand() {
            return this.hand;
        }

        setHand(card) {
            this.hand.push(card);
        }

        resetHand() {
            this.hand = [];
        }

        flipCards(dealerSecretOptions) {
            $('.down').each(function() {
                $(this).removeClass('down').addClass('up');
                renderCard(false, false, $(this), false, dealerSecretOptions);
            });
        }

        hit(dbl) {
            $.blockSidebarButtons(true);
            $.turn({ type: 'hit' }, function(response) {
                $('.splitB').toggleClass('disabled', true);

                deal.dealCard(splitted ? split : player, {
                    'index': response.data.player.index + 1,
                    'rank': response.data.player.value,
                    'suit': response.data.player.type,
                    'value': response.data.player.blackjack_value,
                    'type': 'up'
                });

                (splitted ? split : player).getScore(function (response) {
                    if (dbl || response >= 21) {
                        setTimeout(function () {
                            (splitted ? split : player).stand();
                        }, 500);
                    } else $.blockSidebarButtons(false);

                    (splitted ? split : player).updateBoard();
                });
            });
        }

        stand() {
            $.blockSidebarButtons(true);
            $.turn({ type: 'stand' }, function(response) {
                if(response.type === 'continue') {
                    splitted = true;
                    $('.arrowPlayer').fadeOut('fast');
                    $('.arrowSplit').fadeIn('fast');
                    $.blockSidebarButtons(false);
                    return;
                }

                dealer.flipCards({
                    'rank': response.data.dealerReveal['value'],
                    'suit': `<i class="${deck.toIcon(deck[response.data.dealerReveal['index']])}"></i>`,
                    'value': response.data.dealerReveal['blackjack_value']
                });

                if(response.data.dealerDraw.length === 0) {
                    $.playSound('/sounds/'+(response.game.multiplier === 0 ? 'lose' : 'win')+'.mp3');
                    $.resultPopup(response.game);
                }
                $.chain(response.data.dealerDraw.length, 250, function(i) {
                    deal.dealCard(dealer, {
                        'index': response.data.dealerDraw[i - 1].index + 1,
                        'rank': response.data.dealerDraw[i - 1].value,
                        'suit': response.data.dealerDraw[i - 1].type,
                        'value': response.data.dealerDraw[i - 1].blackjack_value,
                        'type': 'up'
                    });

                    dealer.getScore(function(response) {
                        $('.dealer').html(response);
                    });

                    if(i === response.data.dealerDraw.length) {
                        $.playSound('/sounds/'+(response.game.multiplier === 0 ? 'lose' : 'win')+'.mp3');
                        $.resultPopup(response.game);
                    }
                });

                dealer.getScore(function(response) {
                    $('.dealer').html(response);
                });
                dealer.updateBoard();
                $.finishExtended(false);
            });
        }

        split() {
            $('.splitB, .double').addClass('disabled');
            $.blockSidebarButtons(true);
            $.turn({ type: 'split' }, function(response) {
                if(response.data.error) {
                    $.error($.lang('general.error.invalid_wager'));
                    $.blockSidebarButtons(false);
                    return;
                }

                player.resetHand();
                split.resetHand();

                setTimeout(function () {
                    deal.dealCard(player, {
                        'index': response.data.player[0].index + 1,
                        'rank': response.data.player[0].value,
                        'suit': response.data.player[0].type,
                        'value': response.data.player[0].blackjack_value,
                        'type': 'up'
                    });
                    setTimeout(function () {
                        deal.dealCard(split, {
                            'index': response.data.split[0].index + 1,
                            'rank': response.data.split[0].value,
                            'suit': response.data.split[0].type,
                            'value': response.data.split[0].blackjack_value,
                            'type': 'up'
                        });
                        setTimeout(function () {
                            deal.dealCard(player, {
                                'index': response.data.player[1].index + 1,
                                'rank': response.data.player[1].value,
                                'suit': response.data.player[1].type,
                                'value': response.data.player[1].blackjack_value,
                                'type': 'up'
                            });
                            setTimeout(function () {
                                deal.dealCard(split, {
                                    'index': response.data.split[1].index + 1,
                                    'rank': response.data.split[1].value,
                                    'suit': response.data.split[1].type,
                                    'value': response.data.split[1].blackjack_value,
                                    'type': 'up'
                                });

                                $('.arrowPlayer').fadeIn('fast');
                                $.blockSidebarButtons(false);
                            }, 250);
                        }, 250);
                    }, 250);
                }, 250);
            });
        }

        double() {
            $.blockSidebarButtons(true);
            $.turn({ type: 'double' }, function(response) {
                if(response.data.error) {
                    $.error($.lang('general.error.invalid_wager'));
                    $.blockSidebarButtons(false);
                    return;
                }
                player.hit(true);
            });
        }

        getScore(callback) {
            let hand = this.getHand(), score = 0, aces = 0, i;

            for(i = 0; i < hand.length; i++) {
                if(hand[i].rank.length === 0) continue;

                score += hand[i].value;

                if(hand[i].value === 11) aces += 1;

                if(score > 21 && aces > 0) {
                    score -= 10;
                    aces--;
                }
            }

            $(this.score).fadeIn('fast');
            callback(score);
        }

        updateBoard() {
            this.getScore(function (response) {
                $(this.score).html(response);
            });
        }

        getElements() {
            return {
                'ele': this.ele,
                'score': this.score
            }
        }

    }

    class Card {

        constructor(card) {
            this.card = card;
        }

        getIndex() {
            return this.card.index;
        }

        getType() {
            return this.card.type;
        }

        getRank() {
            return this.card.rank;
        }

        getSuit() {
            return this.card.suit;
        }

        getValue() {
            switch (this.getRank()) {
                case 'A': return 11;
                case 'K': case 'Q': case 'J': return 10;
                default: return parseInt(this.getRank(), 0);
            }
        }

    }

    class Deal {

        setCard(sender, card) {
            sender.setHand(card);
        }

        dealCard(sender, card, isHiddenByServer) {
            let elements = sender.getElements(), dealerHand = dealer.getHand();
            deal.setCard(sender, card);

            $.playSound('/sounds/card_slide.mp3', 100);
            renderCard(elements.ele, sender, false, isHiddenByServer, undefined);
            sender.getScore(function(response) {
                $(elements.score).html(response);
            });

            if(player.getHand().length < 3) {
                if(dealerHand.length > 0 && dealerHand[0].rank === 'A') {
                    if($('.insurance').length === 0 && $.isExtendedGameStarted()) {
                        $('.game-container').prepend(`
                            <div class="insurance">
                                <div class="window">
                                    <div class="insurance-desc">${$.lang('general.insurance')}</div>
                                    <div class="mt-2">
                                        <button class="btn btn-primary mr-2" id="i-a">${$.lang('general.accept')}</button>
                                        <button class="btn btn-secondary" id="i-d">${$.lang('general.decline')}</button>
                                    </div>
                                </div>
                            </div>
                        `);

                        $('#i-d').on('click', function () {
                            $('.insurance').remove();
                        });

                        $('#i-a').on('click', function () {
                            $('.insurance').remove();
                            $.turn({type: 'insurance'}, function (response) {
                                if (response.data.error) $.error($.lang('general.error.invalid_wager'));
                                $.success($.lang('general.insurance_success'));
                            });
                        });
                    }
                }

                player.getScore(function(response) {
                    if(response === 21) {
                        if(blackjack) return;
                        setTimeout(function() {
                            player.stand();
                        }, 500);
                        blackjack = true;
                    }
                });
            }
        }

    }

    class Game {

        newGame(callback) {
            resetBoard();
            $.blockPlayButton(true);

            $.turn({ type: 'info' }, function(response) {
                setTimeout(function () {
                    deal.dealCard(player, {
                        'index': response.data.player[0].index + 1,
                        'rank': response.data.player[0].value,
                        'suit': response.data.player[0].type,
                        'value': response.data.player[0].blackjack_value,
                        'type': 'up'
                    });
                    setTimeout(function () {
                        deal.dealCard(dealer, {
                            'index': response.data.dealer.index + 1,
                            'rank': response.data.dealer.value,
                            'suit': response.data.dealer.type,
                            'value': response.data.dealer.blackjack_value,
                            'type': 'up'
                        });
                        setTimeout(function () {
                            deal.dealCard(player, {
                                'index': response.data.player[1].index + 1,
                                'rank': response.data.player[1].value,
                                'suit': response.data.player[1].type,
                                'value': response.data.player[1].blackjack_value,
                                'type': 'up',
                            });
                            setTimeout(function () {
                                deal.dealCard(dealer, {
                                    'index': 1,
                                    'rank': '',
                                    'suit': '',
                                    'value': 0,
                                    'type': 'down'
                                }, true);

                                $('.splitB').toggleClass('disabled', response.data.player[0].blackjack_value !== response.data.player[1].blackjack_value);
                                $.blockPlayButton(false);
                                $.blockSidebarButtons(false);
                                callback();
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            });
        }

    }

    function renderCard(ele, sender, item, isHiddenByServer, secretRevealOptions) {
        let hand, i, card;

        if (!item) {
            hand = sender.getHand();
            i = hand.length - 1;
            card = new Card(hand[i]);
        } else {
            hand = dealer.getHand();
            card = new Card(hand[1]);
        }

        if (secretRevealOptions !== undefined) {
            card.rank = secretRevealOptions.rank;
            card.suit = secretRevealOptions.suit;
            card.value = secretRevealOptions.value;
            card.type = 'up';

            dealer.getHand()[1] = card;
        }

        let rank = card.getRank(), suit = card.getSuit(), posx = 0, posy = 20, speed = 200, cards = ele + ' .card-' + i, type = card.getType();
        if (i > 0) posx -= 50 * i;

        if (!item) {
            $(ele).append(
                `<div class="${(isHiddenByServer !== undefined && isHiddenByServer === true ? 'dealerSecret ' : '')} blackjack_card card-${i} ${type}">
                    <span class="pos-0 ${suit === 'diamonds' || suit === 'hearts' ? 'text-danger' : '' }">
                        <span class="rank">&nbsp;</span>
                        <span class="suit">&nbsp;</span>
                    </span>
                </div>`
            );

            if (ele === '#phand') {
                posy = 340;
                speed = 500;

                $(`${ele} .card-${i}`).attr('id', 'pcard-' + i);
                if (hand.length < 2) {
                    setTimeout(function () {
                        player.getScore(function (response) {
                            $('.player').html(response).fadeIn('fast');
                        });
                    }, 500);
                }
            }
            else if(ele === '#shand') {
                posy = 120;
                speed = 500;

                $(`${ele} .card-${i}`).attr('id', 'scard-' + i);
                if (hand.length < 2) {
                    setTimeout(function () {
                        player.getScore(function (response) {
                            $('.split').html(response).fadeIn('fast');
                        });
                    }, 500);
                }
            }
            else if(ele === '#dhand') {
                $(`${ele} .card-${i}`).attr('id', 'dcard-' + i);
                if (hand.length < 2) {
                    setTimeout(function () {
                        dealer.getScore(function (response) {
                            $('.dealer').html(response).fadeIn('fast');
                        });
                    }, 100);
                }
            }

            $(`${ele} .card-${i}`).css({'z-index': i, top: 0, right: 0 }).animate({
                'top': posy,
                'right': posx
            }, speed);
        } else cards = item;

        if (type === 'up' || item) {
            if (secretRevealOptions === undefined) $(cards).find('span.rank').html(rank);
            else $('.dealerSecret span.rank').html(secretRevealOptions.rank);
            $(cards).find('span.suit').html('<i class="' + deck.toIcon(deck[card.getIndex()]) + '"></i>');
        }
    }

    function resetBoard() {
        blackjack = false;
        splitted = false;
        $('#dhand').html('');
        $('#phand').html('');
        $('#shand').html('');
        $('#phand, #dhand, #shand').css('left', 0);
        $('.dealer, .player, .playerSplit').fadeOut('fast');
        $('.insurance, .arrowContainer').fadeOut('fast');
        $('.double').removeClass('disabled');

        player.resetHand();
        dealer.resetHand();
        split.resetHand();
    }

    game = new Game();
    deal = new Deal();
    player = new Player('#phand', '.player');
    split = new Player('#shand', '.playerSplit');
    dealer = new Player('#dhand', '.dealer');

    $(container).append(`
        <i class="fas fa-blackjack-ribbon ignoresUpdates"></i>
        <div class="deck">
            <div><div></div></div>
            <div><div></div></div>
            <div><div></div></div>
            <div><div></div></div>
        </div>

        <div class="blackjack_score dealer" style="display: none"></div>
        <div class="blackjack_score player" style="display: none"></div>
        <div class="blackjack_score playerSplit" style="display: none"></div>

        <div class="arrowContainer arrowPlayer" style="display: none">
            <div class="arrow"><div></div></div>
            <div class="arrow"><div></div></div>
        </div>
        <div class="arrowContainer arrowSplit" style="display: none">
            <div class="arrow"><div></div></div>
            <div class="arrow"><div></div></div>
        </div>

        <div class="blackjack_container">
            <div id="dealer">
                <div id="dhand"></div>
            </div>
            <div id="split">
                <div id="shand"></div>
            </div>
            <div id="player">
                <div id="phand"></div>
            </div>
        </div>
    `);
}, function() {
    return {
        'empty': 'data'
    };
}, function() {
    if($.isExtendedGameStarted()) {
        game.newGame(() => {
            $('.play-button').fadeOut('fast');
            $('.double, .hit, .stand, .splitB').fadeIn('fast');
        });
    } else {
        $('.play-button').fadeIn('fast');
        $('.double, .hit, .stand, .splitB').fadeOut('fast');
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

$.on('/game/blackjack', function() {
    $.render('blackjack');

    $.sidebar(function(component) {
        component.bet();

        const buttonHandler = function() {
            $('.stand').toggleClass('active', true);
            $('.hit, .double, .splitB').removeClass('active');
        };

        component.buttons(null, 'mt-2')
            .add($.lang('general.stand'), buttonHandler, 'stand', false)
            .add($.lang('general.hit'), buttonHandler, 'hit', false);
        component.buttons(null, 'mt-2')
            .add($.lang('general.double'), buttonHandler, 'double', false)
            .add($.lang('general.split'), buttonHandler, 'splitB', false);
        $('.double').removeClass('active');

        $('.double, .hit, .stand, .splitB').hide();

        $('.hit').on('click', function() {
            $('.double').addClass('disabled');
            player.hit();
        });

        $('.stand').on('click', function() {
            player.stand();
        });

        $('.double').on('click', function() {
            if($(this).hasClass('disabled')) return;
            player.double();
        });

        $('.splitB').on('click', function() {
            if($(this).hasClass('disabled')) return;
            player.split();
        });

        component.play();
        component.footer().help().sound().stats();
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/blackjack.css']);

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

        return card === undefined ? icons['spades'] : icons[card.type];
    },
    toString: function(card) {
        return card.value + `<i class="${deck.toIcon(card)}"></i>`;
    }
};
