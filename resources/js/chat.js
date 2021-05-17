import bitcoin from 'bitcoin-units';
const xssFilters = require('xss-filters');

const commands = {
    'tip': function() {
        $.modal('tip').then(function() {
            $.updateBalanceSelector();
            $(`.currency-selector-withdraw`).val($.currency()).trigger('change');
        });
    },
    'rain': function() {
        $(`.currency-selector-withdraw`).val($.currency()).trigger('change');
        $.modal('rain_modal').then(function() {
            $.updateBalanceSelector();
            $(`.currency-selector-withdraw`).val($.currency()).trigger('change');
        });
    }
};

$.formatName = function(name) {
    if(name.count(" ") > 0) {
        name = `${name.split(" ")[0]} ${name.split(" ")[1].substr(0, 1)}.`;
    }
    return xssFilters.inHTMLData(name);
};

$.addChatMessage = function(message) {
    initScrollbars();

    if(message.type === 'rain') {
        let users = '', month = new Date().getMonth(), summer = !(month === 11 || month === 0 || month === 1);
        _.forEach(message.data.users, function(e) {
            users += `<a href="/user/${e._id}" class="disable-pjax" target="_blank">${$.formatName(e.name)}</a>${message.data.users.indexOf(e) === message.data.users.length - 1 ? '' : ', '}`;
        });

        $(`.chat .messages .os-content`).append(`
            <div class="message rain_bot">
                <div class="content">
                    <div class="rain_users">${users}</div>
                    <div class="mt-2 rain_desc">${$.lang(`general.${summer ? 'rain' : 'snow'}`, {
                            sum: bitcoin(message.data.reward, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                            currency: window.Laravel.currency[message.data.currency].name
                        })}${message.data.from === undefined ? '' : `&nbsp;(<a style="color: #a8a8a8" href="/user/${message.data.from._id}" class="disable-pjax" target="_blank">${$.formatName(message.data.from.name)}</a>)`}</div>
                </div>
                </div>
            </div>
        `);

        makeItSnow();
        makeItRain();
    }

    if(message.type === 'premiumrain') {
        let users = '', month = new Date().getMonth(), summer = !(month === 11 || month === 0 || month === 1);
        _.forEach(message.data.users, function(e) {
            users += `<a href="/user/${e._id}" class="disable-pjax" target="_blank">${$.formatName(e.name)}</a>${message.data.users.indexOf(e) === message.data.users.length - 1 ? '' : ', '}`;
        });

        $(`.chat .messages .os-content`).append(`
            <div class="message vip-rain_bot">
                <div class="content">
                    <div class="rain_users">${users}</div>
                    <div class="mt-2 rain_desc"><i class="fas fa-tint"></i>  ${$.lang(`general.${summer ? 'premiumrain' : 'premiumsnow'}`, {
                            sum: bitcoin(message.data.reward, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                            currency: window.Laravel.currency[message.data.currency].name
                        })}${message.data.from === undefined ? '' : `&nbsp;(<a style="color: #a8a8a8" href="/user/${message.data.from._id}" class="disable-pjax" target="_blank">${$.formatName(message.data.from.name)}</a>)`}</div>
                </div>
                </div>
            </div>
        `);

        makeItSnow();
        makeItRain();
    }


    if(message.type === 'quiz') {
        $(`.chat .messages .os-content`).append(`
            <div class="message quiz" data-message-type="quiz">
                <div class="quiz_header">
                    ${$.lang('general.quiz')}
                </div>
                <div class="content">
                    ${message.data.question}
                </div>
            </div>
        `);
    }

    if(message.type === 'tip') {
        $(`.chat .messages .os-content`).append(`
            <div class="message tip" data-message-type="tip">
                <div class="tip_header">
                    ${$.lang('general.tip')}
                </div>
                <div class="content">
                    ${$.lang('general.tip_chat', {
                        link: `/user/${message.data.from._id}`,
                        name: $.formatName(message.data.from.name),
                        value: bitcoin(parseFloat(message.data.amount), 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8),
                        icon: window.Laravel.currency[message.data.currency].icon,
                        style: window.Laravel.currency[message.data.currency].style,
                        tolink: `/user/${message.data.to._id}`,
                        toname: $.formatName(message.data.to.name)
                    })}
                </div>
            </div>
        `);
    }

    if(message.type === 'quiz_answered') {
        $(`.chat .messages .os-content`).append(`
            <div class="message quiz" data-message-type="quiz">
                <div class="quiz_header">
                    ${$.lang('general.quiz')}
                </div>
                <div class="content">
                    ${message.data.question}
                    <div class="answer">
                        <div class="answer_header">${$.lang('general.quiz_answer')}</div>
                        ${message.data.correct}
                        <div class="answer_user"><span>${$.lang('general.quiz_user')}</span> <a class="disable-pjax" href="/user/${message.data.user._id}" target="_blank">${message.data.user.name}</a></div>
                        <div>${bitcoin(message.data.reward, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} ${window.Laravel.currency[message.data.currency].name}</div>
                    </div>
                </div>
            </div>
        `);
    }

    if(message.type === 'message') {
        let userMessage = xssFilters.inHTMLData(message.data);

        if(userMessage.includes('@')) userMessage = userMessage.replace('@'+window.Laravel.userName, '<span class="highlight">@'+xssFilters.inHTMLData(window.Laravel.userName)+'</span>');

        if($(`.chat .messages .os-content .message`).last().attr('data-message-user-id') === message.user._id
            && $(`.chat .messages .os-content .message`).last().attr('data-message-type') === 'message') {
            $(`.chat .messages .os-content .message`).last().find('.content').append(`<div id="${message._id}">${userMessage}</div>`);
        } else $(`.chat .messages .os-content`).append(`
            <div id="${message._id}" class="message from-${message.user.access}" data-message-type="message" data-message-user-id="${message.user._id}">
                <div class="user">
                        ${message.vipLevel > 0 ? `<div class="avatar" onclick="$.vip()" data-toggle="tooltip" data-placement="left" title="${$.lang(`vip.rank.level`, { level: $.lang(`vip.rank.${message.vipLevel}`) })}">
                            ${$.vipIcon(message.vipLevel)}
                        </div>` : ''}
                    <div class="name">
                        <span onclick="redirect('/user/${message.user._id}')">${$.formatName(message.user.name)}</span>
                    </div>
                </div>
                <div class="content">
                    ${userMessage}
                </div>
            </div>
        `);
    }

    if(message.type === 'game_link') {
        $(`.chat .messages .os-content`).append(`
            <div id="${message._id}" class="message from-${message.user.access}" data-message-type="game_link" data-message-user-id="${message.user._id}">
                <div class="user">
                        ${message.vipLevel > 0 ? `<div class="avatar" onclick="$.vip()" data-toggle="tooltip" data-placement="left" title="${$.lang(`vip.rank.level`, { level: $.lang(`vip.rank.${message.vipLevel}`) })}">
                            ${$.vipIcon(message.vipLevel)}
                        </div>` : ''}
                    <div class="name">
                        <span onclick="redirect('/user/${message.user._id}')">${$.formatName(message.user.name)}</span>
                    </div>
                </div>
                <div class="content">
                     <div class="game-link" onclick="$.overview('${message.data._id}', '${message.data.game}')">
                        <div>${message.data.game.capitalize()}: #${message.data.id}</div>
                        <div>${$.lang('general.bets.bet')}: ${bitcoin(message.data.wager, 'btc').to($.unit()).value().toFixed($.unit() === 'satoshi' ? 0 : 8)} <i class="${window.Laravel.currency[message.data.currency].icon}" style="color: ${window.Laravel.currency[message.data.currency].style}"></i></div>
                        <div>${$.lang('general.bets.win')}: ${message.data.multiplier.toFixed(2)}x</div>
                    </div>
                </div>
            </div>
        `);
    }

    if(Laravel.access === 'admin' || Laravel.access === 'moderator') {
        if(message._id !== undefined) $.contextMenu({
            selector: `#${message._id}`,
            items: {
                deleteMessage: {
                    name: "Remove this message", callback: function() {
                        $.request('chat/moderate/removeMessage', { id: message._id });
                    }
                },
                deleteAllMessages: {
                    name: "Remove all messages", callback: function() {
                        $.request('chat/moderate/removeAllFrom', { id: message.user._id });
                    }
                },
                mute: {
                    name: "Mute",
                    items: {
                        five: {
                            name: "5m", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 5 });
                            }
                        },
                        halfhour: {
                            name: "30m", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 30 });
                            }
                        },
                        hour: {
                            name: "1h", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 60 });
                            }
                        },
                        twhours: {
                            name: "12h", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 60 * 12 });
                            }
                        },
                        day: {
                            name: "1d", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 60 * 24 });
                            }
                        },
                        week: {
                            name: "1w", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 60 * 24 * 7 });
                            }
                        },
                        month: {
                            name: "1m", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 60 * 24 * 31 });
                            }
                        },
                        year: {
                            name: "1y", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 525600 });
                            }
                        },
                        forever: {
                            name: "Forever", callback: function() {
                                $.request('chat/moderate/mute', { id: message.user._id, minutes: 525600 * 100 });
                            }
                        }
                    }
                }
            }
        });
    }

    setTimeout(function() {
        $(`.chat .messages`).overlayScrollbars().scroll({ y : "100%" });
    }, 50);
};

