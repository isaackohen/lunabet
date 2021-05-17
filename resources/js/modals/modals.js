require('./wallet');
require('./auth');
require('./vip');
require('./change-name');
require('./change-client-seed');
require('./tfa');
require('./leaderboard');
require('./races');

$.modal = function(id, option = null) {
    return new Promise(function(resolve) {
        const load = function(e, firstTime) {
            e.find('.ui-blocker').fadeOut('fast');

            if(firstTime) {
                e.find('.modal-content').overlayScrollbars({
                    scrollbars: {
                        autoHide: 'leave'
                    }
                });

                $.each(e.find('i'), (i, e) => $.transformIcon($(e)));
            }

            if(option != null) {
                switch (option) {
                    case 'show':
                        e.toggleClass('show', true);
                        break;
                    case 'hide':
                        e.toggleClass('show', false);
                        break;
                    default:
                        throw new Error(`Unknown modal option ${option}`);
                }
            } else e.toggleClass('show');

            resolve(e, firstTime);
        };

        if($(`.${id}`).length === 0) {
            // TODO: Show preloader
            $.get(`/modals.${id}`, function(response) {
                $('.modal-wrapper').prepend(response);
                load($(`.${id}`), true);
            });
        }
        else load($(`.${id}`), false);
    });
}


 $('.modal').click(function (e) {
    $('.modal').modal('toggle');
 });
 
$(document).ready(function() {
    
    $(document).on('click', '.btn-close', function() {
        const modal = $(this).parent().parent().parent().parent().parent().parent().parent().remove();
        modal.toggleClass('show');
        modal.removeData();

        setTimeout(() => $.blockPlayButton(false), 1000);
    });

    $.fn.uiBlocker = function(show = true) {
        if(show) this.find('.ui-blocker').fadeIn('fast');
        else this.find('.ui-blocker').fadeOut('fast');

    };
});
