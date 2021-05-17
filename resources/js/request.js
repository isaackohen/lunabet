/**
 * @param route API route. If starts without "/", then /api/ will be prepended.
 * @param options GET requires array like ['foo', 'bar'] (optional)
 *                POST requires objects like {'foo': 'value', 'bar': 'value'}
 * @param type get|post
 * @param timeout Timeout in ms
 * @returns Promise
 */
$.request = function(route, options = [], type = 'post', timeout = 25000) {
    const url = `${!route.startsWith('/') ? '/api/' : ''}${route + (type === 'get' ? arrayToRouteParams(options) : '')}`;
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: type.toUpperCase(),
            data: type.toLowerCase() === 'get' ? [] : options,
            dataType: 'json',
            timeout: timeout,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
                xhr.setRequestHeader('Authorization', `Bearer ${whispers.bearerToken}`);
            },
            success: (json) => handleApiResponse(url, json, resolve, reject),
            error: function(data) {
                if(data.status === 500) {
                    console.error('Failed request (500)');
                    reject(0);

                    if(typeof $.error === "function") {
                        $.error($.lang('error.code', {'code': 500}));
                        $.blockPlayButton(false);
                    }
                } else if(data.status === 422) {
                    console.log('Failed validation (422):');
                    let json = JSON.parse(data.responseText);
                    console.log(json.message);
                    console.log(json.errors);
                    reject(json.errors);
                } else if(data.status !== 0) {
                    console.error(`Failed request (${data.status}):`);
                    console.error(`Route ${route + arrayToRouteParams(options)} is unreachable`);
                    reject(-1);
                } else {
                    console.error(`Route ${route + arrayToRouteParams(options)} timed out (${timeout}ms)`);
                    reject(0);
                }
            }
        });
    })
};

function handleApiResponse(url, json, resolve, reject) {
    if(json.message != null && json.errors != null) {
        reject(0);
        return;
    }

    if(json.error != null) {
        if(json.error[0] === -1024) {
            console.log(url, '-1024', '2FA session expired');

            $.tfa(function() {
                $.request(route, options, type).then(function(response) {
                    resolve(response);
                }, function(error) {
                    reject(error);
                });
            });
            return;
        } else console.error(url, json.error[0] + ' > ' + json.error[1]);
        reject(json.error[0]);
        return;
    }

    console.log(url, json);
    resolve(json.response);
}

$.formDataRequest = function(route, options) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: `${!route.startsWith('/') ? '/api/' : ''}${route}`,
            type: 'POST',
            data: options,
            contentType: false,
            processData: false,
            success: function() {
                resolve();
            },
            error: function(data) {
                reject(data);
            }
        });
    })
};

$.parseValidation = function(json, keyTranslations) {
    let result = '';
    for(let i = 0; i < Object.keys(json).length; i++) {
        result += `${i === 0 ? '' : '<br>'} * ${$.lang(keyTranslations[Object.keys(json)[i]])}`;
        for(let j = 0; j < Object.values(json)[i].length; j++) result += '<br>' + $.lang('error.'+Object.values(json)[i][j]);
    }
    return result;
};

$.setBearer = function(token) {
    whispers.bearerToken = token;
}

const whispers = {
    data: {},
    bearerToken: null
}

$.whisper = function(event, data = {}) {
    return new Promise(function(resolve, reject) {
        const id = $.randomId();
        window.Echo.private('Whisper').whisper(event, {
            jwt: whispers.bearerToken,
            id: id,
            data: data
        });

        whispers.data[id] = {
            name: event,
            time: +new Date(),
            resolve: resolve,
            reject: reject
        };
    });
}

$(document).on('bootstrap:load', function() {
    window.Echo.channel(`laravel_database_private-App.User.${$.isGuest() ? 'Guest' : $.userId()}`).listen('WhisperResponse', (e) => {
        const whisper = whispers.data[e.id];
        if(whisper !== undefined) {
            handleApiResponse(`WS ${whisper.name} > ${+new Date() - whisper.time}ms`, e.data, whisper.resolve, whisper.reject);
            delete whispers.data[e.id];
        } else console.error(`WhisperResponse`, `Unknown event id ${e.id}`, e.data);
    });
});

function arrayToRouteParams(array) {
    let result = '';
    for(let i = 0; i < array.length; i++) result += `/${array[i]}`;
    return result;
}