$.sendChatMessage = function(selector) {
    $('.chatCommands').fadeOut('fast');

    let message = $(selector).find('textarea').val();
    for(let i = 0; i < Object.keys(commands).length; i++) {
        if($(selector).find('textarea').val().startsWith('/'+Object.keys(commands)[i])) {
            commands[Object.keys(commands)[i]]();
            $(selector).find('textarea').val('');
            return;
        }
    }

    $(selector).find('textarea').val('');
    $.whisper('ChatMessage', {
        'message': message
    }).then(function() {}, function(error) {
        if(error === 1) $.error($.lang('chat.error.length'));
        if(error === 2) $.error($.lang('chat.error.muted'));
    });
    $('[data-user-tag]').fadeOut('fast');
    sentNotify = false;
};

$.unicodeEmoji = function(emoji) {
    const area = $('.message-send').find('textarea');
    area.val(`${area.val()}${area.val().substr(area.val().length - 1, area.val().length) === ' ' ? emoji : ` ${emoji}`}`);
};

$.unicodeEmojiInit = function() {
    $('[data-fill-emoji-target] .os-content').html('');
    const unicodeEmoji = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤔', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '🤓', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '😬', '😰', '😱', '😳', '😵', '😡', '😠', '😇', '🤠', '🤡', '🤥', '😷', '🤒', '🤕', '🤢', '🤧', '😈', '👿', '👹', '👺', '💀', '☠', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿', '👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿', '👨', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿', '👩', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿', '👴', '👴🏻', '👴🏼', '👴🏽', '👴🏾', '👴🏿', '👵', '👵🏻', '👵🏼', '👵🏽', '👵🏾', '👵🏿', '👶', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿', '👼', '👼🏻', '👼🏼', '👼🏽', '👼🏾', '👼🏿', '👮', '👮🏻', '👮🏼', '👮🏽', '👮🏾', '👮🏿', '🕵', '🕵🏻', '🕵🏼', '🕵🏽', '🕵🏾', '🕵🏿', '💂', '💂🏻', '💂🏼', '💂🏽', '💂🏾', '💂🏿', '👷', '👷🏻', '👷🏼', '👷🏽', '👷🏾', '👷🏿', '👳', '👳🏻', '👳🏼', '👳🏽', '👳🏾', '👳🏿', '👱', '👱🏻', '👱🏼', '👱🏽', '👱🏾', '👱🏿', '🎅', '🎅🏻', '🎅🏼', '🎅🏽', '🎅🏾', '🎅🏿', '🤶', '🤶🏻', '🤶🏼', '🤶🏽', '🤶🏾', '🤶🏿', '👸', '👸🏻', '👸🏼', '👸🏽', '👸🏾', '👸🏿', '🤴', '🤴🏻', '🤴🏼', '🤴🏽', '🤴🏾', '🤴🏿', '👰', '👰🏻', '👰🏼', '👰🏽', '👰🏾', '👰🏿', '🤵', '🤵🏻', '🤵🏼', '🤵🏽', '🤵🏾', '🤵🏿', '🤰', '🤰🏻', '🤰🏼', '🤰🏽', '🤰🏾', '🤰🏿', '👲', '👲🏻', '👲🏼', '👲🏽', '👲🏾', '👲🏿', '🙍', '🙍🏻', '🙍🏼', '🙍🏽', '🙍🏾', '🙍🏿', '🙎', '🙎🏻', '🙎🏼', '🙎🏽', '🙎🏾', '🙎🏿', '🙅', '🙅🏻', '🙅🏼', '🙅🏽', '🙅🏾', '🙅🏿', '🙆', '🙆🏻', '🙆🏼', '🙆🏽', '🙆🏾', '🙆🏿', '💁', '💁🏻', '💁🏼', '💁🏽', '💁🏾', '💁🏿', '🙋', '🙋🏻', '🙋🏼', '🙋🏽', '🙋🏾', '🙋🏿', '🙇', '🙇🏻', '🙇🏼', '🙇🏽', '🙇🏾', '🙇🏿', '🤦', '🤦🏻', '🤦🏼', '🤦🏽', '🤦🏾', '🤦🏿', '🤷', '🤷🏻', '🤷🏼', '🤷🏽', '🤷🏾', '🤷🏿', '💆', '💆🏻', '💆🏼', '💆🏽', '💆🏾', '💆🏿', '💇', '💇🏻', '💇🏼', '💇🏽', '💇🏾', '💇🏿', '🚶', '🚶🏻', '🚶🏼', '🚶🏽', '🚶🏾', '🚶🏿', '🏃', '🏃🏻', '🏃🏼', '🏃🏽', '🏃🏾', '🏃🏿', '💃', '💃🏻', '💃🏼', '💃🏽', '💃🏾', '💃🏿', '🕺', '🕺🏻', '🕺🏼', '🕺🏽', '🕺🏾', '🕺🏿', '👯', '🕴', '🗣', '👤', '👥', '🤺', '🏇', '⛷', '🏂', '🏌', '🏄', '🏄🏻', '🏄🏼', '🏄🏽', '🏄🏾', '🏄🏿', '🚣', '🚣🏻', '🚣🏼', '🚣🏽', '🚣🏾', '🚣🏿', '🏊', '🏊🏻', '🏊🏼', '🏊🏽', '🏊🏾', '🏊🏿', '⛹', '⛹🏻', '⛹🏼', '⛹🏽', '⛹🏾', '⛹🏿', '🏋', '🏋🏻', '🏋🏼', '🏋🏽', '🏋🏾', '🏋🏿', '🚴', '🚴🏻', '🚴🏼', '🚴🏽', '🚴🏾', '🚴🏿', '🚵', '🚵🏻', '🚵🏼', '🚵🏽', '🚵🏾', '🚵🏿', '🏎', '🏍', '🤸', '🤸🏻', '🤸🏼', '🤸🏽', '🤸🏾', '🤸🏿', '🤼', '🤼🏻', '🤼🏼', '🤼🏽', '🤼🏾', '🤼🏿', '🤽', '🤽🏻', '🤽🏼', '🤽🏽', '🤽🏾', '🤽🏿', '🤾', '🤾🏻', '🤾🏼', '🤾🏽', '🤾🏾', '🤾🏿', '🤹', '🤹🏻', '🤹🏼', '🤹🏽', '🤹🏾', '🤹🏿', '👫', '👬', '👭', '💏', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💑', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '🏻', '🏼', '🏽', '🏾', '🏿', '💪', '💪🏻', '💪🏼', '💪🏽', '💪🏾', '💪🏿', '🤳', '🤳🏻', '🤳🏼', '🤳🏽', '🤳🏾', '🤳🏿', '👈', '👈🏻', '👈🏼', '👈🏽', '👈🏾', '👈🏿', '👉', '👉🏻', '👉🏼', '👉🏽', '👉🏾', '👉🏿', '☝', '☝🏻', '☝🏼', '☝🏽', '☝🏾', '☝🏿', '👆', '👆🏻', '👆🏼', '👆🏽', '👆🏾', '👆🏿', '🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '👇', '👇🏻', '👇🏼', '👇🏽', '👇🏾', '👇🏿', '✌', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿', '🤞', '🤞🏻', '🤞🏼', '🤞🏽', '🤞🏾', '🤞🏿', '🖖', '🖖🏻', '🖖🏼', '🖖🏽', '🖖🏾', '🖖🏿', '🤘', '🤘🏻', '🤘🏼', '🤘🏽', '🤘🏾', '🤘🏿', '🤙', '🤙🏻', '🤙🏼', '🤙🏽', '🤙🏾', '🤙🏿', '🖐', '🖐🏻', '🖐🏼', '🖐🏽', '🖐🏾', '🖐🏿', '✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿', '👌', '👌🏻', '👌🏼', '👌🏽', '👌🏾', '👌🏿', '👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿', '👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿', '✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', '✊🏿', '👊', '👊🏻', '👊🏼', '👊🏽', '👊🏾', '👊🏿', '🤛', '🤛🏻', '🤛🏼', '🤛🏽', '🤛🏾', '🤛🏿', '🤜', '🤜🏻', '🤜🏼', '🤜🏽', '🤜🏾', '🤜🏿', '🤚', '🤚🏻', '🤚🏼', '🤚🏽', '🤚🏾', '🤚🏿', '👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿', '👏', '👏🏻', '👏🏼', '👏🏽', '👏🏾', '👏🏿', '✍', '✍🏻', '✍🏼', '✍🏽', '✍🏾', '✍🏿', '👐', '👐🏻', '👐🏼', '👐🏽', '👐🏾', '👐🏿', '🙌', '🙌🏻', '🙌🏼', '🙌🏽', '🙌🏾', '🙌🏿', '🙏', '🙏🏻', '🙏🏼', '🙏🏽', '🙏🏾', '🙏🏿', '🤝', '🤝🏻', '🤝🏼', '🤝🏽', '🤝🏾', '🤝🏿', '💅', '💅🏻', '💅🏼', '💅🏽', '💅🏾', '💅🏿', '👂', '👂🏻', '👂🏼', '👂🏽', '👂🏾', '👂🏿', '👃', '👃🏻', '👃🏼', '👃🏽', '👃🏾', '👃🏿', '👣', '👀', '👁', '👁‍🗨', '👅', '👄', '💋', '💘', '❤', '💓', '💔', '💕', '💖', '💗', '💙', '💚', '💛', '💜', '🖤', '💝', '💞', '💟', '❣', '💌', '💤', '💢', '💣', '💥', '💦', '💨', '💫', '💬', '🗨', '🗯', '💭', '🕳', '👓', '🕶', '👔', '👕', '👖', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '👞', '👟', '👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '⛑', '📿', '💄', '💍', '💎', '🐵', '🐒', '🦍', '🐶', '🐕', '🐩', '🐺', '🦊', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦌', '🦄', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🐘', '🦏', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿', '🦇', '🐻', '🐨', '🐼', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊', '🦅', '🦆', '🦉', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🦀', '🦐', '🦑', '🦋', '🐌', '🐛', '🐜', '🐝', '🐞', '🕷', '🕸', '🦂', '💐', '🌸', '💮', '🏵', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘', '🍀', '🍁', '🍂', '🍃', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥞', '🧀', '🍖', '🍗', '🥓', '🍔', '🍟', '🍕', '🌭', '🌮', '🌯', '🥙', '🥚', '🍳', '🥘', '🍲', '🥗', '🍿', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🍽', '🍴', '🥄', '🔪', '🏺', '🌍', '🌎', '🌏', '🌐', '🗺', '🗾', '🏔', '⛰', '🌋', '🗻', '🏕', '🏖', '🏜', '🏝', '🏞', '🏟', '🏛', '🏗', '🏘', '🏙', '🏚', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🕍', '⛩', '🕋', '⛲', '⛺', '🌁', '🌃', '🌄', '🌅', '🌆', '🌇', '🌉', '♨', '🌌', '🎠', '🎡', '🎢', '💈', '🎪', '🎭', '🖼', '🎨', '🎰', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🚲', '🛴', '🛵', '🚏', '🛣', '🛤', '⛽', '🚨', '🚥', '🚦', '🚧', '🛑', '⚓', '⛵', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢', '✈', '🛩', '🛫', '🛬', '💺', '🚁', '🚟', '🚠', '🚡', '🚀', '🛰', '🛎', '🚪', '🛌', '🛏', '🛋', '🚽', '🚿', '🛀', '🛀🏻', '🛀🏼', '🛀🏽', '🛀🏾', '🛀🏿', '🛁', '⌛', '⏳', '⌚', '⏰', '⏱', '⏲', '🕰', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡', '☀', '🌝', '🌞', '⭐', '🌟', '🌠', '☁', '⛅', '⛈', '🌤', '🌥', '🌦', '🌧', '🌨', '🌩', '🌪', '🌫', '🌬', '🌀', '🌈', '🌂', '☂', '☔', '⛱', '⚡', '❄', '☃', '⛄', '☄', '🔥', '💧', '🌊', '🎃', '🎄', '🎆', '🎇', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🎀', '🎁', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🏀', '🏐', '🏈', '🏉', '🎾', '🎱', '🎳', '🏏', '🏑', '🏒', '🏓', '🏸', '🥊', '🥋', '🥅', '🎯', '⛳', '⛸', '🎣', '🎽', '🎿', '🎮', '🕹', '🎲', '♠', '♥', '♦', '♣', '🃏', '🀄', '🎴', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙', '🎚', '🎛', '🎤', '🎧', '📻', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '📱', '📲', '☎', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥', '🖨', '⌨', '🖱', '🖲', '💽', '💾', '💿', '📀', '🎥', '🎞', '📽', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🔬', '🔭', '📡', '🕯', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '💹', '💱', '💲', '✉', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏', '✒', '🖋', '🖊', '🖌', '🖍', '📝', '💼', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝', '🔨', '⛏', '⚒', '🛠', '🗡', '⚔', '🔫', '🏹', '🛡', '🔧', '🔩', '⚙', '🗜', '⚗', '⚖', '🔗', '⛓', '💉', '💊', '🚬', '⚰', '⚱', '🗿', '🛢', '🔮', '🛒', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '🛂', '🛃', '🛄', '🛅', '⚠', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢', '☣', '⬆', '↗', '➡', '↘', '⬇', '↙', '⬅', '↖', '↕', '↔', '↩', '↪', '⤴', '⤵', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛', '🕉', '✡', '☸', '☯', '✝', '☦', '☪', '☮', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶', '⏩', '⏭', '⏯', '◀', '⏪', '⏮', '🔼', '⏫', '🔽', '⏬', '⏸', '⏹', '⏺', '⏏', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♻', '📛', '⚜', '🔰', '🔱', '⭕', '✅', '☑', '✔', '✖', '❌', '❎', '➕', '➖', '➗', '➰', '➿', '〽', '✳', '✴', '❇', '‼', '⁉', '❓', '❔', '❕', '❗', '〰', '©', '®', '™', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '💯', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰', '🆎', '🅱', '🆑', '🆒', '🆓', 'ℹ', '🆔', 'Ⓜ', '🆕', '🆖', '🅾', '🆗', '🅿', '🆘', '🆙', '🆚', '🈁', '🈂', '🈷', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗', '㊙', '🈺', '🈵', '▪', '▫', '◻', '◼', '◽', '◾', '⬛', '⬜', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔲', '🔳', '⚪', '⚫', '🔴', '🔵', '🏁', '🚩', '🎌', '🏴', '🏳', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾', '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵', '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿', '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿', '🇴🇲', '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼', '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿', '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿', '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺', '🇼🇫', '🇼🇸', '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼']
    $.chain(unicodeEmoji.length, 1, function(i) {
        if($('.sticker-emoji').length > 0) return;
        $('[data-fill-emoji-target] .os-content').append(`
            <div class="emoji" onclick="$.unicodeEmoji('${unicodeEmoji[i - 1]}')">${unicodeEmoji[i - 1]}</div>
        `);
    });
};

