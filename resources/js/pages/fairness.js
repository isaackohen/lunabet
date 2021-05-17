const hljs = require('highlight.js/lib/core');

import Dice from './fairness/games/Dice';
import Keno from './fairness/games/Keno';
import Limbo from './fairness/games/Limbo';
import Coinflip from './fairness/games/Coinflip';
import Crash from './fairness/games/Crash';
import Mines from './fairness/games/Mines';
import Plinko from './fairness/games/Plinko';
import Roulette from './fairness/games/Roulette';
import Wheel from './fairness/games/Wheel';
import Stairs from './fairness/games/Stairs';
import Tower from './fairness/games/Tower';
import Cards from './fairness/games/Cards';
import Triple from './fairness/games/Triple';
import Slots from './fairness/games/Slots';

const bundle = {
    'dice': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Dice().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'keno': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Keno().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'limbo': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Limbo().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'coinflip': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Coinflip().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'crash': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Crash().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'mines': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            let result = [];
            for(let bombs = 2; bombs <= 24; bombs++) result.push(`${bombs} bombs: ${new Mines().verify({ serverSeed, clientSeed, nonce }).slice(0, bombs).reverse().join(', ')}`);
            return result;
        }
    },
    'plinko': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Plinko().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'roulette': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Roulette().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'wheel': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return [
                new Wheel().verify({ serverSeed, clientSeed, nonce }, 14) + ' (Double)',
                new Wheel().verify({ serverSeed, clientSeed, nonce }, 56) + ' (X50)'
            ];
        }
    },
    'blackjack': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            let result = [];
            _.forEach(new Cards().verifyBlackjack({ serverSeed, clientSeed, nonce }), function(index) {
                result.push(deck.toString(deck[index + 1]));
            });
            return result;
        }
    },
    'hilo': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            let result = [];
            _.forEach(new Cards().verifyHilo({ serverSeed, clientSeed, nonce }), function(index) {
                result.push(deck.toString(deck[index + 1]));
            });
            return result;
        }
    },
    'videopoker': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            let result = [];
            _.forEach(new Cards().verifyVideoPoker({ serverSeed, clientSeed, nonce }), function(index) {
                result.push(deck.toString(deck[index + 1]));
            });
            return result;
        }
    },
    'baccarat': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            let result = [];
            _.forEach(new Cards().verifyBaccarat({ serverSeed, clientSeed, nonce }), function(index) {
                result.push(deck.toString(deck[index + 1]));
            });
            return result;
        }
    },
    'diamonds': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Cards().verifyDiamondPoker({ serverSeed, clientSeed, nonce });
        }
    },
    'stairs': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            let result = [];
            for(let i = 1; i <= 7; i++) {
                result.push(i + ' mines: ' + new Stairs().verify({serverSeed, clientSeed, nonce}, i).join(' / '));
            }
            return result;
        }
    },
	    'slots': {
        verify: function({ serverSeed, clientSeed, nonce }) {
         return new Slots().verify({ serverSeed, clientSeed, nonce });
        }
    },
		    'triple': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            return new Triple().verify({ serverSeed, clientSeed, nonce });
        }
    },
    'tower': {
        verify: function({ serverSeed, clientSeed, nonce }) {
            let result = [];
            for(let i = 1; i <= 4; i++) {
                result.push(i + ' mines: ' + new Tower().verify({serverSeed, clientSeed, nonce}, i).join(' / '));
            }
            return result;
        }
    }
};

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

$.on('/fairness', function() {
    $('[data-toggle-tab]').on('click', function() {
        if($(this).hasClass('active')) return;
        $(`[data-toggle-tab]`).removeClass('active');
        $(`[data-toggle-tab="${$(this).attr('data-toggle-tab')}"]`).addClass('active');

        $('[data-tab]').hide();
        $(`[data-tab="${$(this).attr('data-toggle-tab')}"]`).fadeIn('fast');
    });

    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
    $.each($('code'), function(i, e) {
        hljs.highlightBlock(e);
    });

    let currentGame = 'dice';

    const fetch = function() {
        const clientSeed = $('#clientSeed').val(), nonce = parseInt($('#nonce').val()), serverSeed = $('#serverSeed').val();
        if(clientSeed.length < 1 || isNaN(nonce) || serverSeed.length < 1) return;

        if(bundle[currentGame] === undefined) {
            $.error(`Unknown game ${currentGame}, contact support for more information`);
            return;
        }

        const result = bundle[currentGame].verify({
            serverSeed: serverSeed,
            clientSeed: clientSeed,
            nonce: nonce
        });

        $('#f_result').html('');
        if(typeof result === "object" || typeof result === "array") _.forEach(result, function(e) {
            $('#f_result').append(`<div>${e}</div>`);
        });
        else $('#f_result').html(result);
    };

    $('#clientSeed, #serverSeed, #nonce').on('input', fetch);

    $('.fairness-games .game').on('click', function() {
        $('.fairness-games .game').removeClass('active');
        $(this).addClass('active');
        currentGame = $(this).attr('data-fairness-game');
        fetch();
    });

    if($.urlParam('verify') != null) {
        let data = $.urlParam('verify').split('-');
        let game = data[0], serverSeed = data[1], clientSeed = data[2], nonce = data[3];

        $('[data-toggle-tab="calculator"]').click();
        $('#nonce').val(nonce);
        currentGame = game;
        $('#serverSeed').val(serverSeed);
        $('#clientSeed').val(clientSeed);
        fetch();
    }
}, ['/css/pages/fairness.css']);
