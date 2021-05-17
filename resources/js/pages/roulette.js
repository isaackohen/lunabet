$.game('roulette', function(container, overviewData) {
    container.append(`<canvas class="roulette-wheel" width="600" height="600"></canvas>`);

    const canvas = container.find('.roulette-wheel')[0];
    const ctx = canvas.getContext('2d');

    let roulette = new Roulette(canvas, ctx);
    roulette.init();

    if($.isOverview(overviewData)) {
        roulette.putBallAtSlot(overviewData.game.data.slot, 0);
    } else {
        $.customWagerCalculation(function() {
            return parseFloat($('#bet').html());
        });

        $.customWagerIncrease(function(category) {
            if(category === 'initialBet') return bet;
            if($.autoBetSettings()[category].action === 'reset') bet = $.autoBetSettings().initialBet;
            else if($.autoBetSettings()[category].value > 0) {
                _.forEach(bet, function(value, key) {
                    bet[key] = bet[key] + ((( $.autoBetSettings()[category].value / 100) * bet[key]));
                });
            }
            setTimeout(setBet, 5000);
        });

        container.append(`<div class="rouletteCustomHistory"></div>`);
        container.append(`
            <div class="roulette-field">
                <div class="header">
                    ${$.lang('general.wager')}: <span id="bet">0.00000000</span>
                    <div class="right">
                        <button class="btn btn-primary" data-clear>${$.lang('general.clear')}</button>
                        <button class="btn btn-transparent" data-undo>${$.lang('general.undo')}</button>
                    </div>
                </div>
                <div class="content">
                    <div class="side">
                        <div class="chip green" data-chip="0">
                             0
                        </div>
                    </div>
                    <div class="numeric">
                        <div class="r">
                            <div class="chip red" data-chip="3">
                                 3
                            </div>
                            <div class="chip black" data-chip="6">
                                 6
                            </div>
                            <div class="chip red" data-chip="9">
                                 9
                            </div>
                            <div class="chip red" data-chip="12">
                                 12
                            </div>
                            <div class="chip black" data-chip="15">
                                 15
                            </div>
                            <div class="chip red" data-chip="18">
                                 18
                            </div>
                            <div class="chip red" data-chip="21">
                                 21
                            </div>
                            <div class="chip black" data-chip="24">
                                 24
                            </div>
                            <div class="chip red" data-chip="27">
                                 27
                            </div>
                            <div class="chip red" data-chip="30">
                                 30
                            </div>
                            <div class="chip black" data-chip="33">
                                 33
                            </div>
                            <div class="chip red" data-chip="36">
                                 36
                            </div>
                        </div>
                        <div class="r">
                            <div class="chip black" data-chip="2">
                                 2
                            </div>
                            <div class="chip red" data-chip="5">
                                 5
                            </div>
                            <div class="chip black" data-chip="8">
                                 8
                            </div>
                            <div class="chip black" data-chip="11">
                                 11
                            </div>
                            <div class="chip red" data-chip="14">
                                 14
                            </div>
                            <div class="chip black" data-chip="17">
                                 17
                            </div>
                            <div class="chip black" data-chip="20">
                                 20
                            </div>
                            <div class="chip red" data-chip="23">
                                 23
                            </div>
                            <div class="chip black" data-chip="26">
                                 26
                            </div>
                            <div class="chip black" data-chip="29">
                                 29
                            </div>
                            <div class="chip red" data-chip="32">
                                 32
                            </div>
                            <div class="chip black" data-chip="35">
                                 35
                            </div>
                        </div>
                        <div class="r">
                            <div class="chip red" data-chip="1">
                                 1
                            </div>
                            <div class="chip black" data-chip="4">
                                 4
                            </div>
                            <div class="chip red" data-chip="7">
                                 7
                            </div>
                            <div class="chip black" data-chip="10">
                                 10
                            </div>
                            <div class="chip black" data-chip="13">
                                 13
                            </div>
                            <div class="chip red" data-chip="16">
                                 16
                            </div>
                            <div class="chip red" data-chip="19">
                                 19
                            </div>
                            <div class="chip black" data-chip="22">
                                 22
                            </div>
                            <div class="chip red" data-chip="25">
                                 25
                            </div>
                            <div class="chip black" data-chip="28">
                                 28
                            </div>
                            <div class="chip black" data-chip="31">
                                 31
                            </div>
                            <div class="chip red" data-chip="34">
                                 34
                            </div>
                        </div>
                    </div>
                    <div class="side">
                        <div class="chip bordered" data-chip="row1">
                             2:1
                        </div>
                        <div class="chip bordered" data-chip="row2">
                             2:1
                        </div>
                        <div class="chip bordered" data-chip="row3">
                             2:1
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="side"></div>
                    <div class="numeric">
                        <div class="r">
                            <div class="chip bordered" data-chip="1-12">
                                 ${$.lang('general.to', { 1: 1, 2: 12 })}
                            </div>
                            <div class="chip bordered" data-chip="13-24">
                                 ${$.lang('general.to', { 1: 13, 2: 24 })}
                            </div>
                            <div class="chip bordered" data-chip="25-36">
                                 ${$.lang('general.to', { 1: 25, 2: 36 })}
                            </div>
                        </div>
                        <div class="r">
                            <div class="chip bordered" data-chip="1-18">
                                 ${$.lang('general.to', { 1: 1, 2: 18 })}
                            </div>
                            <div class="chip bordered" data-chip="even">
                                 ${$.lang('general.even')}
                            </div>
                            <div class="chip red" data-chip="red"></div>
                            <div class="chip black" data-chip="black"></div>
                            <div class="chip bordered" data-chip="odd">
                                 ${$.lang('general.odd')}
                            </div>
                            <div class="chip bordered" data-chip="19-36">
                                 ${$.lang('general.to', { 1: 19, 2: 36 })}
                            </div>
                        </div>
                    </div>
                    <div class="side"></div>
                </div>
            </div>
        `);

        $('[data-clear]').on('click', function() {
            roulette_history = [];
            bet = {};
            $('.bet-stack').fadeOut('fast', function () {
                $(this).remove();
            });
            $('#bet').html('0.00');
        });

        $('[data-undo]').on('click', function() {
            if (roulette_history.length === 0) return;
            let latest = roulette_history[roulette_history.length - 1];

            setBet(latest.parent().parent().attr('data-chip'), getBet(latest.parent().parent().attr('data-chip')) - parseFloat(latest.attr('data-token-value')));

            if (latest.parent().children().length === 1) latest.parent().fadeOut('fast', function () {
                $(this).remove()
            });
            else latest.remove();
            roulette_history.splice(roulette_history.length - 1, 1);
        });

        $('[data-chip]').on('click', function() {
            if(chip == null) return;

            let stack = $(this).find('.bet-stack');
            if(stack.length === 0) {
                stack = $('<div class="bet-stack"></div>');
                stack.hide().fadeIn('fast');
                $(this).append(stack);
            }

            const e = $(`<div class="user-chip" data-display-value="${chipDisplay}" data-token-value="${chip}" style="margin-top: -${stack.children().length * 2}px">${$.abbreviate(chipDisplay)}</div>`);
            stack.append(e);
            roulette_history.push(e);

            let b = $(this).attr('data-chip');
            setBet(b, getBet(b) + chip);
            $.playSound('/sounds/click.mp3');
        });

        let rows = {
            first: ['3', '6', '9', '12', '15', '18', '21', '24', '27', '30', '33', '36'],
            second: ['2', '5', '8', '11', '14', '17', '20', '23', '26', '29', '32', '35'],
            third: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28', '31', '34'],
            red: ['3', '9', '12', '18', '21', '27', '30', '36', '5', '14', '23', '32', '1', '7', '16', '19', '25', '34'],
            black: ['6', '15', '24', '33', '2', '8', '11', '17', '20', '26', '29', '35', '4', '10', '13', '22', '28', '31'],
            numeric: {
                first: ['3', '6', '9', '12', '2', '5', '8', '11', '1', '4', '7', '10'],
                second: ['15', '18', '21', '24', '14', '17', '20', '23', '13', '16', '19', '22'],
                third: ['27', '30', '33', '36', '26', '29', '32', '35', '25', '28', '31', '34']
            },
            half: {
                first: ['3', '6', '9', '12', '15', '18', '2', '5', '8', '11', '14', '17', '1', '4', '7', '10', '13', '16'],
                second: ['21', '24', '27', '30', '33', '36', '20', '23', '26', '29', '32', '35', '19', '22', '25', '28', '31', '34']
            },
            e: {
                even: ['6', '12', '18', '24', '30', '36', '2', '8', '14', '20', '26', '32', '4', '10', '16', '22', '28', '34'],
                opposite: ['3', '9', '15', '21', '27', '33', '5', '11', '17', '23', '29', '35', '1', '7', '13', '19', '25', '31']
            }
        };

        const disableChipsFor = function (elementId, chips) {
            elementId = `[data-chip="${elementId}"]`;
            $(elementId).on('mouseover', function () {
                $.each($('.chip'), function (i, e) {
                    if (chips.includes($(this).attr('data-chip'))) $(this).addClass('chip-disabled');
                });
            });
            $(elementId).on('mouseleave', function () {
                $('.chip').removeClass('chip-disabled');
            });
        };

        disableChipsFor('row1', rows.second.concat(rows.third));
        disableChipsFor('row2', rows.first.concat(rows.third));
        disableChipsFor('row3', rows.first.concat(rows.second));
        disableChipsFor('red', rows.black);
        disableChipsFor('black', rows.red);
        disableChipsFor('1-12', rows.numeric.second.concat(rows.numeric.third));
        disableChipsFor('13-24', rows.numeric.first.concat(rows.numeric.third));
        disableChipsFor('25-36', rows.numeric.first.concat(rows.numeric.second));
        disableChipsFor('1-18', rows.half.second);
        disableChipsFor('19-36', rows.half.first);
        disableChipsFor('odd', rows.e.opposite);
        disableChipsFor('even', rows.e.even);

        gameRouletteInstance = roulette;
    }
}, function() {
    return {
        'bet': bet
    };
}, function(response) {
    $.blockPlayButton(true);
    gameRouletteInstance.putBallAtSlot(response.server_seed.result[0], $.isQuick() ? 1500 : 5000);

    const GREEN      = '#7FBD35';
    const DARK_GREEN = '#71A82F';

    const RED      = '#E7586A';
    const DARK_RED = '#CC4F5E';

    const BLACK      = '#272933';
    const DARK_BLACK = '#24252E';

    let color = $(`[data-chip="${response.game.data.slot}"]`);
    color = color.hasClass('green') ? [GREEN, DARK_GREEN] : (color.hasClass('red') ? [RED, DARK_RED] : [BLACK, DARK_BLACK]);

    $.playSound('/sounds/spin.mp3');
    setTimeout(function() {
        $.playSound('/sounds/drop.mp3');
    }, 300);

    setTimeout(function() {
        const e = $(`<div class="rouletteCustomHistoryElement" style="background: ${color[0]}; border-bottom: 1px solid ${color[1]}">${response.game.data.slot}</div>`);
        $('.rouletteCustomHistory').prepend(e);
        e.hide().slideDown('fast');
        $('.rouletteCustomHistoryElement:nth-child(6)').remove();

        if(response.game.win) $.playSound('/sounds/win.mp3');
        else $.playSound('/sounds/lose.mp3');
    }, response.game.delay);
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}))
});

