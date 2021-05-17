import bitcoin from 'bitcoin-units';

$.on('/bonus', function() {
    $('.bonus-overlay').on('click', function() {
        $('.bonus-side-menu').removeClass('active');
        $('.bonus-overlay').toggle();
        $('.wheel-column').css({'z-index': 1});
        $('.wheel-popup').hide();
    });

    $('.agm1').on('click', function() {
            $.request('agm/offer1').then(function() {
                $.success($.lang('bonus.agm.success'));
            }, function(error) {
                if(error === 1) $.error($.lang('bonus.agm.invalid'));
            });
        });
    
    $('.bo1').on('click', function() {
            $.request('agm/bo1').then(function() {
                $.success($.lang('bonus.agm.normaloffer1success'));
            }, function(error) {
                if(error === 1) $.error($.lang('bonus.agm.invalid'));
            });
        });


    $('.banner-wheel').on('click', function() {
        if($('.bonus-overlay').is(':visible')) {
            $('.wheel-column').css({'z-index': 1});
            $('.bonus-overlay, .wheel-popup').hide();
        }
    });

    $('[data-toggle-bonus-sidebar]').on('click', function() {
        if($.isGuest()) {
            $.auth();
            return;
        }

        $('.bonus-side-menu').html(`<div class="loader"><div></div></div>`);

        $('.bonus-side-menu').toggleClass('active');
        $('.bonus-overlay').toggle();

        if($(this).attr('data-toggle-bonus-sidebar') !== undefined) {
            const type = $(this).attr('data-toggle-bonus-sidebar');
            $.get(`/modals.bonus.${type}`, function (response) {
                $('.bonus-side-menu .loader').fadeOut('fast', function () {
                    $('.bonus-side-menu').html(response);

                    $('.bonus-side-menu .bonus-scrollable').overlayScrollbars({
                        scrollbars: {
                            autoHide: 'leave'
                        }
                    });

                    const modal = new Modal();
                    switch (type) {
                        case 'discord': modal.discord(); break;
                        case 'promo': modal.promocode(); break;
                        case 'wheel': modal.wheel(); break;
                        case 'partner': modal.partner(); break;
                    }
                });
            });
        }
    });

    if('serviceWorker' in navigator) {
        const urlBase64ToUint8Array = function(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
            return outputArray
        };

        const subscribe = function() {
            navigator.serviceWorker.ready.then(registration => {
                const options = { userVisibleOnly: true };
                const vapidPublicKey = window.Laravel.vapidPublicKey;

                if(vapidPublicKey) options.applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

                $('.bonus-overlay').fadeIn('fast');
                registration.pushManager.subscribe(options).then(subscription => {
                    updateSubscription(subscription);
                    $('.bonus-overlay').fadeOut('fast');
                }).catch(e => {
                    $('.bonus-overlay').fadeOut('fast');
                    if(Notification.permission === 'denied') {
                        console.log('Permission for Notifications was denied');
                        $.error($.lang('general.error.disabled_notifications'));
                    } else {
                        console.error('Unable to subscribe to push', e);
                    }
                });
            });
        };

        const updateSubscription = function(subscription) {
            const key = subscription.getKey('p256dh');
            const token = subscription.getKey('auth');
            const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];
            const data = {
                endpoint: subscription.endpoint,
                publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
                authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
                contentEncoding
            };

            $.request('subscription/update', data).then(() => {
                $('.banner-notifications .unavailable').fadeIn('fast').find('.slanting .content').html($.lang('general.obtained'));
            });
        };

        navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(() => {
            if(!('showNotification' in ServiceWorkerRegistration.prototype)) {
                console.error('Notifications aren\'t supported');
                return;
            }

            if(!('PushManager' in window)) {
                console.error('Push messaging isn\'t supported');
                return;
            }

            navigator.serviceWorker.ready.then(registration => {
                registration.pushManager.getSubscription().then(subscription => {
                    if(!subscription) return;

                    updateSubscription(subscription);
                }).catch(e => {
                    console.error('Error during getSubscription()', e);
                });
            });
        });

        $('.banner-notifications .unavailable').fadeOut('fast');
        $('.banner-notifications').on('click', function() {
            if($.isGuest()) {
                $.auth();
                return;
            }

            subscribe();
        });
    } else console.error('ServiceWorker isn\'t supported');


}, ['/css/pages/bonus.css']);

