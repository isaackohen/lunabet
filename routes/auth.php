<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\User;
use Tymon\JWTAuth\Facades\JWTAuth;

function createUser($login, $password, $avatar = null, $additionalData = []) {
    $user = User::create(array_merge([
        'name' => $login,
        'password' => $password == null ? null : Hash::make($password),
        'avatar' => $avatar ?? '/avatar/'.uniqid(),
        'email' => null,
        'freegames' => 0,
        'client_seed' => \App\Games\Kernel\ProvablyFair::generateServerSeed(),
        'access' => 'user',
        'stickers' => [],
        'name_history' => [['time' => \Carbon\Carbon::now(), 'name' => $login]],
        'register_ip' => User::getIp(),
        'login_ip' => User::getIp(),
        'register_multiaccount_hash' => request()->hasCookie('s') ? request()->cookie('s') : null,
        'login_multiaccount_hash' => request()->hasCookie('s') ? request()->cookie('s') : null
    ], $additionalData));

    $user->update(['jwt' => JWTAuth::fromUser($user)]);

    if(isset($_COOKIE['c'])) {
        $referrer = User::where('_id', $_COOKIE['c'])->first();

        if($referrer != null) {
            $user->update(['referral' => $referrer->_id]);
            //$user->balance(\App\Currency\Currency::find('eth'))->add(floatval(\App\Currency\Currency::find('eth')->option('referral_bonus')));
        }
    }

    if(isset($_COOKIE['agm'])) {
            $user->update(['agm' => $_COOKIE['agm']]);
    }


    auth()->login($user, true);
}

Route::post('/token', function() {
    if(auth()->guest()) return success(['token' => '-']);
    if(\request()->boolean('refresh') || auth()->user()->jwt == null) auth()->user()->update(['jwt' => JWTAuth::fromUser(auth()->user())]);
    return success(['token' => auth()->user()->jwt]);
});

Route::post('resetPassword', function(Request $request) {
    if($request->type) {
        if($request->type === 'validateToken') return PasswordReset::where('user', $request->user)->where('token', $request->token)->first() ? success() : reject(2, 'Invalid token');
        if($request->type === 'reset') {
            $user = User::where('_id', $request->user)->first();
            if(!$user || PasswordReset::where('user', $request->user)->where('token', $request->token)->first() == null) return reject(3, 'Invalid token');

            PasswordReset::where('user', $request->user)->where('token', $request->token)->delete();

            $user->update(['password' => Hash::make($request->password)]);
            return success();
        }

        return reject(1, 'Invalid type');
    }

    $user = User::where('email', $request->login)->orWhere('name', $request->login)->first();
    if(!$user) return success();

    $token = ProvablyFair::generateServerSeed();

    PasswordReset::create([
        'user' => $user->_id,
        'token' => $token
    ]);

    Mail::to($user)->send(new ResetPassword($user->_id, $token));

    return success();
});

Route::post('/login', function(Request $request) {
	$validate = Validator::make($request->all(), [
		'captcha' => 'required|captcha'
	]); 
    $request->validate([
        'name' => ['required', 'string', 'max:17'],
        'password' => ['required', 'string', 'min:5']
    ]);
	if($validate->fails()) return reject(4, 'Please verify that you are not a robot');

    $attempt = auth()->attempt(['name' => $request->name, 'password' => $request->password]);
    if($attempt) User::where('name', $request->name)->update([
        'login_ip' => User::getIp(),
        'login_multiaccount_hash' => request()->hasCookie('s') ? request()->cookie('s') : null,
        'tfa_persistent_key' => null,
        'tfa_onetime_key' => null,
        'jwt' => JWTAuth::fromUser(auth()->user())
    ]);
    return $attempt ? success() : reject(1, 'Wrong credentials');
});

Route::post('/register', function(Request $request) {
	$validate = Validator::make($request->all(), [
		'captcha' => 'required|captcha'
	]); 
    $request->validate([
        'name' => ['required', 'unique:users', 'string', 'max:17'],
        'password' => ['required', 'string', 'min:5']
    ]);
	if($validate->fails()) return reject(4, 'Please verify that you are not a robot');

    createUser($request->name, $request->password);
    return success();
});

