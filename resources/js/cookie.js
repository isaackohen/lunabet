$.setCookie = function(key, value, expiry = 365) {
    let expires = new Date();
    expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';path=/;expires=' + expires.toUTCString();
};

$.getCookie = function(key) {
    const keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
};

$.eraseCookie = function(key) {
    $.setCookie(key, $.getCookie(key), '-1');
};
