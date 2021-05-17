const {Howl} = require('howler');
import bitcoin from 'bitcoin-units';
let playTimeout = false;

class SidebarComponentBuilder {

    constructor() {
        $('.game-sidebar').append(`<div class="game-sidebar-tabs"><div class="game-sidebar-tab active">${$.lang('general.bets.manual')}</div></div>`);
        $('.game-sidebar-tab:first-child').on('tab:selected', function() {
            if(currentGameInstance.game.autoBetSettings.state || currentGameInstance.game.extendedState === 'in-progress') return;
            $('.auto-bet-container').fadeOut('fast');
            currentGameInstance.game.bettingType = 'manual';
            $('.autoBetPick').removeClass('autoBetPick');
            $('.play-button').html($.lang('general.play'));
        });
    }

    autoBets() {
        $('.game-sidebar-tabs').append(`<div class="game-sidebar-tab">${$.lang('general.bets.auto')}</div>`);
        $('.game-sidebar-tab:last-child').on('tab:selected', function() {
            if(currentGameInstance.game.autoBetSettings.state || currentGameInstance.game.extendedState === 'in-progress') return;
            $('.auto-bet-container').fadeIn('fast');
            currentGameInstance.game.bettingType = 'auto';
            $('.play-button').html($.lang('general.start'));
        });

        $('.game-sidebar').append(
            `<div class="auto-bet-container" style="display: none;">
                 <div class="auto-bet-overlay" style="display: none;"></div>
                 <div class="game-sidebar-label mt-2">${$.lang('general.bets.games')}</div>
                 <div class="wager-classic input-override">
                    <input data-toggle="tooltip" data-placement="top" title="${$.lang('general.bets.auto_games_blocked')}" class="autoBetGames" readonly type="text" value="&#8734;" placeholder="${$.lang('general.bets.games')}">
                    <div class="wager-input-controls">
                        <div class="control active autoBetInfinity"><i class="far fa-infinity"></i></div>
                    </div>
                 </div>
                 <div class="game-sidebar-label mt-2">${$.lang('general.bets.on_win')}</div>
                 <div class="auto-bet-controls" data-auto-bet-target="win">
                     <button class="btn btn-primary active" data-auto-bet-reset>${$.lang('general.bets.reset')}</button>
                     <button class="btn btn-primary" data-auto-bet-increase>${$.lang('general.bets.increase')}</button>
                     <span class="input-append-percent"><input type="text" value="0" data-auto-bet-value><span>%</span></span>
                 </div>
                 <div class="game-sidebar-label mt-2">${$.lang('general.bets.on_loss')}</div>
                 <div class="auto-bet-controls" data-auto-bet-target="loss">
                     <button class="btn btn-primary active" data-auto-bet-reset>${$.lang('general.bets.reset')}</button>
                     <button class="btn btn-primary" data-auto-bet-increase>${$.lang('general.bets.increase')}</button>
                     <span class="input-append-percent"><input type="text" value="0" data-auto-bet-value><span>%</span></span>
                 </div>
                 <div class="custom-control custom-checkbox mt-2">
                    <label>
                        <input type="checkbox" class="custom-control-input victoryStop">
                        <div class="custom-control-label">${$.lang('general.bets.victory_stop')}</div>
                    </label>
                </div>
             </div>`);

        $('[data-auto-bet-target] [data-auto-bet-reset]').on('click', function() {
            currentGameInstance.game.autoBetSettings[$(this).parent().attr('data-auto-bet-target')].action = 'reset';
            $(`[data-auto-bet-target="${$(this).parent().attr('data-auto-bet-target')}"] button`).removeClass('active');
            $(this).addClass('active');
        });
        $('[data-auto-bet-target] [data-auto-bet-increase]').on('click', function() {
            currentGameInstance.game.autoBetSettings[$(this).parent().attr('data-auto-bet-target')].action = 'increase';
            $(`[data-auto-bet-target="${$(this).parent().attr('data-auto-bet-target')}"] button`).removeClass('active');
            $(this).addClass('active');
        });
        $('[data-auto-bet-target] [data-auto-bet-value]').on('input', function() {
            currentGameInstance.game.autoBetSettings[$(this).parent().parent().attr('data-auto-bet-target')].value = parseInt($(this).val());
        });
        $(`${$.sidebarSelector()} .autoBetInfinity`).on('click', function() {
            $(this).hasClass('active') ? $(`${$.sidebarSelector()} .autoBetGames`).removeAttr('readonly') : $(`${$.sidebarSelector()} .autoBetGames`).attr('readonly', 'readonly');
            $(this).hasClass('active') ? $(`${$.sidebarSelector()} .autoBetGames`).val('0') : $(`${$.sidebarSelector()} .autoBetGames`).val("∞");
            $(this).toggleClass('active');

            currentGameInstance.game.autoBetSettings.games = 0;
        });

        $('.autoBetGames').keypress(function(event) {
            if ((event.which !== 46) && (event.which < 48 || event.which > 57)) event.preventDefault();
        });

        $('.autoBetGames').on('input', function() {
            currentGameInstance.game.autoBetSettings.games = parseInt($(`${$.sidebarSelector()} .autoBetGames`).val());
        });

        $('.victoryStop').on('click', function() {
            currentGameInstance.game.autoBetSettings.stopOnWin = !currentGameInstance.game.autoBetSettings.stopOnWin;
        });
        return this;
    }

