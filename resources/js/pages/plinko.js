$.game('plinko', function(container, overviewData) {
    const plinko = new Plinko(container);
    plinko.setDifficulty('low');
    plinko.setPins(8);

    if($.isOverview(overviewData)) {
        plinko.setPins(overviewData.game.data.pins);
        plinko.setDifficulty(overviewData.game.data.difficulty);
        plinko.reset();
        plinko.overview = true;
        plinko.drop(overviewData.game.data.bucket);
    } else {
        currentPlinkoInstance = plinko;
        plinko.reset();
        container.append(`<div class="plinkoCustomHistory"></div>`);
    }
}, function() {
    return {
        'difficulty': currentPlinkoInstance.difficulty,
        'pins': currentPlinkoInstance.pins
    };
}, function(response) {
    $.blockPlayButton(false);
    currentPlinkoInstance.drop(response.game.data.bucket);

    setTimeout(function() {
        const e = $(`<div class="plinkoCustomHistoryElement" style="background: ${colors[currentPlinkoInstance.pins][response.game.data.bucket][0]}; border-bottom: 1px solid ${colors[currentPlinkoInstance.pins][response.game.data.bucket][1]}">${response.game.multiplier}x</div>`);
        $('.plinkoCustomHistory').prepend(e);
        e.hide().slideDown('fast');
        $('.plinkoCustomHistoryElement:nth-child(6)').remove();
    }, response.game.data.delay);

    if($.currentBettingType() === 'auto') {
        $.blockPlayButton();
        setTimeout(function() {
            $.blockPlayButton(false);
        }, 250);
    }
}, function(error) {
    $.error($.lang('general.error.unknown_error', {'code': error}));
});

$.on('/game/plinko', function() {
    $.render('plinko');

    $.sidebar(function(component) {
        component.bet();

        component.buttons($.lang('general.difficulty.title'))
            .add($.lang('general.difficulty.low'), function() {
                if(currentPlinkoInstance != null) {
                    currentPlinkoInstance.setDifficulty('low');
                    currentPlinkoInstance.reset();
                }
            })
            .add($.lang('general.difficulty.medium'), function() {
                if(currentPlinkoInstance != null) {
                    currentPlinkoInstance.setDifficulty('medium');
                    currentPlinkoInstance.reset();
                }
            })
            .add($.lang('general.difficulty.high'), function() {
                if(currentPlinkoInstance != null) {
                    currentPlinkoInstance.setDifficulty('high');
                    currentPlinkoInstance.reset();
                }
            });

        const pinsComponent = component.buttons($.lang('general.pins'));
        for(let i = 8; i <= 16; i++) pinsComponent.add(i, function() {
            if(currentPlinkoInstance != null) {
                currentPlinkoInstance.setPins(i);
                currentPlinkoInstance.reset();
            }
        });

        component.autoBets();
        component.play();

        component.footer().help().sound().stats();
        }, function() {
			$.sidebarData().currency(($.sidebarData().bet() * $.getPriceCurrency()).toFixed(4));
    });
}, ['/css/pages/plinko.css']);

let currentPlinkoInstance;

class Plinko {

    constructor(container) {
        $(container).html(`<div class="plinkoContainer"><div class="plinko"></div></div>`);
        this.container = container.find('.plinko');

        this.speed = 300;
    }

