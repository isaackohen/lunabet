let currentAuthMethod = 'auth';

$.auth = function() {
    $.modal('auth', 'show').then(() => {
        currentAuthMethod = 'auth';

        $('.auth .modal-title').html($.lang('general.auth.login'));
        $('.auth .btn-block').html($.lang('general.auth.login'));
        $('#auth-footer').fadeIn(100);
        $('#register-footer').hide();
    });
};

$.register = function() {
    $.modal('auth', 'show').then(() => {
        currentAuthMethod = 'register';

        $('.auth .modal-title').html($.lang('general.auth.register'));
        $('.auth .btn-block').html($.lang('general.auth.register'));
        $('#auth-footer').hide();
        $('#register-footer').fadeIn(100);
    });
};

$(document).ready(function() {
    $(document).on('click', '.auth .btn-block', function() {
        $.eraseCookie('token');

        const login = $('#login').val(), password = $('#password').val(), captcha = $('.g-recaptcha-response').val();
        if(currentAuthMethod === 'auth') {
            $('.auth').uiBlocker();
            $.request('/auth/login', {
                'name': login,
                'password': password,
				'captcha': captcha
            }).then(function() {
				grecaptcha.reset();
                window.location.reload();
            }, function(reason) {
                $('.auth').uiBlocker(false);
                if(reason === 1) $.error($.lang('general.auth.wrong_credentials')), grecaptcha.reset();
				if(reason === 4) $.error($.lang('general.error.captcha'));
                else $.error($.parseValidation(reason, {
                    'name': 'general.auth.credentials.login',
                    'password': 'general.auth.credentials.password'
                }));
            });
        } else {
            $('.auth').uiBlocker();
            $.request('/auth/register', {
                'name': login,
                'password': password,
				'captcha': captcha
            }).then(function() {
				grecaptcha.reset();
                window.location.reload();
                window.location.href = '/bonus';
                $.eraseCookie('agm');
                $.eraseCookie('c');

            }, function(error) {
                $('.auth').uiBlocker(false);
				if(error === 4) $.error($.lang('general.error.captcha'));
                else $.error($.parseValidation(error, {
                    'name': 'general.auth.credentials.login',
                    'password': 'general.auth.credentials.password'
                })), grecaptcha.reset();
            });
        }
    });

    $(document).on('click', '[data-social]', function() {
        $('.auth').uiBlocker();
        window.location.href = '/auth/'+$(this).attr('data-social');
    });
});
