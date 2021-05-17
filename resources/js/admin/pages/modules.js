$.on('/admin/modules', function() {
    if(window.location.pathname.count('/') < 3) return;
    $('[data-toggle-module]').on('change', function() {
        $.request('/admin/toggle_module', {
            api_id: $(this).attr('data-api-id'),
            module_id: $(this).attr('data-toggle-module'),
            demo: $(this).attr('data-demo')
        }).then(function() {
            redirect(window.location.pathname);
        }, function(error) {
            $.error(`Произошла ошибка (код ${error})`);
        });
    });

    $('[data-input-setting]').on('input', function() {
        if($(this).val().length < 1) return;
        $.request('/admin/option_value', {
            'api_id': $(this).attr('data-api-id'),
            'module_id': $(this).attr('data-module-id'),
            'option_id': $(this).attr('data-input-setting'),
            'demo': $(this).attr('data-demo'),
            'value': $(this).val()
        });
    });
});