$redirect_uri = url('/');
Route::get('/vk', function(Request $request) use ($redirect_uri) {
    $client_id = \App\Settings::where('name', 'vk_client_id')->first()->value;
    $client_secret = \App\Settings::where('name', 'vk_client_secret')->first()->value;

    if(!is_null($request->code)) {
        $obj = json_decode(curl('https://oauth.vk.com/access_token?client_id=' . $client_id . '&client_secret=' . $client_secret . '&redirect_uri=' . $redirect_uri . '/auth/vk&code=' . $request->code));

        if(isset($obj->access_token)) {
            $info = json_decode(curl('https://api.vk.com/method/users.get?fields=photo_200&access_token=' . $obj->access_token . '&v=5.103'), true);

            if(auth()->guest()) {
                $photo = array_key_exists('photo_200', $info['response'][0]) ? $info['response'][0]['photo_200'] : null;
                $user = User::where('vk', $info['response'][0]['id'])->first();
                if (is_null($user)) createUser($info['response'][0]['first_name'] . ' ' . $info['response'][0]['last_name'], null, $photo, ['vk' => $info['response'][0]['id']]);
                else {
                    $user->update([
                        'login_ip' => User::getIp(),
                        'login_multiaccount_hash' => request()->hasCookie('s') ? request()->cookie('s') : null,
                        'tfa_persistent_key' => null,
                        'tfa_onetime_key' => null,
                        'jwt' => JWTAuth::fromUser(auth()->user())
                    ]);
                    auth()->login($user, true);
                }
                return redirect('/');
            } else {
                $id = $info['response'][0]['id'];
                if(User::where('vk', $id)->first() != null) return __('general.profile.somebody_already_linked');
                auth()->user()->update([
                    'vk' => $id
                ]);
                return redirect('/user/'.auth()->user()->_id.'#settings');
            }
        }
        return redirect('/');
    } else return response()->redirectTo('https://oauth.vk.com/authorize?client_id=' . $client_id . '&display=page&redirect_uri=' . $redirect_uri . '/auth/vk&scope=photos&response_type=code&v=5.53');
});

Route::middleware('auth')->post('discord_bonus', function() {
    $r = apiRequest('https://discord.com/api/guilds/'.\App\Settings::where('name', 'discord_server_id')->first()->value.'/members/'.auth()->user()->discord,
        \App\Settings::where('name', 'discord_bot_token')->first()->value, 'Bot');

    if(($r->message ?? null) != null) return reject(1);
    if(auth()->user()->discord_bonus) return reject(2);
    auth()->user()->update([
        'discord_bonus' => true
    ]);
    //auth()->user()->balance(auth()->user()->clientCurrency())->add(floatval(auth()->user()->clientCurrency()->option('discord')));
    return success();
});

Route::middleware('auth')->post('/discord_role', function() {
    if(auth()->user()->vipLevel() < 1) return reject(1, 'Hacking attempt');
    $r = apiRequest('https://discord.com/api/guilds/'.\App\Settings::where('name', 'discord_server_id')->first()->value.'/members/'.auth()->user()->discord.'/roles/'.\App\Settings::where('name', 'discord_vip_role_id')->first()->value,
        \App\Settings::where('name', 'discord_bot_token')->first()->value, 'Bot', 'PUT');
    return success((array) $r);
});

Route::get('/discord', function(Request $request) use($redirect_uri) {
    $client_id = \App\Settings::where('name', 'discord_client_id')->first()->value;
    $client_secret = \App\Settings::where('name', 'discord_client_secret')->first()->value;

    if(!is_null($request->code)) {
         $url = 'https://discord.com/api/v6/oauth2/token';
         $params = [
             'client_id' => $client_id,
             'client_secret' => $client_secret,
             'grant_type' => 'authorization_code',
             'code' => $request->code,
             'scope' => 'identify',
             'redirect_uri' => "$redirect_uri/auth/discord"
         ];

         $obj = json_decode(curl($url, $params));
         if(isset($obj->access_token)) {
             $info = apiRequest('https://discord.com/api/users/@me', $obj->access_token);

             if(auth()->guest()) {
                 $user = User::where('discord', $info->id)->first();
                 if (is_null($user)) createUser($info->username, null, null, ['discord' => $info->id]);
                 else {
                     $user->update([
                         'login_ip' => User::getIp(),
                         'login_multiaccount_hash' => request()->hasCookie('s') ? request()->cookie('s') : null,
                         'tfa_persistent_key' => null,
                         'tfa_onetime_key' => null,
                         'jwt' => JWTAuth::fromUser(auth()->user())
                     ]);
                     auth()->login($user, true);
                 }
                 return redirect('/');
             } else {
                 if(User::where('discord', $info->id)->first() != null) return __('general.profile.somebody_already_linked');
                 auth()->user()->update([
                     'discord' => $info->id
                 ]);
                 return redirect('/user/'.auth()->user()->_id.'#settings');
             }
         } else return json_encode(['error' => 'access_token is not granted']);
    } else return response()->redirectTo("https://discord.com/api/oauth2/authorize?client_id=$client_id&redirect_uri=$redirect_uri/auth/discord&response_type=code&scope=identify");
});

