$.on('/admin/notifications', function() {
    $('#finish').on('click', function() {
        $('#close').click();
        $.request('/admin/notifications/browser', {
            title: $('#title').val(),
            message: $('#message').val()
        }).then(function() {
            $('#create').modal('hide');
            $('.modal-backdrop').remove();
            $.success('Success');
        }, function(error) {});
    });

    $('#finish_standalone').on('click', function() {
        $('#close_standalone').click();
        $.request('/admin/notifications/standalone', {
            title: $('#title_standalone').val(),
            message: $('#message_standalone').val()
        }).then(function() {
            $('#create_standalone').modal('hide');
            $('.modal-backdrop').remove();
            $.success('Success');
        }, function(error) {});
    });

    $('#finish_global').on('click', function() {
        $('#close_global').click();
        $.request('/admin/notifications/global', {
            icon: $('#icon_global').val(),
            text: $('#text_global').val()
        }).then(function() {
            $('#create_global').modal('hide');
            $('.modal-backdrop').remove();
            redirect(window.location.pathname);
        }, function(error) {});
    });

    $('[data-gn-remove]').on('click', function() {
        $.request('/admin/notifications/global_remove', {
            id: $(this).attr('data-gn-remove')
        }).then(function() {
            redirect(window.location.pathname);
        });
    })
});