    setPins(pins) {
        this.pins = pins;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    reset() {
        this.container.empty();
        for (let i = 0; i <= this.pins; i++) {
            for (let j = 0; j <= i; j++) {
                let x = 0.5 + (j - (i / 2)) / (this.pins + 2);
                let y = (i + 1) / (this.pins + 2);
                let s = 1 / (i === this.pins ? 3 : 5) / (this.pins + 2);
                let isBucket = i === this.pins;
                let width = (isBucket ? (100 * s) * 2.2 : 100 * s);
                let css = {
                    position: 'absolute',
                    top: (100 * y) + '%',
                    left: (100 * x) + '%',
                    width: width + '%',
                    height: (isBucket ? (100 * s) * 1.4 : (100 * s)) + '%',
                    background: (isBucket ? colors[this.pins][j][0] : '#66abf5'),
                    'border-bottom': (isBucket ? `${width / 2}px solid ${colors[this.pins][j][1]}` : 'none'),
                    borderRadius: (isBucket ? '3px' : '50%'),
                    transform: 'translate(-50%, -50%)'
                };
                let attr = {
                    row: i,
                    pos: j
                };

                let e = $('<div>').css(css).attr(attr).addClass(isBucket ? 'bucket' : 'pin');
                if(isBucket) e.html(`x${$.multipliers()[this.difficulty][this.pins][j]}`).tooltip({
                    placement: 'bottom',
                    title: `x${$.multipliers()[this.difficulty][this.pins][j]}`
                });

                this.container.append(e);
            }
        }
    }

    getDataFromObj(obj) {
        let step = parseInt(obj.attr('step'));
        let delta = parseInt(obj.attr('delta'));
        let target = this.container.find('[row=' + step + '][pos=' + delta + ']');
        return {
            top: target.css('top'),
            left: target.css('left')
        }
    }

    drop(bucket) {
        let s = 1 / 3 / (this.pins + 2);
        let css = {
            position: 'absolute',
            top: (-100 * s) + '%',
            left: '50%',
            width: (100 * s) + '%',
            height: (100 * s) + '%',
            background: `hsl(${$.random(0, 360)}, 90%, 60%)`,
            borderRadius: '50%',
            animationDuration: (this.speed / 1000) + 's',
            transform: 'translate(-50%, -125%)'
        };
        let attr = {
            step: 0,
            delta: 0,
            target: bucket
        };
        let ball = $('<div>').css(css).attr(attr);
        this.container.append(ball);

        const instance = this;

        const animationCallback = function() {
            instance.animationCallback($(this), instance);
        };
        ball.animate(this.getDataFromObj(ball), this.speed, animationCallback);
    }

    animationCallback(obj, plinkoInstance) {
        obj.attr('step', parseInt(obj.attr('step')) + 1);
        let step = parseInt(obj.attr('step'));

        if (step !== plinkoInstance.pins + 1) {
            let heading = (Math.random() < 0.5 ? 0 : 1);
            let target = parseInt(obj.attr('target'));
            let delta = parseInt(obj.attr('delta'));
            if (delta === target) {
                heading = 0;
            } else if (plinkoInstance.pins - step + 1 === target - delta) {
                heading = 1;
            }

            let pin = plinkoInstance.container.find(`[row=${step - 1}][pos=${(parseInt(obj.attr('delta')))}]`);
            pin.addClass('pulsate');
            if(!plinkoInstance.overview) setTimeout(function() {
                pin.removeClass('pulsate');
            }, 700);

            obj.attr('delta', parseInt(obj.attr('delta')) + heading);
            obj.removeAttr('heading').delay(plinkoInstance.speed / 10).queue(function() {
                $(this).attr('heading', heading).dequeue();
            });

            const animationCallback = function() {
                plinkoInstance.animationCallback($(this), plinkoInstance);
            };
            obj.animate(plinkoInstance.getDataFromObj(obj), plinkoInstance.speed, animationCallback);
        } else {
            obj.removeAttr('heading').delay(plinkoInstance.speed / 10).queue(function() {
                $(this).attr('heading', 2).dequeue();
                $.playSound(`/sounds/plinko1.mp3`, 100);
            }).delay(plinkoInstance.speed).queue(function() {
                $(this).remove().dequeue();
            });
        }
    }

}

const hex = {
    0: ['#ffc000', '#997300'],
    1: ['#ffa808', '#a16800'],
    2: ['#ffa808', '#a95b00'],
    3: ['#ff9010', '#a95b00'],
    4: ['#ff7818', '#914209'],
    5: ['#ff6020', '#b93500'],
    6: ['#ff4827', '#c01d00'],
    7: ['#ff302f', '#c80100'],
    8: ['#ff1837', '#91071c'],
    9: ['#ff003f', '#990026']
};

const colors = {
    8: [
        hex[9], hex[7], hex[4], hex[2], hex[0], hex[2], hex[4], hex[7], hex[9]
    ],
    9: [
        hex[9], hex[7], hex[6], hex[5], hex[2], hex[2], hex[5], hex[6], hex[7], hex[9]
    ],
    10: [
        hex[9], hex[8], hex[7], hex[5], hex[4], hex[1], hex[4], hex[5], hex[7], hex[8], hex[9]
    ],
    11: [
        hex[9], hex[8], hex[7], hex[5], hex[4], hex[2], hex[2], hex[4], hex[5], hex[7], hex[8], hex[9]
    ],
    12: [
        hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[1], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]
    ],
    13: [
        hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[2], hex[2], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]
    ],
    14: [
        hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[3], hex[2], hex[3], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]
    ],
    15: [
        hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[3], hex[2], hex[2], hex[3], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]
    ],
    16: [
        hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[3], hex[2], hex[1], hex[2], hex[3], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]
    ]
};
