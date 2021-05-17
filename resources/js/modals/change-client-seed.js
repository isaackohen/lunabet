$(document).ready(function() {
    $(document).on('click', '#change-client-seed-btn', function() {
        $('.change_client_seed').uiBlocker();
        $.request('user/client_seed_change', { client_seed: $('#new-client-seed').val() }).then(function() {
            window.location.reload();
        }, function(error) {
            $('.change_client_seed').uiBlocker(false);
            $.error(error);
        });
    });
});