Route::get('/fb', function(Request $request) use($redirect_uri) {
    $client_id = \App\Settings::where('name', 'fb_client_id')->first()->value;
    $client_secret = \App\Settings::where('name', 'fb_client_secret')->first()->value;

    if(!is_null($request->code)) {
        $url = 'https://graph.facebook.com/v3.2/oauth/access_token';
        $params = [
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'redirect_uri' => $redirect_uri.'/auth/fb',
            'code' => $request->code,
            'scope' => 'email'
        ];

        $obj = json_decode(file_get_contents($url.'?'.urldecode(http_build_query($params))));
        if (isset($obj->access_token)) {
            $userInfo = json_decode(file_get_contents('https://graph.facebook.com/v3.2/me?fields=id,name,email&access_token='.$obj->access_token), true);

            if(isset($userInfo['id'])) {
                $user_id = $userInfo['id'];

                if(auth()->guest()) {
                    $user = User::where('fb', $user_id)->first();
                    if (is_null($user)) createUser($userInfo['name'], null, $userInfo['picture'] ?? null, ['fb' => $user_id]);
                    else {
                        $user->update([
                            'login_ip' => User::getIp(),
                            'login_multiaccount_hash' => request()->hasCookie('s') ? request()->cookie('s') : null,
                            'tfa_persistent_key' => null,
                            'tfa_onetime_key' => null,
                            'jwt' => JWTAuth::fromUser(auth()->user())
                        ]);
                        auth()->login($user, true);
                    }
                    return redirect('/');
                } else {
                    if(User::where('fb', $user_id)->first() != null) return __('general.profile.somebody_already_linked');
                    auth()->user()->update([
                        'fb' => $user_id
                    ]);
                    return redirect('/user/'.auth()->user()->_id.'#settings');
                }
            } else return json_encode(['error' => 'user id is not granted']);
        } else return json_encode(['error' => 'access_token is not granted']);
    } else return response()->redirectTo('https://www.facebook.com/v3.2/dialog/oauth?'.urldecode(http_build_query([
        'client_id' => $client_id,
        'redirect_uri' => $redirect_uri . '/auth/fb',
        'response_type' => 'code',
        'state' => '{st=xbnf52l,ds=731562}',
        'scope' => 'email'
    ])));
});

Route::get('/google', function(Request $request) use($redirect_uri) {
    $client_id = \App\Settings::where('name', 'google_client_id')->first()->value;
    $client_secret = \App\Settings::where('name', 'google_client_secret')->first()->value;

    if(!is_null($request->code)) {
        $url = 'https://accounts.google.com/o/oauth2/token';
        $params = array(
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'redirect_uri' => 'https://bitsarcade.com/auth/google',
            'grant_type' => 'authorization_code',
            'code' => $request->code
        );

        $obj = json_decode(curl($url, $params));
        if (isset($obj->access_token)) {
            $params['access_token'] = $obj->access_token;
            $userInfo = json_decode(file_get_contents('https://www.googleapis.com/oauth2/v1/userinfo' . '?' . urldecode(http_build_query($params))), true);

            if(isset($userInfo['id'])) {
                $user_id = $userInfo['id'];

                if(auth()->guest()) {
                    $user = User::where('google', $user_id)->first();
                    if (is_null($user)) createUser($userInfo['name'], null, $userInfo['avatar'] ?? null, ['google' => $user_id]);
                    else {
                        $user->update([
                            'login_ip' => User::getIp(),
                            'login_multiaccount_hash' => request()->hasCookie('s') ? request()->cookie('s') : null,
                            'tfa_persistent_key' => null,
                            'tfa_onetime_key' => null,
                            'jwt' => JWTAuth::fromUser(auth()->user())
                        ]);
                        auth()->login($user, true);
                    }
                } else {
                    if(User::where('google', $user_id)->first() != null) return __('general.profile.somebody_already_linked');
                    auth()->user()->update([
                        'google' => $user_id
                    ]);
                    return redirect('/user/'.auth()->user()->_id.'#settings');
                }
                return redirect('/');
            } else return json_encode(['error' => 'user id is not granted']);
        } else return json_encode(['error' => 'access_token is not granted']);
    } else return response()->redirectTo('https://accounts.google.com/o/oauth2/auth?'.urldecode(http_build_query([
            'redirect_uri' => 'https://bitsarcade.com/auth/google',
            'response_type' => 'code',
            'client_id' => $client_id,
            'scope' => 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        ])));
});

Route::get('/logout', function() {
    auth()->logout();
    return success();
});

function curl($url, $params = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    if($params != null) curl_setopt($ch, CURLOPT_POSTFIELDS, urldecode(http_build_query($params)));
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

function apiRequest($url, $access_token, $auth = 'Bearer', $post = false, $headers = []) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    if($post === 'PUT') curl_setopt($ch, CURLOPT_PUT, true);
    else if($post) curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));

    $headers[] = 'Accept: application/json';

    $headers[] = 'Authorization: '.$auth.' ' . $access_token;

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    return json_decode($response);
}