$(document).ready(function() {
    initScrollbars();

    $('.emoji-container .content').overlayScrollbars({
        scrollbars: {
            autoHide: 'leave'
        }
    });

    $(document).click(function(event) {
        if(!$(event.target).closest('.emoji-container').length && !$(event.target).closest('#emoji-container-toggle').length) $('.emoji-container').removeClass('active');
    });

    $.request('chatHistory').then(function(response) {
        _.forEach(response.reverse(), function(message) {
            $.addChatMessage(message);
        });

        $(`.chat .messages`).overlayScrollbars().scroll({ y : "100%" });
    });

    _.forEach(Object.keys(commands), function(command) {
        const e = $(`<div class="chatCommand"><strong>/${command}</strong> ${$.lang('general.chat_commands./'+command)}</div>`);
        $('.chatCommands').append(e);
        e.on('click', function() {
            commands[command]();
            $('.chatCommands').fadeOut('fast');
        });
    });

    $('#chatCommandsToggle').on('click', function() {
        $('.chatCommands').fadeToggle('fast');
    });

    $(document).on('click', '.rain_modal .btn', function() {
        $('.rain_modal').uiBlocker(true);
        $.request('chat/rain', { amount: $('#rainamount').val(), users: $('#rainusers').val() }).then(function() {
            $.modal('rain_modal').then((e) => e.uiBlocker(false));
        }, function(error) {
            $('.rain_modal').uiBlocker(false);
            if(error === 1) $.error($.lang('general.chat_commands.modal.rain.invalid_users_length'));
            if(error === 2) $.error($.lang('general.chat_commands.modal.rain.invalid_amount'));
        });
    });

    $(document).on('click', '.tip .btn', function() {
        $('.tip').uiBlocker(true);
        $.request('chat/tip', { amount: $('#tipamount').val(), user: $('#tipname').val(), public: $('#tippublic').is(':checked') }).then(function() {
            $.modal('tip').uiBlocker((e) => e.uiBlocker(false));
        }, function(error) {
            $('.tip').uiBlocker(false);
            if(error === 1) $.error($.lang('general.chat_commands.modal.tip.invalid_name'));
            if(error === 2) $.error($.lang('general.chat_commands.modal.tip.invalid_amount'));
        });
    });
});

