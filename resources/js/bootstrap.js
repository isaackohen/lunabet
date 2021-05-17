window._ = require('lodash');
window.Popper = require('popper.js').default;
window.$ = window.jQuery = require('jquery');

require('./cookie');
require('./request');
require('./lang');

require('bootstrap');
require('tilt.js');
require('select2');
require('./superwheel');
require('jquery-ui/ui/widgets/slider');
require('jquery-ui-touch-punch');
require('overlayscrollbars');
require('bootstrap4-toggle');
require('datatables.net');
require('jquery-contextmenu');
require('jquery-lazy');

require('./icons');

require('./modals/modals');


$.ajaxPrefilter(function(options) {
    if(options.type === 'GET' && options.dataType === 'script') options.cache = true;
});

$.mixManifest = function(asset) {
    return window._mixManifest[asset] ?? asset;
}

$.isGuest = function() {
    return window.Laravel.userId == null;
};

$.userId = function() {
    return window.Laravel.userId;
};

$.randomId = function() {
    return '_' + Math.random().toString(36).substr(2, 64) + ($.isGuest() ? 'g' : $.userId());
};

$.moveNumbers = function moveNumbers(num) { 
    var txt=document.getElementById("gamelist-search").value; 
    txt=txt + num; 
    document.getElementById("gamelist-search").value=txt; 
    };

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';

window.io = require('socket.io-client');

let assetsLoaded = false, successfullyGrantedToken = false;
const reconnect = function() {
    const error = function(callback) {
        let secondsLeft = 5 + 1;
        const timer = function() {
            secondsLeft--;
            $('.pageLoader .error').html($.lang('general.error.token_grant_error', { seconds: secondsLeft })).fadeIn('fast');

            if(secondsLeft <= 0) {
                $('.pageLoader .error').html($.lang('general.error.token_grant_reconnecting'));
                callback();
            } else setTimeout(timer, 5000);
        };
        timer();
    };

    $.request('/auth/token', {
        refresh: $.getCookie('token') == null
    }).then(function(response) {
        $.setBearer(response.token);

        window.Echo = new Echo({
            broadcaster: 'socket.io',
            host: `${window.location.hostname}:8443`,
            auth: {
                headers: {
                    Authorization: `Bearer ${response.token}`
                }
            }
        });

        $.whisper('Ping');

        if ($.getCookie('token') == null) $.setCookie('token', '', 365 - 1);

        $.getScript($.mixManifest('/js/app.js'), function () {
            successfullyGrantedToken = true;
        });
    }, () => error(reconnect));
};

reconnect();

$(window).on('load', function() {
    assetsLoaded = true;
});

const unloadLoader = setInterval(function() {
    if(assetsLoaded && successfullyGrantedToken) {
        $(document).trigger('bootstrap:load');
        $('.pageLoader').delay(300).fadeOut('normal');
        clearInterval(unloadLoader);
    }
}, 20);
