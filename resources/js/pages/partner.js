const clipboard = require('clipboard-polyfill');

$.on('/partner', function() {
    $('[data-toggle-tab]').on('click', function() {
        if($(this).hasClass('active')) return;
        $(`[data-toggle-tab]`).removeClass('active');
        $(`[data-toggle-tab="${$(this).attr('data-toggle-tab')}"]`).addClass('active');

        $('[data-tab]').hide();
        $(`[data-tab="${$(this).attr('data-toggle-tab')}"]`).fadeIn('fast');
        $('.tooltip').remove();
    });

    if(window.location.hash.includes('#')) {
        $(`[data-toggle-tab="${window.location.hash.substr(1)}"]`).click();
    }

    $('#link').on('click', function() {
        clipboard.writeText($(this).val());
        $.success($.lang('general.link_copied'));
    });

    $('#refs').DataTable({
        destroy: true,
        searching: false,
        bLengthChange: false,
        language: {
            "processing": "...",
            "lengthMenu": "_MENU_",
            "info": "_START_-_END_/_TOTAL_",
            "infoEmpty": "0-0/0",
            "infoPostFix": "",
            "loadingRecords": "...",
            "zeroRecords": ":(",
            "emptyTable": ":(",
            "paginate": {
                "previous": "<i class='fal fa-angle-left'>",
                "next": "<i class='fal fa-angle-right'>"
            }
        }
    });
}, ['/css/pages/partner.css']);