let sentNotify = false;
const initScrollbars = function() {
    if($('.chat .messages .os-content').length === 0) {
        $('.message-send textarea').on('input', function() {
            if($(this).val().length <= 1) sentNotify = false;
            if($(this).val().includes('@') && !sentNotify) {
                $('[data-user-tag]').fadeIn('fast');

                const tags = $(this).val().match(/@\w+/g);
                if((tags !== null && tags.length > 0) || $(this).val() === '@') {
                    const tag = $(this).val() === '@' ? '@' : tags[0].substr(1);
                    $('[data-user-tag] .hint-content').html('');
                    let prev = $(this).val();
                    $.whisper('OnlineUsers').then(function(response) {
                        if(prev !== $('.message-send textarea').val()) return;
                        $('[data-user-tag] .hint-content').html('');
                        _.forEach(response, function(name) {
                            if($('.message-send textarea').val().length > 1 && !name.includes(tag)) return;
                            const l = $(`<div class="hint-tag-name">@${name}</div>`);
                            $('[data-user-tag] .hint-content').append(l);
                            l.on('click', function() {
                                $('.message-send textarea').val($('.message-send textarea').val().replace(tag, (tag === '@' ? '@' : '')+name));
                                $('[data-user-tag]').fadeOut('fast');
                                sentNotify = true;
                            });
                        });
                    });
                }
            } else $('[data-user-tag]').fadeOut('fast');
        });

        $('.message-send textarea').overlayScrollbars({
            scrollbars: {
                autoHide: 'leave'
            }
        });
        $('.chat .messages').overlayScrollbars({
            scrollbars: {
                autoHide: 'leave'
            }
        });
        $('.chat .hint-content').overlayScrollbars({
            scrollbars: {
                autoHide: 'leave'
            }
        });
    }
};

