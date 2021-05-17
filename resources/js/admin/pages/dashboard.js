$.on('/admin', function() {
    $.get('/admin/dashboard', function(response) {
        $('.dashboard').html(response);
    });
    $.get('/admin/games', function(response) {
        $('.dashboard_games').html(response);
    });
    $.get('/admin/analytics', function(response) {
        $('.dashboard_analytics').html(response);
    });
});
