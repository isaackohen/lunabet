$(document).ready(function() {
    $(document).on('click', '#change-name-btn', function() {
        $('.change_name').uiBlocker();
        $.request('user/name_change', { name: $('#new-name').val() }).then(function() {
            window.location.reload();
        }, function(error) {
            $('.change_name').uiBlocker(false);
            $.error($.parseValidation(error, {
                'name': $.lang('general.auth.credentials.login')
            }));
        });
    });
});