    label(text, cls = '') {
        $('.game-sidebar').append(`<div class="game-sidebar-label ${$('.game-sidebar-label').length > 0 ? 'mt-2' : ''} ${cls}">${text}</div>`);
        return this;
    }

    buttons(text = null, cls = '') {
        if(text != null) this.label(text, cls);
        const id = $.randomId();
        $('.game-sidebar').append($(`<div class="game-sidebar-buttons-container ${id} ${cls}"></div>`));
        return new SidebarComponentButtons(id);
    }

    input(text = null, inputCallback, value = null) {
        if(text != null) this.label(text);
        const input = $(`<input type="text" value="${value}">`);
        $('.game-sidebar').append(input);
        input.on('input', function() {
            inputCallback($(this).val());
        });
    }

    chips(callback, values = [[1, 1e-8], [10, 1e-7], [100, 0.000001], [1000, 0.00001], [10000, 0.0001], [100000, 0.001], [1000000, 0.01], [10000000, 0.1], [100000000, 1], [1000000000, 10], [10000000000, 100], [100000000000, 1000], [1000000000000, 10000]]) {
        this.label($.lang('general.chip', { value: values[0][0].toFixed(8) }), 'chipValueText');
        $('.game-sidebar').append(`
            <div class="wager-chip wager-selector os-host-flexbox"></div>
        `);

        _.forEach(values, function(v) {
            $('.wager-selector').append(`
                <div class="chip" data-display="${v[0].toFixed(8)}" data-value="${v[1].toFixed(8)}">
                    ${$.abbreviate(v[0])}
                </div>
            `);
        });

        $('.wager-selector .chip').on('click', function() {
            $('.wager-selector .chip.active').removeClass('active');
            $(this).addClass('active');

            $('.chipValueText').html($.lang('general.chip', { value: $(this).data('value') }));
            currentGameInstance.game.chipCallback(parseFloat($(this).attr('data-value')), parseFloat($(this).data('display')));
        });

        $('.wager-selector').overlayScrollbars({
            scrollbars: {
                autoHide: 'leave'
            }
        });

        currentGameInstance.game.chipCallback = callback;
        $('.wager-selector .chip:nth-child(1)').click();
    }