class Modal {

    wheel() {
        const v = window.Laravel.currency['eth'].bonusWheel, rewards = [
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#f46e42'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#508bf0'
            },
            {
                value: bitcoin(v * 1.3, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#df1347'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#d1d652'
            },
            {
                value: bitcoin(v * 1.5, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#ffc645'
            },
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#f46e42'
            },
            {
                value: bitcoin(v * 2, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#508bf0'
            },
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#df1347'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#d1d652'
            },
            {
                value: bitcoin(v * 1.3, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#ffc645'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#f46e42'
            },
            {
                value: bitcoin(v * 1.5, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#508bf0'
            },
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#df1347'
            },
            {
                value: bitcoin(v * 2, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#d1d652'
            }
        ];
        let slides = [];
        _.forEach(rewards, function(reward) {
            slides.push({
                text: `${reward.value} <i class="${window.Laravel.currency['eth'].icon}" style="color: ${reward.color}"></i>`,
                value: slides.length,
                border: {
                    radius: 3.25,
                    fill: reward.color
                }
            });
        });

        $('.wheel').wheel({
            slices: slides,
            selector: 'value',
            width: 350,
            text: {
                color: "white",
                size: 12,
                offset: 5,
                arc: false
            },
            outer: {
                width: 0,
                color: 'transparent'
            },
            inner: {
                width: 11,
                color: '#272d39'
            },
            line: {
                width: 3,
                color: '#272d39'
            },
            slice: {
                background: '#3d4658'
            }
        });

        $('.wheel').wheel('onStep', function() {
            $.playSound('/sounds/tick.mp3');
        });

        $('.wheel').wheel('onComplete', function() {
            $('.bonus-side-menu-container').uiBlocker();
            timeout();

            setTimeout(function() {
                $('.bonus-overlay').click();
            }, 2500);
        });

        $('.bonus-side-menu-container .btn').on('click', function() {
            if($(this).hasClass('disabled')) return;
            $(this).toggleClass('disabled', true);

            $.request('promocode/bonus', {
			captcha: $('.g-recaptcha-response').val()
			}).then(function(response) {
				grecaptcha.reset();
                window.next = response.next;
                $('.wheel').wheel('start', response.slice);
            }, function(error) {
                $('.bonus-side-menu-container .btn').toggleClass('disabled', false);
                if(error === 2) $.error($.lang('general.error.should_have_empty_balance')),	grecaptcha.reset();
                if(error === 3) $.error($.lang('general.error.gameinprogressbonus')), grecaptcha.reset();
				if(error === 4) $.error($.lang('general.error.captcha'));
                else $.error($.lang('general.error.unknown_error', { code: error })), grecaptcha.reset();
            });
        });
    }

    partner() {
        const v = window.Laravel.currency[$.currency()].referralBonusWheel, rewards = [
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#f46e42'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#508bf0'
            },
            {
                value: bitcoin(v * 1.3, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#df1347'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#d1d652'
            },
            {
                value: bitcoin(v * 1.5, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#ffc645'
            },
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#f46e42'
            },
            {
                value: bitcoin(v * 2, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#508bf0'
            },
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#df1347'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#d1d652'
            },
            {
                value: bitcoin(v * 1.3, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#ffc645'
            },
            {
                value: bitcoin(v * 1.15, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#f46e42'
            },
            {
                value: bitcoin(v * 1.5, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#508bf0'
            },
            {
                value: bitcoin(v, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#df1347'
            },
            {
                value: bitcoin(v * 2, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                color: '#d1d652'
            }
        ];
        let slides = [];
        _.forEach(rewards, function(reward) {
            slides.push({
                text: `${reward.value.toFixed(8)} <i class="${window.Laravel.currency[$.currency()].icon}" style="color: ${reward.color}"></i>`,
                value: slides.length,
                border: {
                    radius: 3.25,
                    fill: reward.color
                }
            });
        });

        $('.wheel').wheel({
            slices: slides,
            selector: 'value',
            width: 350,
            text: {
                color: "white",
                size: 12,
                offset: 5,
                arc: false
            },
            outer: {
                width: 0,
                color: 'transparent'
            },
            inner: {
                width: 11,
                color: '#272d39'
            },
            line: {
                width: 3,
                color: '#272d39'
            },
            slice: {
                background: '#3d4658'
            }
        });

        $('.wheel').wheel('onStep', function() {
            $.playSound('/sounds/tick.mp3');
        });

        $('.wheel').wheel('onComplete', function() {
            setTimeout(function() {
                $('.bonus-overlay').click();
            }, 2500);
        });

        $('.bonus-side-menu-container .btn').on('click', function() {
            if($(this).hasClass('disabled')) return;
            $(this).toggleClass('disabled', true);

            $.request('promocode/partner_bonus').then(function(response) {
                $('.wheel').wheel('start', response.slice);
            }, function(error) {
                $('.bonus-side-menu-container .btn').toggleClass('disabled', false);
                if(error === 1) {
                    $('.bonus-overlay').click();
                    redirect('/partner');
                } else $.error($.lang('general.error.unknown_error', { code: error }));
            });
        });
    }

    promocode() {
        $('#activate').on('click', function() {
            $('.modal-ui-block').fadeIn('fast');
            $.request('promocode/activate', { code: $('#code').val() }).then(function() {
                $('.modal-ui-block').fadeOut('fast', () => $(this).html(''));
                $('.bonus-overlay').click();
                $.success($.lang('bonus.promo.success'));
            }, function(error) {
                if(error === 1) $.error($.lang('bonus.promo.invalid'));
                if(error === 2) $.error($.lang('bonus.promo.expired_time'));
                if(error === 3) $.error($.lang('bonus.promo.expired_usages'));
                if(error === 4) $.error($.lang('bonus.promo.used'));
                if(error === 5) $.error($.lang('general.error.promo_limit'));
                if(error === 7) $.error($.lang('general.error.vip_only_promocode'));

                $('.modal-ui-block').fadeOut('fast', () => $(this).html(''));
            });
        }); 
    }



    discord() {
        $('[data-check-subscription]').on('click', function() {
            $('.modal-ui-block').fadeIn('fast');
            $.request('/auth/discord_bonus').then(function() {
                $('.bonus-overlay').click();
                $.success($.lang('bonus.discord.success'));
                redirect(window.location.pathname);
            }, function(error) {
                $('.modal-ui-block').fadeOut('fast');
                $.error($.lang('bonus.discord.error.'+error));
            });
        });
    }

}

$(document).ready(function() {
    $(document).on('click', '[data-close-bonus-modal]',  function () {
        $('.bonus-side-menu').removeClass('active');
        $('.bonus-overlay').toggle();
        $('.wheel-column').css({'z-index': 1});
        $('.wheel-popup').hide();
    });
});

window.timeout = function() {
    if(window.next !== undefined && +new Date() / 1000 < window.next) {
        $('.bonus-side-menu-container .modal-ui-block').fadeIn('fast');
        const timer = function() {
            const diff = ((window.next - (Date.now() / 1000)) | 0);
            let hours = ((diff % 3600) / 1) | 0;
            let minutes = ((diff % 3600) / 60) | 0;
            let seconds = (diff % 60) | 0;

            if(minutes === 0 && seconds < 1) {
                clearInterval(interval);
                $('.bonus-side-menu-container .btn').toggleClass('disabled', false);
                $('.bonus-side-menu-container .modal-ui-block').fadeOut('fast');
                return;
            }

            minutes = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $('#reload').html(`${diff}:${minutes}:${seconds}`);
        };
        let interval = setInterval(function() {
            if($('#reload').length === 0) {
                clearInterval(interval);
                return;
            }

            timer();
        }, 1000);
        timer();
    }
};
