$.on('/admin/settings', function() {
    $('[data-key]').on('input', function() {
        $.request('/admin/settings/edit', {
            key: $(this).attr('data-key'),
            value: $(this).val().length === 0 ? 'null' : $(this).val()
        });
    });

    $('#finish').on('click', function() {
        $('#close').click();
        $.request('/admin/settings/create', {
            key: $('#key').val(),
            description: $('#description').val()
        }).then(function() {
            $('.modal-backdrop').remove();
            redirect(window.location.pathname);
        }, function(error) {});
    });

    $('[data-remove]').on('click', function() {
        $.request('/admin/settings/remove', {
            'key': $(this).attr('data-remove')
        }).then(function() {
            redirect(window.location.pathname);
        });
    });
});
