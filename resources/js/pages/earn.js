$.on('/earn', function() {

    $('[data-toggle-earn-tab]').on('click', function() {
        if($(this).hasClass('active')) return;
        $(`[data-toggle-earn-tab]`).removeClass('active');
        $(this).addClass('active');

        $(`[data-earn-tab]`).hide();
        $(`[data-earn-tab="${$(this).attr('data-toggle-earn-tab')}"]`).fadeIn('fast');
    });
    
}, ['/css/pages/earn.css']);