const makeItSnow = function() {
    $('.snow-back').empty();
    let increment = 0;

    while(increment < 200) {
        $('.snow-back').append('<div class="snow"></div>');
        increment++;
    }
};

const makeItRain = function() {
    $('.rain').empty();

    let increment = 0;
    let drops = "", backDrops = "";

    while (increment < 100) {
        const h = (Math.floor(Math.random() * 98 + 1));
        const fiver = (Math.floor(Math.random() * 5 + 2));
        const height = (Math.floor(Math.random() * 70 + 25));
        increment += fiver;
        drops += `<div class="drop" style="left: ${increment}%; height: ${height}px; bottom: ${fiver + fiver - 1 + 100}%; animation-delay: 0.${h}s; animation-duration: 0.5${h}s;"><div class="stem" style="animation-delay: 0.${h}s; animation-duration: 0.5${h}s;"></div></div>`;
        backDrops += `<div class="drop" style="right:${increment}%; height: ${height}px; bottom: ${fiver + fiver - 1 + 100}%; animation-delay: 0.${h}s; animation-duration: 0.5${h}s;"><div class="stem" style="animation-delay: 0.${h}s; animation-duration: 0.5${h}s;"></div></div>`;
    }

    //$('.rain.front-row').append(drops);
    //$('.rain.back-row').append(backDrops);
};