$.on('/game/roulette', function() {
    $.render('roulette');

    $.sidebar(function(component) {
        component.chips(function(value, display) {
            chip = value;
            chipDisplay = display;
        });

        component.buttons(null, 'mt-2')
            .add($.lang('general.double'), function() {
                $('.double').addClass('active');
                $('.split').removeClass('active');

                _.forEach(bet, function(value, key) {
                    bet[key] = bet[key] * 2;

                    const stack = $(`[data-chip="${key}"] .bet-stack`);
                    let html = stack.html();

                    if(stack.children().length < 50) {
                        for (let i = 0; i < stack.children().length; i++) {
                            const child = $(stack.children()[i]);
                            html += `<div class="user-chip" data-display-value="${child.data('display-value')}" data-token-value="${child.data('token-value')}" style="margin-top: -${(stack.children().length + i + 1) * 2}px">${$.abbreviate(parseFloat(child.data('display-value')))}</div>`;
                        }

                        stack.html(html);
                    }

                    setBet(key, bet[key]);
                });
            }, 'double', '', false)
            .add($.lang('general.divide'), function() {
                $('.double').addClass('active');
                $('.split').removeClass('active');

                _.forEach(bet, function(value, key) {
                    bet[key] = bet[key] / 2;

                    const stack = $(`[data-chip="${key}"] .bet-stack`);
                    let html = '';

                    for (let i = 0; i < stack.children().length / 2; i++)
                        html += stack.children()[i].outerHTML;

                    stack.html(html);

                    setBet(key, bet[key]);
                });
            }, 'split');

        component.autoBets();
        component.play();
        component.footer().help().quick().sound().stats();
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/roulette.css']);

let chip = null, chipDisplay = null, bet = {}, roulette_history = [], gameRouletteInstance = null;

function setBet(chip = null, value = null) {
    if(chip !== null && value !== null) bet[chip] = value;
    let total = 0;
    for(let i = 0; i < Object.keys(bet).length; i++) total += bet[Object.keys(bet)[i]];
    $('#bet').html(total.toFixed(8))
}

function getBet(chip) {
    if(bet[chip] == null) return 0;
    return bet[chip];
}

function Roulette(_canvas, _context) {

    const GREEN      = '#7FBD35';
    const DARK_GREEN = '#71A82F';

    const RED      = '#E7586A';
    const DARK_RED = '#CC4F5E';

    const BLACK      = '#272933';
    const DARK_BLACK = '#24252E';

    const CENTER_ORNAMENT = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjcycHgiIGhlaWdodD0iNzJweCIgdmlld0JveD0iMCAwIDcyIDcyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0MiAoMzY3ODEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPldoZWVsIGhhbmRsZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxwYXRoIGQ9Ik0zOC4xMzgxMjA1LDcuMzgxMjA1MzkgTDM5Ljg1NjQxMzgsMjQuNTY0MTM4MiBDNDMuMjUyMjg3OSwyNS43MDMwNjM2IDQ2LjA0NzM1NTcsMjguNDgyNDUxOCA0Ny4yOTYzMDMzLDMyLjEyOTYyOTYgTDY0LjYxODc5NDYsMzMuODYxODc5NSBDNjUuMzI3ODk2MiwzMi43NDI4NTggNjYuNTc3MTk2MiwzMiA2OCwzMiBDNzAuMjA5MTM5LDMyIDcyLDMzLjc5MDg2MSA3MiwzNiBDNzIsMzguMjA5MTM5IDcwLjIwOTEzOSw0MCA2OCw0MCBDNjYuNTc3MTk2Miw0MCA2NS4zMjc4OTYyLDM5LjI1NzE0MiA2NC42MTg3OTQ2LDM4LjEzODEyMDUgTDQ3LjQ0MTg1NywzOS44NTU4MTQzIEM0Ni4yNzUxMzgyLDQzLjM5MDk4NjEgNDMuMzkwOTg2MSw0Ni4yNzUxMzgyIDM5Ljg1NTgxNDMsNDcuNDQxODU3IEwzOC4xMzgxMjA1LDY0LjYxODc5NDYgQzM5LjI1NzE0Miw2NS4zMjc4OTYyIDQwLDY2LjU3NzE5NjIgNDAsNjggQzQwLDcwLjIwOTEzOSAzOC4yMDkxMzksNzIgMzYsNzIgQzMzLjc5MDg2MSw3MiAzMiw3MC4yMDkxMzkgMzIsNjggQzMyLDY2LjU3NzE5NjIgMzIuNzQyODU4LDY1LjMyNzg5NjIgMzMuODYxODc5NSw2NC42MTg3OTQ2IEwzMi4xMjk2MzA3LDQ3LjI5NjMwNzEgQzI4LjQ4MjQ1MTgsNDYuMDQ3MzU1NyAyNS43MDMwNjM2LDQzLjI1MjI4NzkgMjQuNTY0MTM4MiwzOS44NTY0MTM4IEw3LjM4MTIwNTM5LDM4LjEzODEyMDUgQzYuNjcyMTAzNzksMzkuMjU3MTQyIDUuNDIyODAzNzksNDAgNCw0MCBDMS43OTA4NjEsNDAgOS40MzU1MzIwMmUtMTUsMzguMjA5MTM5IDkuNTcwODAyNzdlLTE1LDM2IEM5LjcwNjA3MzUyZS0xNSwzMy43OTA4NjEgMS43OTA4NjEsMzIgNCwzMiBDNS40MjI4MDM3OSwzMiA2LjY3MjEwMzc5LDMyLjc0Mjg1OCA3LjM4MTIwNTM5LDMzLjg2MTg3OTUgTDI0LjcxMjI4ODMsMzIuMTI4NzcxMiBDMjUuOTMyMTAwMiwyOC42MzEzOTQgMjguNjMxMzk0LDI1LjkzMjEwMDIgMzIuMTI4NzcxMiwyNC43MTIyODgzIEwzMy44NjE4Nzk1LDcuMzgxMjA1MzkgQzMyLjc0Mjg1OCw2LjY3MjEwMzc5IDMyLDUuNDIyODAzNzkgMzIsNCBDMzIsMS43OTA4NjEgMzMuNzkwODYxLC00LjI2MzI1NjQxZS0xNCAzNiwtNC4yNjMyNTY0MWUtMTQgQzM4LjIwOTEzOSwtNC4yNjMyNTY0MWUtMTQgNDAsMS43OTA4NjEgNDAsNCBDNDAsNS40MjI4MDM3OSAzOS4yNTcxNDIsNi42NzIxMDM3OSAzOC4xMzgxMjA1LDcuMzgxMjA1MzkgWiIgaWQ9InBhdGgtMSI+PC9wYXRoPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IlJvdWxldHRlIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR2FtZS0tLVJvdWxldHRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzQyLjAwMDAwMCwgLTIxMC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IlJvdWxldHRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAuMDAwMDAwLCA5Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJXaGVlbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTIyLjAwMDAwMCwgMTQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IlRvcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMDAwMDAwLCA1Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IldoZWVsLWhhbmRsZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDQuMDAwMDAwLCA0NC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iI0ZGRDEwMCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iI0Q2QTk0OSIgY3g9IjM2IiBjeT0iMzYiIHI9IjciPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iI0ZCRDYzRSIgY3g9IjM2IiBjeT0iMzYiIHI9IjIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';

    const FULL_CIRCLE = 2 * Math.PI;

    const _numbers = [
        '0', '32', '15', '19',
        '4', '21', '2', '25',
        '17', '34', '6', '27',
        '13', '36', '11', '30',
        '8', '23', '10', '5',
        '24', '16', '33', '1',
        '20', '14', '31', '9',
        '22', '18', '29', '7',
        '28', '12', '35', '3', '26',
    ];

    const _outerColors = [
        GREEN,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
        RED, BLACK, RED, BLACK,
    ];

    const _innerColors = [
        DARK_GREEN,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
        DARK_RED, DARK_BLACK, DARK_RED, DARK_BLACK,
    ];

    const canvas = _canvas;
    const ctx    = _context;

    const _slotTotal = 37;
    const _arcAngle  = FULL_CIRCLE / _slotTotal;

    let _outerEdge = {
            radius: 0,
        },
        _outerRing = {
            outerRadius: 0,
            innerRadius: 0,
        },
        _innerRing = {
            outerRadius: 0,
            innerRadius: 0,
        },
        _ornament  = {
            x     : 0,
            y     : 0,
            width : 0,
            height: 0,
            img   : null,
        },
        _slotText  = {
            size  : 0,
            radius: 0,
            font  : 'normal 12px sans-serif',
        };

    let _centerX,
        _centerY,
        _startOfTime = 0,
        _worldAngle  = 0;

    let _ball = {
        x         : 0,
        y         : 0,
        radius    : 0,
        vertOffset: 0,
        vertRange : 0,
    };

    let _ballSettings = {
        showBall       : false,
        spinStartTime  : 0,
        spinFinalTime  : 0,
        spinTotalTime  : 0,
        spinElapsedTime: 0,
        startPosition  : 0,
        finalPosition  : 0,
        arcIncrement   : 0,
    };

    function drawFrame() {
        if (_ballSettings.showBall) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            redrawBackground(ctx);

            ctx.translate(_centerX, _centerY);

            _ballSettings.spinTimeElapsed = Date.now() - _ballSettings.spinStartTime;

            let f = _ballSettings.spinTimeElapsed /
                _ballSettings.spinTotalTime;

            f = f > 1 ? 1 : f;

            ctx.rotate((_worldAngle + _ballSettings.finalPosition) * f);

            ctx.beginPath();
            ctx.fillStyle = '#ffffff';

            let vertDeceleration, g = _ballSettings.spinTimeElapsed / (_ballSettings.spinTotalTime);

            g = g > 1 ? 1 : g;
            if (g < 0.1) vertDeceleration = 1;
            else vertDeceleration = (1 - g) * Math.abs(Math.sin(5 * g * g * _worldAngle));

            let x = _ball.vertOffset + _ball.vertRange * vertDeceleration;

            ctx.arc(x, 0, _ball.radius, 0, FULL_CIRCLE);
            ctx.fill();

            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        requestAnimationFrame(drawFrame);
    }

    function findIndexOfSlot(num) {
        let slotNum = _numbers.indexOf(`${num}`);

        if (slotNum < 0) return false;

        return {
            index   : slotNum,
            position: _arcAngle * (slotNum + 0.5),
        };
    }

    function initBallSpin(num, time = 5000) {
        _ballSettings.spinTotalTime = time;
        _ballSettings.spinStartTime = Date.now();
        _ballSettings.spinFinalTime = _ballSettings.spinStartTime + _ballSettings.spinTotalTime;

        setTimeout(function() {
            $.blockPlayButton(false);
            _ballSettings.showBall = false;
        }, time);
    }

    this.putBallAtSlot = function(num, time) {
        let slot = findIndexOfSlot(num);

        if (slot === false) {
            _ballSettings.showBall = false;
            return;
        }

        initBallSpin(num, time);

        _ballSettings.finalPosition = 5 * 2 * Math.PI + slot.position;

        _ballSettings.startPosition = _worldAngle;
        _ballSettings.arcIncrement  = (_ballSettings.finalPosition -
            _ballSettings.startPosition) /
            _ballSettings.spinTotalTime;

        _ballSettings.showBall = true;
    };

    this.init = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        _worldAngle = 0;

        _centerX = canvas.width / 2;
        _centerY = canvas.height / 2;

        _outerEdge.radius = canvas.width / 2;

        _outerRing.outerRadius = canvas.width * 0.9 / 2;
        _outerRing.innerRadius = canvas.width * 0.75 / 2;

        _innerRing.outerRadius = _outerRing.innerRadius;
        _innerRing.innerRadius = _innerRing.outerRadius * 0.8;

        _slotText.radius = _outerRing.innerRadius + (_outerRing.outerRadius - _outerRing.innerRadius) * 0.35;
        _slotText.size   = (_outerRing.outerRadius - _outerRing.innerRadius) * 0.5;

        _slotText.font = `normal ${_slotText.size}px sans-serif`;

        _ornament.img     = new Image();
        _ornament.img.src = CENTER_ORNAMENT;

        _ornament.x     = _ornament.y = -_innerRing.innerRadius / 2;
        _ornament.width = _ornament.height = _innerRing.innerRadius;

        _ball.radius     = ((canvas.width / 2 - _outerRing.outerRadius) / 2) * 0.9;
        _ball.vertOffset = _innerRing.innerRadius + _ball.radius;
        _ball.vertRange  = (_outerRing.outerRadius - _innerRing.innerRadius);

        _startOfTime = Date.now();

        redrawBackground(ctx);
        requestAnimationFrame(drawFrame);
    };

    function redrawBackground(ctx) {
        for (let i = 0; i < _slotTotal; i++) {
            let angle = i * _arcAngle, _endAngle = angle + _arcAngle;

            ctx.fillStyle = DARK_BLACK;
            ctx.beginPath();
            ctx.arc(_centerX, _centerY, _outerEdge.radius, 0, FULL_CIRCLE, true);
            ctx.arc(_centerX, _centerY, _outerRing.outerRadius, 0, FULL_CIRCLE, false);
            ctx.fill();

            ctx.fillStyle = _outerColors[i];
            ctx.beginPath();
            ctx.arc(_centerX, _centerY, _outerRing.outerRadius, angle, _endAngle, false);
            ctx.arc(_centerX, _centerY, _outerRing.innerRadius, _endAngle, angle, true);
            ctx.fill();

            ctx.fillStyle = _innerColors[i];
            ctx.beginPath();
            ctx.arc(_centerX, _centerY, _innerRing.outerRadius, angle, _endAngle, false);
            ctx.arc(_centerX, _centerY, _innerRing.innerRadius, _endAngle, angle, true);
            ctx.fill();

            ctx.fillStyle = DARK_BLACK;
            ctx.beginPath();
            ctx.arc(_centerX, _centerY, _innerRing.innerRadius, 0, FULL_CIRCLE, true);
            ctx.arc(_centerX, _centerY, 0, 0, FULL_CIRCLE, false);
            ctx.fill();

            ctx.save();
            ctx.font      = _slotText.font;
            ctx.lineWidth = 2;
            ctx.fillStyle = '#ffffff';
            ctx.translate(
                _centerX + Math.cos(angle + _arcAngle / 2) * _slotText.radius,
                _centerY + Math.sin(angle + _arcAngle / 2) * _slotText.radius,
            );

            ctx.rotate(angle + _arcAngle / 2 + Math.PI / 2);

            ctx.fillText(_numbers[i], -ctx.measureText(_numbers[i]).width / 2, 0);
            ctx.restore();
        }

        const f = function() {
            ctx.translate(_centerX, _centerY)
            ctx.drawImage(_ornament.img, _ornament.x, _ornament.y, _ornament.width, _ornament.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        };

        if(_ballSettings.showBall) f();
        else setTimeout(f, 100);

        ctx.save();
    }

}