    bet() {
        this.label($.lang('general.wager'));
        $('.game-sidebar').append(`
                           <div class="wager-classic wager-selector">
                <input type="text" value="${$.getMinBet()}" placeholder="${$.lang('general.wager')}">
                <div class="wager-input-controls">
                    <div class="control"><i class="fas fa-slash"></i></div>
                    <div class="control"><i class="fas fa-asterisk"></i></div>
                    ${$.isGuest() ? '' : `<div class="control" style="padding-top: 4px;">MAX</div>`}
                </div>
			${$.getMinWagerSelector()}
            </div>
        `);
		
		   $('.wager-controls .control').on('click', function() {
            const input = $(`${$.sidebarSelector()} .wager-selector input`);
            if(input.val().length === 0 || isNaN(input.val()) || parseFloat(input.val()) < 0) input.val('0.00');
            const value = parseFloat(input.val());
            var thisId = $(this).attr("id");
              switch (thisId) {
                case ('01'): input.val((value + 0.1).toFixed(2)); break;
                case ('05'): input.val((value + 0.5).toFixed(2)); break;
                case ('1'): input.val((value + 1.0).toFixed(2)); break;
                case ('2'): input.val((value + 2.0).toFixed(2)); break;
                case ('5'): input.val((value + 5.0).toFixed(2)); break;
                case ('10'): input.val((value + 10.0).toFixed(2)); break;
                case ('010'): input.val((value + 0.0001).toFixed(7)); break;
                case ('050'): input.val((value + 0.0005).toFixed(7)); break;
                case ('011'): input.val((value + 0.001).toFixed(7)); break;
                case ('055'): input.val((value + 0.005).toFixed(7)); break;
            }
            $.triggerSidebarUpdate();
        });

        $('.wager-selector').keypress(function(event) {
            if ((event.which !== 46 || $(this).val().indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) event.preventDefault();
        });

        $('.wager-selector').on('input', function() {
            $.triggerSidebarUpdate();
        });

        $('.wager-selector .wager-input-controls .control:nth-child(1)').on('click', function() {
            const input = $(`${$.sidebarSelector()} .wager-selector input`);
            if(input.val().length === 0 || isNaN(input.val()) || parseFloat(input.val()) < 0) {
                input.val($.getMinBet());
                return;
            }
            const value = parseFloat(input.val());
            input.val((value / 2).toFixed(8));
            $.triggerSidebarUpdate();
        });

        $('.wager-selector .wager-input-controls .control:nth-child(2)').on('click', function() {
            const input = $(`${$.sidebarSelector()} .wager-selector input`);
            if(input.val().length === 0 || isNaN(input.val()) || parseFloat(input.val()) < 0) {
                input.val($.getMinBet());
                return;
            }
            const value = parseFloat(input.val());
            input.val((value * 2).toFixed(8));
            $.triggerSidebarUpdate();
        });

        $('.wager-selector .wager-input-controls .control:nth-child(3)').on('click', function() {
            const input = $(`${$.sidebarSelector()} .wager-selector input`);
            input.val($('.wallet .balance').html());
            $.triggerSidebarUpdate();
        });
        return this;
    }

    profit() {
        this.label($.lang('general.profit'));
        $('.game-sidebar').append(`<input class="profit" type="text" readonly value="${$.getMinBet()}">`);
        return this;
    }

    multiplayerBets() {
        $('.game-sidebar').append(`<div class="sidebarMultiplayerBets"></div>`);
        return this;
    }

    play() {
        $('.game-sidebar').append(`<button class="btn btn-primary m-4 play-button">${$.lang('general.play')}</button>`);
        $('.play-button').on('click', function() {
            if($(this).hasClass('disabled')) return;

            const stop = function() {
                currentGameInstance.game.autoBetSettings.state = false;
                $('.auto-bet-overlay').fadeOut('fast');
                $('.play-button').html($.lang('general.start'));
                $.blockWager(false);
            };

            const play = function(successCallback = null, errorCallback = null) {
                if(playTimeout) return;

                $.blockPlayButton(true);
                if($.isExtendedGameStarted()) {
                    if(currentGameInstance.game.extendedAutoBetHandler == null || $.currentBettingType() === 'manual') $.finishExtended();
                } else $.whisper('Play', $.sidebarData().toJSON()).then(function (response) {
                    $('.game-history .history').removeClass('highlight');
                    $('.resultPopup').stop().fadeOut('fast', function() {
                        $(this).remove();
                    });

                    if(response.game !== undefined) { // instanceof *QuickGame
                        setTimeout(function() { $.pushStats(response.game); }, response.game.delay);
                    }  else if (response.type === 'extended') { // instanceof ExtendedGame

                        $.blockWager(true);
                        $.blockSidebarButtons(true);
                        $('.play-button').html($.lang('general.cancel'));

                        currentGameInstance.game.extendedId = response.id;
                        currentGameInstance.game.extendedState = 'in-progress';
                        $.blockPlayButton(false);

                     } else if (response.type === 'multiplayer') {
                      currentGameInstance.game.extendedId = response.id;
                      currentGameInstance.game.extendedState = response.canBeFinished ? 'in-progress' : 'finished';
                      $.blockPlayButton(false);
                    }
                    currentGameInstance.game.callback(response);
                    if(successCallback != null) successCallback(response);

                    if($.isGuest()) {
                        setTimeout(function() {
                            if(this.guest_notified === undefined) this.guest_notified = 0;
                            this.guest_notified += 1;
                            if(this.guest_notified % 3 === 1) {
                                $.modal('auth');
                                if ($.currentBettingType() === 'auto' && currentGameInstance.game.autoBetSettings.state) stop();
                            }
                        }, 2500);
                    }
                }, function (error) {
                    if(error === 0) {
                        console.log('Previous request timed out');
                        errorCallback(0);
                        return;
                    }

                    $.blockPlayButton(false);
                    if(errorCallback != null) errorCallback(error);

                    if (error >= 1) {
                        currentGameInstance.game.errorCallback(error);
                        return;
                    }

                    if (!_.isInteger(error)) {
                        $.error($.parseValidation(error, {
                            'api_id': 'api_id',
                            'bet': 'bet',
                            'demo': 'demo',
                            'quick': 'quick',
                            'data': 'data'
                        }));
                        return;
                    }

                    switch (error) {
                        case -1:
                            $.error($.lang('general.error.wager_min', { value: $.getMinBet() }));
                            break;
                        case -2:
                            $.error($.lang('general.error.auth'));
                            $.auth();
                            break;
                        case -3:
                            $.error($.lang('general.error.unknown_game'));
                            break;
                        case -4:
                            $.error($.lang('general.error.invalid_wager'));
                            break;
                        case -5:
                            $.error($.lang('general.error.disabled'));
                            break;
                        case -6:
                            if($.currentBettingType() === 'manual') $.error($.lang('general.error.disabled_bets'));
                            else {
                                if(currentGameInstance.game.autoBetSettings.unavailableInterval !== undefined)
                                    clearInterval(currentGameInstance.game.autoBetSettings.unavailableInterval);

                                if($.autoBetActive()) currentGameInstance.game.autoBetSettings.unavailableInterval = setInterval(function() {
                                    playTimeout = false;
                                    play(successCallback, errorCallback);
                                }, 800);
                            }
                            break;
                        case -7:
                            if($.isGuest()) $.auth();
                            $.error($.lang('general.error.disabled_demo_bets'));
                            break;
                        case -8:
                            redirect(window.location.pathname);
                            break;
						case -9:
                            $.error($.lang('general.error.wager_max', { value: $.getMaxBet() }));
                            break;
                    }
                });
            };

            if(currentGameInstance.game.bettingType === 'manual') play();
            else {
                currentGameInstance.game.autoBetSettings.stop = stop;
                if(currentGameInstance.game.autoBetSettings.state) stop();
                else {
                    currentGameInstance.game.autoBetSettings.state = true;
                    $('.auto-bet-overlay').fadeIn('fast');
                    $('.play-button').html($.lang('general.stop'));
                    $.blockWager(true);

                    const next = function () {
                        if(currentGameInstance.game.autoBetSettings.games > 0 && currentGameInstance.game.autoBetSettings.currentIteration >= currentGameInstance.game.autoBetSettings.games) stop();
                        else {
                            if(playTimeout) {
                                setTimeout(function() {
                                    if(!currentGameInstance.game.autoBetSettings.state) return;
                                    next();
                                }, 800);
                                return;
                            }

                            if(+new Date() < currentGameInstance.game.autoBetSettings.timeout) {
                                setTimeout(next, currentGameInstance.game.autoBetSettings.timeout - +new Date());
                                console.log('Next autobet:', (currentGameInstance.game.autoBetSettings.timeout - +new Date()) + 'ms');
                                return;
                            }

                            currentGameInstance.game.autoBetSettings.timeout = +new Date() + 800;

                            const handleNext = function(win) {
                                if (win && currentGameInstance.game.autoBetSettings.stopOnWin) stop();
                                else {
                                    const handle = currentGameInstance.game.autoBetSettings.customBetIncrease !== undefined ? currentGameInstance.game.autoBetSettings.customBetIncrease
                                        : function(category) {
                                            if(currentGameInstance.game.autoBetSettings[category].action === 'reset') $.sidebarData().bet(currentGameInstance.game.autoBetSettings.initialBet);
                                            else if(currentGameInstance.game.autoBetSettings[category].value > 0) $.sidebarData().bet($.sidebarData().bet() + ((( currentGameInstance.game.autoBetSettings[category].value / 100) * $.sidebarData().bet())));
                                        };

                                    handle(win ? 'win' : 'loss');
                                    if (currentGameInstance.game.autoBetSettings.state) next();
                                }
                            };

                            if(currentGameInstance.game.extendedAutoBetHandler == null) play((response) => handleNext(response.game.win), stop);
                            else {
                                play(function() {
                                    currentGameInstance.game.extendedAutoBetHandler(function() {
                                        $.finishExtended(true, function(response) {
                                            handleNext(response.game.status === 'win');
                                        });
                                    });
                                });
                            }

                            currentGameInstance.game.autoBetSettings.currentIteration++;
                        }
                    };

                    currentGameInstance.game.autoBetSettings.initialBet = currentGameInstance.game.autoBetSettings.customBetIncrease === undefined ? $.sidebarData().bet()
                        : currentGameInstance.game.autoBetSettings.customBetIncrease('initialBet');
                    currentGameInstance.game.autoBetSettings.currentIteration = 0;
                    currentGameInstance.game.autoBetSettings.next = next;
                    next();
                }
            }
        });
        return this;
    }

    history(api_id, scrollable = false) {
        return new GameHistoryComponent(api_id, scrollable);
    }

    footer() {
        return new SidebarFooterComponent();
    }

}

class SidebarComponentButtons {

