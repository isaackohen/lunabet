import bitcoin from 'bitcoin-units';
const clipboard = require('clipboard-polyfill');
const qr = require('qrcode');
require('bootstrap4-toggle');

$.on('/user', function() {
    page = 0;
    loadNextPage();

    $('[data-change-avatar]').on('click', function() {
        $('#image-input').click();
    });

    $('#image-input').on('change', function() {
        const data = new FormData();
        data.append('image', $('#image-input')[0].files[0]);

        $.formDataRequest('settings/avatar', data).then(function() {
            window.location.reload();
        }, function() {
            $.error('Unknown error');
        });
    });

    $('[data-toggle-tab]').on('click', function() {
        if($(this).hasClass('active')) return;

        $('[data-tab]').hide();
        $(`[data-tab="${$(this).attr('data-toggle-tab')}"]`).fadeIn('fast');
        $('.profile-sidebar li.active').removeClass('active');
        $(this).addClass('active');
    });

    if(window.location.hash.includes('#')) $(`[data-toggle-tab="${window.location.hash.substr(1)}"]`).click();

    $('[data-update-email]').on('click', function() {
        if($(this).hasClass('disabled')) return;
        $('[data-update-email]').addClass('disabled');

        $.request('user/updateEmail', {
            email: $('#emailUpdate').val()
        }).then(function() {
            $('[data-update-email]').removeClass('disabled');
            $.success($.lang('general.profile.email_update_success'));
            var metadata = {
            email: $('#emailUpdate').val()
            };
            $crisp.push(["set", "session:event", [[["email-updated"]]]])
            $('#emailNotification').slideUp('fast', function() { $(this).remove(); });
        }, function() {
            $('[data-update-email]').removeClass('disabled');
            $.error($.lang('general.profile.invalid_email'));
        });
    });

    $('#2facode').on('click', function() {
        clipboard.writeText($(this).val());
        $.success($.lang('wallet.copied'));
    });

    $('#enable2fa').on('click', function() {
        $('.settingsNotifyLoading').fadeIn('fast');
        $.request('user/2fa_enable', {
            '2facode': $('#2facode').val(),
            '2faucode': $('#2faucode').val()
        }).then(function() {
            window.location.hash = 'security';
            window.location.reload();
        }, function() {
            $('.settingsNotifyLoading').fadeOut('fast');
            $.error($.lang('general.profile.error_2fa'));
        });
    });

    $('#2fadisable').on('click', function() {
        $.request('user/2fa_disable').then(function() {
            window.location.hash = 'security';
            window.location.reload();
        });
    });

    if($('#qrcanvas').length > 0) qr.toCanvas($('#qrcanvas')[0], $('#qrcanvas').data('text'));

    _.forEach($('[data-c]'), function(e) {
        $(e).html(bitcoin(parseFloat($(e).html()), 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8));
    })
}, ['/css/pages/user.css']);

$(document).on('click', '[data-vip-discord-update]', function() {
    if($(this).hasClass('disabled')) return;
    $(this).addClass('disabled');
    $.request('/auth/discord_role').then(function() {
        $.success($.lang('general.profile.vip_discord_updated'));
    });
});

let page, loading = false;

$(window).scroll(function() {
    if(!window.location.pathname.includes('user') || page === undefined) return;
    if($(window).scrollTop() >= ($('.user_games_selector').offset().top + $('.user_games_selector').height() - 250)) loadNextPage();
});

function loadNextPage() {
    if(loading) return true;
    loading = true;
    $.request('user/games', [$('[data-user-profile-id]').attr('data-user-profile-id'), page], 'get').then(function(response) {
        _.forEach(response.page, function(game) {
            $.insertProfileGame(game);
        });
        loading = false;
        page += 1;
    });
}

$.insertProfileGame = function(game) {
    $('.user_games_selector').append(`<tr>
            <th>
                <div>
                    <div class="icon d-none d-md-inline-block" onclick="redirect('/game/${game.metadata.id}')">
                        <i class="${game.metadata.icon}"></i>
                    </div>
                    <div class="name">
                        <div><a href="/game/${game.metadata.id}">${game.metadata.name}</a></div>
                        <a href="javascript:void(0)" onclick="$.overview('${game.game._id}', '${game.game.game}')">${$.lang('general.overview')}</a>
                    </div>
                </div>
            </th>
            <th data-highlight class="d-none d-md-table-cell">
                <div>
                    ${bitcoin(game.game.wager, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)}
                    <i class="${window.Laravel.currency[game.game.currency].icon}" style="color: ${window.Laravel.currency[game.game.currency].style}"></i>
                </div>
            </th>
            <th data-highlight class="d-none d-md-table-cell">
                <div>
                    ${game.game.multiplier.toFixed(2)}x
                </div>
            </th>
            <th>
                <div class="${game.game.status === 'win' ? 'live-win' : ''}">
                    <span>
                        ${bitcoin(game.game.profit, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)}
                        <i class="${window.Laravel.currency[game.game.currency].icon}" style="color: ${window.Laravel.currency[game.game.currency].style}"></i>
                    </span>
                </div>
            </th>
        </tr>`).find('[data-toggle="tooltip"]').tooltip();
    $.each($('i'), (i, e) => $.transformIcon($(e)));
};
