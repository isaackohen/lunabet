    import gsap from 'gsap';

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
            return `<i class="${deck.toIcon(card)}" style="color: ${card.type === 'diamonds' || card.type === 'hearts' ? '#e86376' : '#2b2f3b'}"></i>`;
        }
    };

    export default {
        computed: {
            ...mapGetters(['currency', 'currencies'])
        },
        data() {
            return {
                _id: null,

                chipDisplayValue: 1.00000000,
                chip: 0.00000001,
                bet: {}
            }
        },
        mounted() {
            Bus.$on('sidebar:chipSelect', (chip) => {
                this.chip = chip.value;
                this.chipDisplayValue = chip.displayValue;
            });
        },
        methods: {
            gameDataRetrieved() {
                if(this.gameInstance.game.data.timestamp > 0) {
                    const now = +new Date() / 1000;
                    const left = parseInt(now - this.gameInstance.game.data.timestamp);

                    if (left > 0 && left <= 15) this.countdown($('.game-baccarat').find('.timer'), {
                        timePassed: left
                    });

                    _.forEach(this.gameInstance.game.data.players, (data) => this.addPlayer(data));
                }

                const vm = this;
                $('.cell').on('click', function() {
                    let stack = $(this).find('.bet-stack'), b = $(this).attr('data-chip');
                    if(stack.length === 0) {
                        stack = $('<div class="bet-stack"></div>');
                        stack.hide().fadeIn('fast');
                        $(this).append(stack);
                        const e = $(`<div class="user-chip" data-display-value="${vm.chipDisplayValue}" data-token-value="${vm.chip}">${vm.abbreviate(vm.chipDisplayValue)}</div>`);
                        stack.append(e);
                    } else {
                        const colors = {
                            1: '#828f9a',
                            10: 'rgb(0, 188, 212)',
                            100: 'rgb(76, 175, 80)',
                            1000: 'rgb(139, 195, 74)',
                            10000: 'rgb(205, 220, 57)',
                            100000: 'rgb(192, 202, 51)',
                            1000000: 'rgb(255, 235, 59)',
                            10000000: 'rgb(251, 192, 45)',
                            100000000: 'rgb(255, 179, 0)',
                            1000000000: 'rgb(251, 140, 0)',
                            10000000000: 'rgb(244, 81, 30)',
                            100000000000: '#AA88FF'
                        };

                        const e = stack.find('.user-chip');
                        e.attr('data-display-value', (vm.getBet(b) + vm.chip) * 100000000)
                            .attr('data-token-value', vm.getBet(b) + vm.chip)
                            .html(vm.abbreviate((vm.getBet(b) + vm.chip) * 100000000));

                        _.forEach(Object.keys(colors), (c) => {
                            if((vm.getBet(b) + vm.chip) * 100000000 >= c) e.css({ 'background-color': colors[c] });
                        });
                    }

                    vm.setBet(b, vm.getBet(b) + vm.chip);
                    vm.playSound('/sounds/click.mp3');
                });
            },
            customWagerCalculation() {
                return parseFloat(this.rawBitcoin(this.currency, parseFloat($('#bet').html())));
            },
            clear() {
                this.bet = {};
                $('.bet-stack').fadeOut('fast', () => $('.bet-stack').remove());
                $('#bet').html(this.rawBitcoin(this.currency, 0));
            },
            customWagerIncrease(category) {
                if(category === 'initialBet') return bet;
                if(this.gameInstance.game.autoBetSettings[category].action === 'reset') this.bet = this.gameInstance.game.autoBetSettings.initialBet;
                else if(this.gameInstance.game.autoBetSettings[category].value > 0)
                    _.forEach(this.bet, (value, key) => this.bet[key] = this.bet[key] + ((( this.gameInstance.game.autoBetSettings[category].value / 100) * this.bet[key])));
                setTimeout(this.setBet, 5000);
            },
            extendedAutoBetHandle(take) {},
            getBet(chip) {
                if(!this.bet[chip]) return 0;
                return this.bet[chip];
            },
            setBet(chip = null, value = null) {
                if(chip !== null && value !== null) this.bet[chip] = value;
                let total = 0;
                for(let i = 0; i < Object.keys(this.bet).length; i++) total += this.bet[Object.keys(this.bet)[i]];
                $('#bet').html(this.rawBitcoin(this.currency, total));
            },
            getClientData() {
                return {
                    bet: this.bet
                }
            },
            getSidebarComponents() {
                return [
                    { name: 'label', data: { label: this.$i18n.t('general.wager') } },
                    { name: 'wager-chips' },
                    { name: 'auto-bets' },
                    { name: 'play' },
                    { name: 'footer', data: { buttons: ['help', 'sound', 'stats'] } }
                ];
            },
            callback(response) {
                if(this.gameInstance.bettingType === 'manual') $('.play-button').addClass('disabled');
            },
            show(data) {
                this._id = Math.random();
                let id = this._id;

                const v = () => id === this._id;

                $('.baccaratCardsPlayer .score, .baccaratCardsBanker .score').stop().removeClass('win').removeClass('draw').fadeOut(300);
                $('.baccaratCardsPlayer .card, .baccaratCardsBanker .card').stop().fadeOut(300, function() {
                    $(this).remove();
                });

                setTimeout(() => {
                    if(!v()) return;

                    this.chain(data.player.length, 500, (i) => {
                        if(!v()) return;

                        this.sendCard(this.createCard('Player', data.player[i - 1]), i - 1);
                        if(i === data.player.length) {
                            setTimeout(() => {
                                if(!v()) return;
                                $('.baccaratCardsPlayer .score').html(data.score.player).fadeIn('fast');

                                this.chain(data.dealer.length, 500, (i) => {
                                    if(!v()) return;
                                    this.sendCard(this.createCard('Banker', data.dealer[i - 1]), i - 1);

                                    if (i === data.dealer.length) {
                                        $(`[data-container] .user`).slideUp('fast', () => $('[data-container] .user').remove());
                                        $(`[data-container] .empty`).fadeIn('fast');

                                        setTimeout(() => {
                                            if(!v()) return;
                                            $('.baccaratCardsBanker .score').html(data.score.dealer).stop().fadeIn('fast');

                                            $('.baccaratCardsPlayer .card, .baccaratCardsPlayer .score').toggleClass('win', data.status === 'player');
                                            $('.baccaratCardsBanker .card, .baccaratCardsBanker .score').toggleClass('win', data.status === 'banker');
                                            $('.baccaratCardsPlayer .card, .baccaratCardsPlayer .score').toggleClass('draw', data.status === 'draw');
                                            $('.baccaratCardsBanker .card, .baccaratCardsBanker .score').toggleClass('draw', data.status === 'draw');

                                            $('.play-button').removeClass('disabled');
                                        }, 500);
                                    }
                                });
                            }, 500);
                        }
                    });
                }, 300);
            },
            createCard(hand, instance) {
                const e = $(`<div class="card">
                    <div class="value" style="color: ${instance.type === 'diamonds' || instance.type === 'hearts' ? '#e86376' : '#2b2f3b'}">${instance.value}</div>
                    <div class="icon">${deck.toString(instance)}</div>
                </div>`)[0];
                gsap.set(e, { x: $('.deck').offset().left, y: $('.deck').offset().top, overwrite: false });
                return {
                    element: e,
                    hand: hand,
                    transform: {
                        x: () => gsap.getProperty(e, "x"),
                        y: () => gsap.getProperty(e, "y")
                    },
                    first: { x: 0, y: 0 },
                    last: { x: 0, y: 0 }
                };
            },
            sendCard(e, handIndex) {
                const stagger = 0.05;
                const duration = 0.5;

                const tl = gsap.timeline();

                e.element.style.transform = "none";
                let rect = e.element.getBoundingClientRect();
                e.first.x = rect.left;
                e.first.y = rect.top;

                $(e.element).hide();
                $(`.baccaratCards${e.hand}`).append(e.element);
                $(e.element).fadeIn('fast');

                rect = e.element.getBoundingClientRect();
                e.last.x = rect.left;
                e.last.y = rect.top;

                tl.set(e.element, {
                    x: e.transform.x() + e.first.x - e.last.x,
                    y: e.transform.y() + e.first.y - e.last.y
                });

                tl.to(e.element, duration, {
                    x: 20 * handIndex,
                    y: -180 * handIndex
                }, stagger);

                this.playSound('/sounds/card_slide.mp3', 100);
            },
            addPlayer(data) {
                _.forEach(data.data.bet, (value, key) => {
                    $(`[data-container="${key}"] .empty`).hide();
                    $(`[data-container="${key}"] .os-content`).append(`<div class="user" onclick="window.open('/profile/${data.user._id}', '_blank')">
                        <div class="avatar"><img src="${data.user.avatar}" alt></div>
                        <div class="name">${data.user.name}</div>
                        <div class="bet">
                            ${this.rawBitcoin(data.game.currency, value)} ${this.currencies[data.game.currency].name.toUpperCase()}
                        </div>
                    </div>`);
                });
            },
            multiplayerEvent(event, data) {
                switch (event) {
                    case 'MultiplayerGameBet':
                        this.addPlayer(data);
                        break;
                    case 'MultiplayerGameFinished':
                        this.show(data.data);
                        break;
                    case 'MultiplayerTimerStart':
                        this.countdown($('.game-baccarat').find('.timer'), {
                            timePassed: 0
                        });

                        //$.setFooterMultiplayerSeed(data.client_seed, data.nonce);
                        break;
                }
            }
        }
    }