    constructor(id) {
        this.id = id;
    }

    add(text, callback, cls = '', autoPick = true) {
        const first = $(`.game-sidebar-buttons-container.${this.id}`).find('.game-sidebar-buttons-container-button').length === 0;
        const id = $.randomId();
        $(`.game-sidebar-buttons-container.${this.id}`).append(`<div class="game-sidebar-buttons-container-button ${id} ${first ? 'active' : ''} ${cls}">${text}</div>`);

        const container = `.game-sidebar-buttons-container.${this.id}`;
        $(document).on('click', `.game-sidebar-buttons-container-button.${id}`, function() {
            if($(this).hasClass('disabled')) return;
            $(`${container}`).find('.active').removeClass('active');
            $(`.game-sidebar-buttons-container-button.${id}`).addClass('active');
            callback($(`${$.sidebarSelector()} .game-sidebar-buttons-container-button.${id}`));
        });
        if(first && autoPick) callback($(`${$.sidebarSelector()} .game-sidebar-buttons-container-button.${id}`));
        return this;
    }

}

class MultiplayerBetsComponent {

    constructor() {
        if($('.sidebarMultiplayerBets .os-content').length === 0)
            $('.sidebarMultiplayerBets').overlayScrollbars({
                scrollbars: {
                    autoHide: 'leave'
                }
            });
    }

    clear() {
        $('.sidebarMultiplayerBets .os-content').html('');
    }

    add(user, game) {
        $('.sidebarMultiplayerBets .os-content').append(`
            <div class="sidebarMultiplayerBet">
                <div class="user">
                    <a class="disable-pjax" href="/user/${user._id}" target="_blank">${user.name}</a>
                </div>
                <div class="bet">
                    ${game.wager.toFixed(8)} <i class="${window.Laravel.currency[game.currency].icon}" style="color: ${window.Laravel.currency[game.currency].style}"></i>
                </div>
            </div>
        `);
        return this;
    }

}

class GameHistoryComponent {

    constructor(api_id, scrollable) {
        this.api_id = api_id;
        currentGameInstance.history = this;
        if($('.game-history').length === 0) $('.game-content').append(`<div class="game-history"></div>`);

        this.isScrollable = scrollable;
        if(scrollable) $('.game-history').addClass('os-host-flexbox').overlayScrollbars({
            scrollbars: {
                autoHide: 'leave'
            }
        });
    }

