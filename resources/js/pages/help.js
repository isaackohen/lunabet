$.on('/help', function() {
    $('.help .title').on('click', function() {
        $(this).parent().toggleClass('active');
    });
}, ['/css/pages/help.css']);