    add(callback, type = 'prepend') {
        const e = $(`<div class="history history-${this.api_id}"></div>`), s = `.game-history ${this.isScrollable ? '.os-content' : ''}`;
        type === 'prepend' ? $(s).prepend(e) : $(s).append(e);
        callback(e);
        return this;
    }

}

class SidebarFooterComponent {

    constructor() {
        $('.game-sidebar').append(`<div class="game-sidebar-footer"></div>`);
        if(!$.isGuest()) this.clientSeed();
    }

    button(icon, tooltip, callback) {
        const id = $.randomId();
        $(`.game-sidebar-footer`).append($(`<div class="action ${id}" data-toggle="tooltip" data-placement="top" title="${tooltip}"><i class="${icon}"></i></div>`));
        $(`.game-sidebar-footer .action.${id}`).tooltip();
        $(document).on('click', `.game-sidebar-footer .action.${id}`, callback);
        return this;
    }

    clientSeed() {
        this.button('fal fa-balance-scale-right', $.lang('general.footer.game.client_seed'), function() {
            $.modal('change_client_seed');
        });
    }

    help() {
        this.button('far fa-rectangle-wide', $.lang('general.footer.game.wide'), function() {

  const containerElement = document.getElementById("gamecontainer");
  const newClass = containerElement.className == "container" ? "container-fluid" : "container";
  containerElement.className = newClass;

        });
        return this;
    }

    sound() {
        this.button(`fal fa-volume${$.getCookie('sound') === 'muted' ? '-mute' : ''}`, $.lang('general.footer.game.sound'), function() {
            if($.getCookie('sound') != null) $.eraseCookie('sound');
            else $.setCookie('sound', 'muted');
            $(this).find('i, svg').attr('class', `fal fa-volume${$.getCookie('sound') === 'muted' ? '-mute' : ''}`);
        });
        return this;
    }

    quick(callback = null) {
        this.button(`fa${$.getCookie('quick') === 'quick' ? 's' : 'l'} fa-bolt`, $.lang('general.footer.game.quick'), function() {
            if(playTimeout) {
                $.error($.lang('error.wait_finish'));
                return;
            }

            if($.getCookie('quick') != null) $.eraseCookie('quick');
            else $.setCookie('quick', 'quick');
            $(this).find('i, svg').attr('class', `fa${$.getCookie('quick') === 'quick' ? 's' : 'l'} fa-bolt`);

            if(callback != null) callback();
        });
        return this;
    }

    stats() {
        this.button(`fal fa-chart-area`, $.lang('general.profit_monitoring.title'), function() {
            $('.draggableWindow').toggleClass('active');
        });
        return this;
    }

}

class SidebarComponentValues {

    bet(set = null) {
        if(currentGameInstance.game.customWagerCalculation != null) return currentGameInstance.game.customWagerCalculation();
        if(set != null) $(`${$.sidebarSelector()} .wager-selector input`).val(parseFloat(set).toFixed(8));
        return bitcoin(parseFloat($(`${$.sidebarSelector()} .wager-selector input`).val()), $.unit()).to('btc').value();
    }

    profit(set = null) {
        if(set != null) $(`${$.sidebarSelector()} .profit`).val(parseFloat(set).toFixed(8));
        return bitcoin(parseFloat($(`${$.sidebarSelector()} .profit`).val()), $.unit()).to('btc').value();
    }
	
	currency(set = null) {
        $('.wager-currency').remove();
        if(set != null && set != 0 && isNaN(parseFloat(set)) != true) {
            return $(`<div class="wager-currency"><div class="wager-currency-2"> ${$.getCurrencyLabel()}`+set+`<br /></div></div>`).insertAfter($(".wager-controls"));
        } else {
        return $(`<div class="wager-currency"><div class="wager-currency-1">Min bet: ${$.getMinBet()}<br /></div></div>`).insertAfter($(".wager-controls")); 
        }
    }

    toJSON() {
        return {
            'api_id': currentGameInstance.game.id,
            'bet': this.bet(),
            'demo': $.isDemo(),
            'currency': $.currency(),
            'quick': $.isQuick(),
            'data': currentGameInstance.game.collectData(),
        };
    }

}

let gameInstances  = {};

let currentGameInstance = {
    game: null,
    sidebarRenderer: null,
    sidebarChangeCallback: null,
    history: null,
    bettingType: null,
    autoBetSettings: null
};

/**
 * @param api_id
 * @param render
 * @param dataCollector
 * @param callback
 * @param errorCallback
 */
$.game = function(api_id, render, dataCollector, callback, errorCallback) {
    gameInstances[api_id] = [render, dataCollector, callback, errorCallback];
};

$.render = function(api_id, container = '.game-content', overviewData = null) {
    let renderer = gameInstances[api_id][0];
    if(renderer === undefined) {
        $.error(`Unknown renderer: ${api_id}`);
        return;
    }

    $(container).html('');

    if(!$.isOverview(overviewData)) {
        currentGameInstance.game = {
            id: api_id,
            renderer: renderer,
            collectData: gameInstances[api_id][1],
            callback: gameInstances[api_id][2],
            errorCallback: gameInstances[api_id][3],
            extendedAutoBetHandler: null,
            restore: null,
            customWagerCalculation: null,
            autoBetSettings: {
                state: false,
                games: 0,
                stopOnWin: false,
                currentIteration: 0,
                initialBet: 0,
                timeout: 0,
                win: {
                    action: 'reset',
                    value: 0
                },
                loss: {
                    action: 'reset',
                    value: 0
                }
            },
            bettingType: 'manual'
        };

        $('.game-content').attr('class', `game-content game-content-${api_id}`);
    }

    $.whisper('Multiplier', { api_id: api_id }).then(function(response) {
        currentGameInstance.multipliers = response;
        renderer($(container), overviewData);

        if(!$.isOverview(overviewData)) {
            $('.game-sidebar').html('');
            currentGameInstance.sidebarRenderer(new SidebarComponentBuilder());
            $.triggerSidebarUpdate();

            if(window.restoreGame !== undefined && currentGameInstance.game.restore != null) {
                $.blockWager(true);
                $.blockSidebarButtons(true);

                currentGameInstance.game.extendedId = window.restoreGame.game._id;
                currentGameInstance.game.extendedState = 'in-progress';
                $.blockPlayButton(false);

                $.sidebarData().bet(window.restoreGame.game.wager);
                $('.play-button').html(window.restoreGame.history.length === 0 ? $.lang('general.cancel') : $.lang('general.take', {
                    value: bitcoin(window.restoreGame.game.wager * window.restoreGame.game.multiplier, 'btc').to($.unit()).value().toFixed(8),
                    icon: window.Laravel.currency[$.currency()].icon
                }));
                currentGameInstance.game.restore(window.restoreGame);
            }
        }
    });

    if($.isOverview(overviewData)) $(container).prepend('<div class="overview-ui-block"></div>');
};

$.turn = function(data, callback, finishedCallback = null) {
    $.whisper('Turn', {
        id: $.extendedGameId(),
        data: data
    }).then(function(response) {
        callback(response);

        if(response.type === 'fail') {
            console.error('Failed turn', response);
            return;
        }

        if($.currentBettingType() === 'manual' && response.type === 'continue') $('.play-button').html($.lang('general.take', { value: ($.sidebarData().bet() * response.game.multiplier).toFixed(8), icon: window.Laravel.currency[$.currency()].icon }));
        if(response.type === 'lose' || response.type === 'finish') $.pushStats(response.game);
    }, function(error) {
        switch (error) {
            case 0:
                $.turn(data, callback, finishedCallback);
                break;
            case 1:
                $.error('Invalid game id');
                break;
            case 2:
                if(finishedCallback != null) finishedCallback();
                break;
            case 3:
                $.error('Invalid API operation');
                break;
        }
    });
};

$.restore = function(callback) {
    currentGameInstance.game.restore = callback;
};

$.currentBettingType = function() {
    return currentGameInstance.game.bettingType;
};

$.extendedAutoBetHandler = function(play) {
    currentGameInstance.game.extendedAutoBetHandler = play;
};

$.customWagerIncrease = function(callback) {
    currentGameInstance.game.autoBetSettings.customBetIncrease = callback;
}

$.autoBetSettings = function() {
    return currentGameInstance.game.autoBetSettings;
}

$.autoBetActive = function() {
    return currentGameInstance.game.autoBetSettings.state;
}

$.autoBetStop = function() {
    currentGameInstance.game.autoBetSettings.stop();
};

$.autoBetNext = function() {
    currentGameInstance.game.autoBetSettings.next();
}

$.pushStats = function(gameInstance) {
    $.stats().wager += $.sidebarData().bet();
    if ((gameInstance.win !== undefined && gameInstance.win) || ($.isExtendedGameStarted() && gameInstance.status === 'win')) {
        $.stats().wins += 1;
        $.stats().profit += gameInstance.profit - $.sidebarData().bet();
    } else {
        $.stats().losses += 1;
        $.stats().profit -= $.sidebarData().bet();
    }
    $.stats().pushToSeries();
    $.stats().update();
};

$.resultPopup = function(game) {
    if(game.status !== undefined && game.status === 'cancelled') return;

    const status = game.profit === 0 && game.multiplier === 0 ? 'lose' : (game.status === undefined ? (game.win ? 'win' : 'lose') : (game.status === 'lose' ? 'lose' : 'win'));
    const resultPopup = $(`<div class="resultPopup resultPopup-${status}" ${$.isDemo() ? `style="padding-top: 25px;"` : ''}>
            ${$.isDemo() ? `<div class="demoHeader">${$.lang('general.head.wallet_demo')}</div>` : ''}
            <div class="multiplier">${status === 'lose' && game.multiplier >= 1 ? (0).toFixed(2) : game.multiplier.toFixed(2)}x</div>
            <div class="divider"></div>
            <div class="profit">${game.profit.toFixed(8)} <i class="${window.Laravel.currency[game.currency].icon}" style="color: ${window.Laravel.currency[game.currency].style}"></i></div>
            ${$.isDemo() ? `<a href="javascript:void(0)" onclick="${$.isGuest() ? '$.auth()' : `$.setDemo(false); $('.resultPopup .demoHeader').fadeOut('fast'); $('.resultPopup').css({'padding-top': '10px'})`}; ${$.isGuest() ? '' : '$(this).slideUp(\'fast\');'}">${$.lang('general.demo_popup_link')}</a>` : ''}
        </div>
    `);
    $('.game-content').append(resultPopup);
    resultPopup.hide().fadeIn('fast');

    setTimeout(function() {
        resultPopup.fadeOut('fast', function() {
            $(this).remove();
        });
    }, 3000);
};

$.setWagerSelector = function() {
            $('.wager-classic.wager-selector').replaceWith(`
                <div class="wager-classic wager-selector">
                <input type="text" value="${$.getMinBet()}" placeholder="${$.lang('general.wager')}">
                <div class="wager-input-controls">
                    <div class="control"><i class="fas fa-slash"></i></div>
                    <div class="control"><i class="fas fa-asterisk"></i></div>
                    ${$.isGuest() ? '' : `<div class="control" style="padding-top: 4px;">MAX</div>`}
                </div>
			${$.getMinWagerSelector()}
            </div>
        `);

        $('.wager-selector').keypress(function(event) {
            if ((event.which !== 46 || $(this).val().indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) event.preventDefault();
        });

        $('.wager-selector').on('input', function() {
            $.triggerSidebarUpdate();
        });
        
                $('.wager-controls .control').on('click', function() {
            const input = $(`${$.sidebarSelector()} .wager-selector input`);
            if(input.val().length === 0 || isNaN(input.val()) || parseFloat(input.val()) < 0) input.val('0.00');
            const value = parseFloat(input.val());
            var thisId = $(this).attr("id");
              switch (thisId) {
                case ('01'): input.val((value + 0.1).toFixed(2)); break;
                case ('05'): input.val((value + 0.5).toFixed(2)); break;
                case ('1'): input.val((value + 1.0).toFixed(2)); break;
                case ('2'): input.val((value + 2.0).toFixed(2)); break;
                case ('5'): input.val((value + 5.0).toFixed(2)); break;
                case ('10'): input.val((value + 10.0).toFixed(2)); break;
                case ('055'): input.val((value + 0.005).toFixed(7)); break;
                case ('011'): input.val((value + 0.001).toFixed(7)); break;
                case ('050'): input.val((value + 0.0005).toFixed(7)); break;
                case ('010'): input.val((value + 0.0001).toFixed(7)); break;
            }
            $.triggerSidebarUpdate();
        });
        
        
        $('.wager-selector .wager-input-controls .control:first-child').on('click', function() {
            const input = $(`${$.sidebarSelector()} .wager-selector input`);
            if (input.val().length === 0 || isNaN(input.val()) || parseFloat(input.val()) < 0 || (parseFloat(input.val()) / 2) < $.getMinBet()) {
                input.val($.getMinBet());
                return;
            }

            const value = parseFloat(input.val());
            input.val((value / 2));
            $.triggerSidebarUpdate();
        });

        $('.wager-selector .wager-input-controls .control:last-child').on('click', function() {
            const input = $(`${$.sidebarSelector()} .wager-selector input`);
            if (input.val().length === 0 || isNaN(input.val()) || parseFloat(input.val()) < 0) {
                input.val($.getMinBet());
                return;
            }

            let value = (parseFloat(input.val()) * 2);
            if (value > $.getMaxBet()) {
                value = $.getMaxBet();
            }

            input.val(value);

            $.triggerSidebarUpdate();
        });
        try {
        $.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
        } catch(err) { }
        return this;
};

$.finishExtended = function(sendServerRequest = true, requestCallback = null) {
    const changeState = function(response) {
        $.blockPlayButton(false);
        $.blockWager(false);
        $.blockSidebarButtons(false);

        if(response != null && response.game.status !== 'cancelled') $.pushStats(response.game);
        currentGameInstance.game.extendedState = 'finished';
        currentGameInstance.game.callback(response);
        if($.currentBettingType() === 'manual') $('.play-button').html($.lang('general.play'));
    };

    if(sendServerRequest) {
        $.blockPlayButton(true);
        $.whisper('Finish', { id: $.extendedGameId() }).then(function(response) {
            changeState(response);
            if(requestCallback != null) requestCallback(response);
        }, function(error) {
            if(requestCallback != null) requestCallback({ game: { status: 'lose' } });
        });
    } else changeState(null);
};

$.extendedGameId = function() {
    return currentGameInstance.game.extendedId;
};

$.isExtendedGameStarted = function() {
    return currentGameInstance.game.extendedState === 'in-progress';
};

$.isOverview = function(overviewData) {
    return overviewData != null;
};

$.blockWager = function(state) {
    state ? $('.wager-selector').prepend('<div class="wager-overlay"></div>') : $('.wager-overlay').remove();
};

$.gameData = function() {
  return currentGameInstance.multipliers;
};


$.multipliers = function() {
    return currentGameInstance.multipliers;
};

$.multiplayer = function(callback) {
  currentGameInstance.game.multiplayerCallback = callback;
};
$.getMinWagerSelector = function() {
    return '<div class="wager-controls"><div id="010" class="control pc">+0.0001</div><div id="050" class="control">+0.0005</div><div id="011" class="control">+0.001</div><div id="055" class="control">+0.005</div></div>'; 
};

$.sidebar = function(render, callback = null) {
    currentGameInstance.sidebarRenderer = render;
    currentGameInstance.sidebarChangeCallback = callback;
};

$.sidebarData = function() {
    return new SidebarComponentValues();
};

$.triggerSidebarUpdate = function() {
    if(currentGameInstance.sidebarChangeCallback != null) currentGameInstance.sidebarChangeCallback();
};

$.multiplayerBets = function() {
    if($('.sidebarMultiplayerBets').length === 0) throw new Error('sidebarMultiplayerBets is not initialized');
    return new MultiplayerBetsComponent();
};

$.history = function() {
    if(currentGameInstance.history === undefined || currentGameInstance.history === null)
        throw new Error('History component is not initialized');
    return currentGameInstance.history;
};

$.isQuick = function() {
    return $.getCookie('quick') === 'quick';
};

$.blockPlayButton = function(state = true) {
    playTimeout = state;
};

$.blockSidebarButtons = function(state) {
    state ? $('.game-sidebar-buttons-container').prepend('<div class="block-overlay"></div>') : $('.game-sidebar-buttons-container .block-overlay').remove();
};

$.isMobile = function() {
    return document.body.offsetWidth < 768;
};

$.sidebarSelector = function() {
    //return $.isMobile() ? '.mobile-menu-bet-content' : '.game-container';
    return '.game-container';
};

let timeouts = [];
$.playSound = function(src, timeout = null) {
    if(timeout != null) {
        let cancel = false;
        _.forEach(timeouts, function(t) {
            if(t.src === src && +new Date() < t.time) cancel = true;
        });

        if(cancel) return;

        timeouts.push({
            'src': src,
            'time': +new Date() + timeout
        });
    }

    if($.getCookie('sound') === 'muted') return;
    new Howl({src: [src]}).play();
};

$.chain = function(times, ms, callback) {
    let i = 0;

    const next = function() {
        if (i < times) {
            setTimeout(function() {
                callback(i);
                next();
            }, ms);
            i++;
        }
    };

    next();
};

$.abbreviate = function(value) {
    if (value < 1e3) return value.toFixed(2);
    if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(1) + "K";
    if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(1) + "M";
    if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(1) + "B";
    if (value >= 1e12) return +(value / 1e12).toFixed(1) + "T";
};

$.customWagerCalculation = function(callback) {
    currentGameInstance.game.customWagerCalculation = callback;
};

$(document).on('pjax:start', function() {
    if(currentGameInstance.game != null && $.autoBetActive()) $.autoBetStop();
});

$(document).on('pjax:end', function() {
    $.blockPlayButton(false);
});

$.customHistoryPopover = function(e, _ref2) {
  var clientSeed = _ref2.clientSeed,
      serverSeed = _ref2.serverSeed,
      nonce = _ref2.nonce,
      _ref2$placement = _ref2.placement,
      placement = _ref2$placement === void 0 ? 'right' : _ref2$placement;
  $(e).popover({
    content: "\n            <div class=\"historypopbackground\"><strong>Client seed:</strong> ".concat(clientSeed, "</div>\n            <div><strong>Server seed:</strong> ").concat(serverSeed, "</div>\n            <div><strong>Nonce:</strong> ").concat(nonce, "</div>\n            <div><a class=\"disable-pjax\" target=\"_blank\" href=\"/fairness?verify=").concat(currentGameInstance.game.id, "-").concat(serverSeed, "-").concat(clientSeed, "-").concat(nonce, "\">").concat($.lang('general.verify'), "</a></div>\n        "),
    html: true,
    placement: placement,
    trigger: 'manual'
  }).on('mouseenter', function () {
    var _this = this;

    $(this).popover('show');
    $('.popover').on('mouseleave', function () {
      return $(_this).popover('hide');
    });
  }).on('mouseleave', function () {
    var _this = this;

    setTimeout(function () {
      if (!$('.popover:hover').length) $(_this).popover('hide');
    }, 10);
  });
  return e;
};

var validateMultiplayerAction = function validateMultiplayerAction(game_id, event, data) {
  if (window.location.pathname.includes("/".concat(game_id))) {
    if (currentGameInstance.game === null) {
      setTimeout(function () {
        return validateMultiplayerAction(game_id, event, data);
      }, 100);
    } else if (currentGameInstance.game.multiplayerCallback != null) {
      console.log(event, data);
      currentGameInstance.game.multiplayerCallback(event, data);
    }
  }
};

window.Echo.channel('laravel_database_Everyone').listen('MultiplayerBettingStateChange', function (e) {
  return validateMultiplayerAction(e.game, 'MultiplayerBettingStateChange', e);
}).listen('MultiplayerBetCancellation', function (e) {
  return validateMultiplayerAction(e.game.game, 'MultiplayerBetCancellation', e);
}).listen('MultiplayerGameFinished', function (e) {
  return validateMultiplayerAction(e.game, 'MultiplayerGameFinished', e);
}).listen('MultiplayerTimerStart', function (e) {
  return validateMultiplayerAction(e.game, 'MultiplayerTimerStart', e);
}).listen('MultiplayerGameBet', function (e) {
  return validateMultiplayerAction(e.game.game, 'MultiplayerGameBet', e);
});