<!DOCTYPE html>
<html lang="en" class="theme--default">
    <head>
        <title>{{ \App\Settings::where('name', 'platform_name')->first()->value }}</title>
<link href="//cloud.typenetwork.com/projects/5676/fontface.css/" rel="stylesheet" type="text/css">
        <link rel="icon" type="image/png" href="/img/logo/ico.png"/>
        <meta charset="utf-8">
        
        <noscript><meta http-equiv="refresh" content="0; /no_js"></noscript>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="{{ \App\Settings::where('name', 'platform_description')->first()->value }}">
        <meta property="og:description" content="{{ \App\Settings::where('name', 'platform_description')->first()->value }}" />
        <meta property="og:image" content="{{ asset('/img/logo/thumb.png') }}" />
        <meta property="og:image:secure_url" content="{{ asset('/img/logo/thumb.png') }}" />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:image:width" content="295" />
        <meta property="og:image:height" content="295" />
        <meta property="og:site_name" content="{{ \App\Settings::where('name', 'platform_name')->first()->value }}" />
        @if(env('APP_DEBUG'))
        <meta http-equiv="Expires" content="Mon, 26 Jul 1997 05:00:00 GMT">
        <meta http-equiv="Pragma" content="no-cache">
        @endif
        <link rel="preload" href="{{ mix('/js/app.js') }}" as="script">
        <link rel="preload" href="{{ mix('/css/app.css') }}" as="style">
        <link rel="preload" href="{{ mix('/css/loader.css') }}" as="style">
        <link rel="preload" href="{{ $hash('/fonts/fa-duotone-900.woff2') }}" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="{{ $hash('/fonts/fa-solid-900.woff2') }}" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="{{ $hash('/fonts/fa-regular-400.woff2') }}" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="{{ $hash('/fonts/fa-light-300.woff2') }}" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="{{ $hash('/fonts/fa-brands-400.woff2') }}" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="stylesheet" href="{{ mix('/css/loader.css') }}">
        <link rel="stylesheet" href="{{ mix('/css/app.css') }}">

        <link rel="manifest" href="/manifest.json">
        <script src="{{ mix('/js/bootstrap.js') }}" type="text/javascript" defer></script>
        <script>
        window._locale = '{{ app()->getLocale() }}';
        window._translations = {!! cache('translations') !!};
        window._mixManifest = {!! file_get_contents(public_path('mix-manifest.json')) !!}
        @php
        $currency = [];
        foreach(\App\Currency\Currency::all() as $c) $currency = array_merge($currency, [
        $c->id() => [
        'id' => $c->id(),
        'name' => $c->name(),
        'icon' => $c->icon(),
        'style' => $c->style(),
        'requiredConfirmations' => intval($c->option('confirmations')),
        'withdrawFee' => floatval($c->option('fee')),
        'minimalWithdraw' => floatval($c->option('withdraw')),
        'bonusWheel' => floatval($c->option('bonus_wheel')),
        'referralBonusWheel' => floatval($c->option('referral_bonus_wheel')),
        'investMin' => floatval($c->option('min_invest')),
        'highRollerRequirement' => floatval($c->option('high_roller_requirement')),
        'min_bet' => $c->option('min_bet'),
        'max_bet' => $c->option('max_bet')
        ]
        ]);
        @endphp
        window.Laravel = {!! json_encode([
        'csrfToken' => csrf_token(),
        'userId' => auth()->guest() ? null : auth()->user()->id,
        'userName' => auth()->guest() ? null : auth()->user()->name,
        'vapidPublicKey' => config('webpush.vapid.public_key'),
        'access' => auth()->guest() ? 'user' : auth()->user()->access,
        'currency' => $currency]) !!};
        window.currencies = {!! json_encode([
        'btc' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarBtc(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarBtcEur()],
        'bch' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarBtcCash(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarBtcCashEur()],
        'eth' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarEth(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarEthEur()],
        'xmr' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarXmr(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarXmrEur()],
        'ltc' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarLtc(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarLtcEur()],
        'iota' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarIota(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarIotaEur()],
        'doge' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarDoge(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarDogeEur()],
        'trx' => ['dollar' => \App\Http\Controllers\Api\WalletController::rateDollarTron(), 'euro' => \App\Http\Controllers\Api\WalletController::rateDollarTronEur()]
        ]) !!};
        </script>
        {!! NoCaptcha::renderJs() !!}
    </head>
    <body>

        <div class="pageLoader">
            <img style="position: absolute; top: 0; bottom: 0; margin: auto; left: 0; right: 0;" src="/img/misc/moonloader.gif">
           <!-- <div class="loader">
                <div></div>
            </div> !-->
            <div class="error" style="display: none"></div>
        </div>

    
    <div class="wrapper">

<nav class="navbar navbar-expand-lg sticky-top navbar-light">
  <!-- Container wrapper -->
  <div class="container-lg">

    <div class="navbar-collapse" id="navbarSupportedContent">
      <!-- Navbar brand -->
      <a class="navbar-brand mt-2 mt-lg-0"           onclick="redirect('/')">
        <img
        class="d-none d-sm-block"
          src="/img/logo/lunabet_light_small.svg"
          height="45"
          alt=""
          loading="lazy"
        />
      </a>
                            @if(!auth()->guest())

                <div class="wallet">
                    <div class="wallet-switcher">
                        @foreach(\App\Currency\Currency::all() as $currency)
                        <div class="option" data-set-currency="{{ $currency->id() }}">
                            <div class="wallet-switcher-icon">
                                <i class="{{ $currency->icon() }}" style="color: {{ $currency->style() }}"></i>
                            </div>
                            <div class="wallet-switcher-content">
                                <div data-currency-value="{{ $currency->id() }}">{{ number_format(auth()->user()->balance($currency)->get(), 8, '.', '') }}</div>
                                <div data-demo-currency-value="{{ $currency->id() }}">{{ number_format(auth()->user()->balance($currency)->demo()->get(), 8, '.', '') }}</div>
                                <span>
                                    {{ $currency->name() }}
                                </span>
                            </div>
                        </div>
                        @endforeach
                        <div class="option select-option">
                            <div class="wallet-switcher-icon">
                                <i class="fas fa-btc-icon"></i>
                            </div>
                            <div class="wallet-switcher-content">
                                {{ __('general.unit') }}:
                                <select id="unitChanger">
                                    <option value="disabled" {{ ($_COOKIE['unit'] ?? 'none') == 'disabled' ? 'selected' : '' }}>Disabled</option>
                                    <option value="usd" {{ ($_COOKIE['unit'] ?? 'usd') == 'usd' ? 'selected' : '' }}>USD</option>
                                    <option value="euro" {{ ($_COOKIE['unit'] ?? 'euro') == 'euro' ? 'selected' : '' }}>EURO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="icon">
                        <i data-selected-currency></i>
                        <i class="fal fa-angle-down"></i>
                    </div> 
                    <div class="balance"></div>
                    <div class="btn btn-primary btn-nocapitalize btn-rounded wallet-open p-1" style="z-index: 5;margin-top: 1px; margin-bottom: 1px; font-size: 13px; text-shadow: 0.9px 0.9px #363d42; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></div>
                </div>
                    @endif

      <!-- Left links 
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#">Games</a>
        </li>
      </ul>
       -->
    </div>

    <div class="d-flex align-items-center">

                            @if(auth()->guest())

                    <button class="btn btn-primary m-1" onclick="$.register()">{{ __('general.auth.register') }}</button>
                    <button class="btn btn-secondary m-1" onclick="$.auth()">{{ __('general.auth.login') }}</button>
                    @else

                    <div style="color: #5f3fd0; cursor: pointer; margin-right: 10px;" class="action" onclick="$.displaySearchBar()"><i class="fas fa-search"></i></div>
                    <div class="action" style="margin-right: 10px; cursor: pointer; font-size: 17px; color:#5f3fd0;"  onclick="redirect('/user/{{ auth()->user()->_id }}')">
                        <i class="fad fa-user-circle"></i>
                    </div>
                    <div class="action" style="color: #5f3fd0; cursor: pointer;" data-notification-view onclick="$.displayNotifications()">
                        <i class="fas fa-bell"></i>
                    </div>

    </div>
                    @endif

  </div>
</nav>

        <div class="pageContent" style="opacity: 0;">
            {!! $page !!}
        </div>
        
        <div class="container-lg">

   <div class="sidebar small">
        <div class="sidebar__head"><a class="sidebar__logo" href="/"><img class="sidebar__pic sidebar__pic_light" src="/img/logo/logo_light_menu.png" height="50px" alt="" /></a>
            <div class="sidebar__toggle" style="cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path opacity=".701" d="M22 12H3" stroke="#6242d1"></path>
              <g opacity=".501" stroke="#6242d1">
                <path d="M22 4H13"></path>
                <path opacity=".501" d="M22 20H13"></path>
              </g>
              <path d="M7 7l-5 5 5 5" stroke="#6242d1"></path>
            </svg></div></div>

        <div class="sidebar__body">
          <nav class="sidebar__nav">
            <a class="sidebar__item" data-page-trigger="'/'" data-toggle-class="active">
              <div class="sidebar__icon">
                <svg class="icon icon-home">
                  <use xlink:href="/img/sprite.svg#icon-home"></use>
                </svg></div>
                <div class="sidebar__text" href="/" onclick="redirect('/')">Home</div>
            </a>

            <a class="sidebar__item" data-page-trigger="'/gamelist'" data-toggle-class="active">
              <div class="sidebar__icon">
                <svg class="icon icon-link">
                  <use xlink:href="/img/sprite.svg#icon-link"></use>
                </svg>
            </div>
              <div class="sidebar__text" href="/gamelist/" onclick="redirect('/gamelist')">Games</div>
            </a>

            <a class="sidebar__item">
              <div class="sidebar__icon"><svg class="icon icon-ranking">
                  <use xlink:href="/img/sprite.svg#icon-ranking"></use>
                </svg></div>
              <div class="sidebar__text" onclick="$.races()">Contests</div>
            </a>
            <a class="sidebar__item" data-page-trigger="'/bonus'" data-toggle-class="active">
              <div class="sidebar__icon"><svg class="icon icon-discount">
                  <use xlink:href="/img/sprite.svg#icon-discount"></use>
                </svg></div>
              <div class="sidebar__text" href="/bonus" onclick="redirect('/bonus')">Your Bonus</div>
            </a>
            <a class="sidebar__item" data-page-trigger="'/earn'" data-toggle-class="active">
              <div class="sidebar__icon"><svg class="icon icon-document">
                  <use xlink:href="/img/sprite.svg#icon-document"></use>
                </svg></div>
              <div class="sidebar__text" href="/earn" onclick="redirect('/earn')">Earn</div>
            </a>
            <a class="sidebar__item" data-page-trigger="'/help'" data-toggle-class="active">
              <div class="sidebar__icon"><svg class="icon icon-notification">
                  <use xlink:href="/img/sprite.svg#icon-notification"></use>
                </svg></div>
              <div class="sidebar__text" href="/help" onclick="redirect('/help')">Help</div>

            </a>

            <a class="sidebar__item">
              <div class="sidebar__icon"><svg class="icon icon-search">
                  <use xlink:href="/img/sprite.svg#icon-search"></use>
                </svg></div>
              <div class="sidebar__text" onclick="$.displaySearchBar()">Search Games</div>
            </a>
        </nav>

        </div>

      </div>
  </div>
<div class="pageContentbottom">
            <div class="container-lg">

                    <div class="live">
                        <div class="header">
                            <span class="liveAnimation">Latest Games</span>
                            <div class="tabs">
                                @if(!auth()->guest()) <div class="tab" data-live-tab="mine">{{ __('general.bets.mine') }}</div> @endif
                                <div class="tab active" id="allBetsTab" data-live-tab="all">{{ __('general.bets.all') }}</div>
                                <div class="tab" data-live-tab="lucky_wins">{{ __('general.bets.lucky_wins') }}</div>
                            </div>
                            <select id="liveTableEntries">
                                <option value="10" {{ ($_COOKIE['show'] ?? 10) == 10 ? 'selected' : '' }}>10</option>
                                <option value="25" {{ ($_COOKIE['show'] ?? 10) == 25 ? 'selected' : '' }}>25</option>
                                <option value="50" {{ ($_COOKIE['show'] ?? 10) == 50 ? 'selected' : '' }}>50</option>
                            </select>
                        </div>
                        <div class="live_table_container"></div>
                    </div>
                </div>
                <footer class="text-center text-white">
                    <div class="container p-4">
                        <section class="mb-4">
                            <a class="btn btn-outline-light btn-floating m-1" href="{{ \App\Settings::where('name', 'discord_invite_link')->first()->value }}" target="_blank" role="button"
                                ><i class="fab fa-discord"></i
                            ></a>
                            <a class="btn btn-outline-light btn-floating m-1" href="{{ \App\Settings::where('name', 'twitter_link')->first()->value }}" target="_blank" role="button"
                                ><i class="fab fa-twitter"></i
                            ></a>
                            <a href="{{ \App\Settings::where('name', 'telegram_link')->first()->value }}" target="_blank" class="btn btn-outline-light btn-floating m-1" role="button"
                                ><i class="fab fa-telegram"></i
                            ></a>
                            <section class="">
                                <form action="">
                                </form>
                            </section>
                            <section class="mb-1">
                                <p>
                                    <span style="color: black;">{{ \App\Settings::where('name', 'platform_footer')->first()->value }}</span>
                                    <br>
                                    <a href="/terms/terms_and_conditions">{{ __('general.footer.terms_and_conditions') }}</a> - <a href="/fairness">{{ __('general.footer.fairness') }}</a>

                                </p>
                            </section>
                        </div>
                        <div class="footer-bottom text-center p-3" style="background-color: rgb(95 63 208);">
        <img src="/img/logo/lunabet_dark_footer.png" alt="" loading="lazy">
                        </div>
                    </footer>
                </div>
            </div>
                <div class="chat">
                    <div class="fixed">
                        <div class="chat-input-hint chatCommands" style="display: none"></div>
                        <div data-user-tag class="chat-input-hint" style="display: none">
                            <div class="hint-content"></div>
                            <div class="hint-footer">
                                {!! __('general.chat_at') !!}
                            </div>
                        </div>
                        <div class="messages"></div>
                        <div class="message-send">
                            @if(auth()->guest())
                            <div class="message-auth-overlay">
                                <button class="btn btn-block btn-secondary" onclick="$.auth()">{{ __('general.auth.login') }}</button>
                            </div>
                            @elseif(auth()->user()->mute != null && !auth()->user()->mute->isPast())
                            <div class="message-auth-overlay" style="opacity: 1 !important; text-align: center; font-size: 0.8em;">
                                {{ __('general.error.muted', [ 'time' => auth()->user()->mute ]) }}
                            </div>
                            @endif
                            <div class="d-flex w-100">
                                <div class="column">
                                    @if(!auth()->guest())
                                    <div class="column-icon" data-notification-view onclick="$.displayNotifications()">
                                        <i class="fas fa-bell"></i>
                                    </div>
                                    @endif
                                    @if(!auth()->guest() && auth()->user()->access == 'admin')
                                    <div class="column-icon" id="chatCommandsToggle">
                                        <i class="fal fa-slash fa-rotate-90"></i>
                                    </div>
                                    @endif
                                    <textarea onkeydown="if(event.keyCode === 13) { $.sendChatMessage('.text-message'); return false; }" class="text-message" placeholder="{{ __('general.chat.enter_message') }}"></textarea>
                                </div>
                                <div class="column">
                                    <div class="column-icon">
                                        @if(!auth()->guest())
                                        <div class="emoji-container">
                                            <div class="content" data-fill-emoji-target></div>
                                            <div class="emoji-footer">
                                                <div class="content">
                                                    <div class="emoji-category" onclick="$.unicodeEmojiInit()">
                                                        <i class="fad fa-smile"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        @endif
                                        <i class="fad fa-smile" id="emoji-container-toggle" onclick="$.unicodeEmojiInit(); $('.emoji-container').toggleClass('active')"></i>
                                    </div>
                                    <div class="column-icon" onclick="$.sendChatMessage('.text-message')" id="sendChatMessage"><i class="fad fa-external-link-square"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="draggableWindow">
                    <div class="head">
                        {{ __('general.profit_monitoring.title') }}
                        <i class="far fa-redo-alt"></i>
                        <i class="fal fa-times"></i>
                    </div>
                    <div class="content">
                        <div class="row">
                            <div class="col-6">
                                {{ __('general.profit_monitoring.wins') }}
                                <span id="wins" class="float-right text-success"></span>
                            </div>
                            <div class="col-6">
                                {{ __('general.profit_monitoring.losses') }}
                                <span id="losses" class="float-right text-danger"></span>
                            </div>
                        </div>
                        <div class="profit-monitor-chart"></div>
                        <div class="row">
                            <div class="col-6">
                                <div>{{ __('general.profit_monitoring.wager') }}</div>
                                <span id="wager"></span>
                            </div>
                            <div class="col-6">
                                <div>{{ __('general.profit_monitoring.profit') }}</div>
                                <span id="profit"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mobile-menu-extended">
                    <div class="control" data-page-trigger="'/help'" data-toggle-class="active" onclick="redirect('/help')">
                        <i class="fas fa-question-circle"></i>
                        <div>{{ __('general.head.help') }}</div>
                    </div>
                    <div class="control" @if(Auth::guest()) onclick="$.auth()" @else data-page-trigger="'/earn'" @endif data-toggle-class="active" onclick="redirect('/earn')">
                        <i class="far fa-money-bill-wave"></i>
                        <div>Earn Wall</div>
                    </div>
                    <div class="control" onclick="$.races()">
                        <i class="fas fa-comet"></i>
                        <div>Races</div>
                    </div>
                    <div class="control" onclick="$.leaderboard()">
                        <i class="fas fa-trophy-alt"></i>
                        <div>Leaderboard</div>
                    </div>
                </div>
                <div class="mobile-menu-games">
                    <div class="mobile-menu-games-container">
                        <div class="game" onclick="redirect('/'); $('.mobile-menu-games').slideToggle('fast'); $('#mobile-games-angle').toggleClass('fa-rotate-180')">
                            <div class="icon">
                                <i class="fas fa-spade"></i>
                            </div>
                            <div class="name">
                                {{ __('general.head.index') }}
                            </div>
                        </div>
                        @foreach(\App\Games\Kernel\Game::list() as $game)
                        @if($game->isDisabled()) @continue @endif
                        <div class="game" onclick="redirect('/game/{{ $game->metadata()->id() }}'); $('.mobile-menu-games').slideToggle('fast'); $('#mobile-games-angle').toggleClass('fa-rotate-180')">
                            <div class="icon">
                                <i class="{{ $game->metadata()->icon() }}"></i>
                            </div>
                            <div class="name">
                                {{ $game->metadata()->name() }}
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                <div class="floatingButtons">
                    <div class="floatingButton" data-chat-toggle>
                    <svg><use href="#chat"></use></svg>
                </div>
            </div>
            <div class="mobile-menu">
                <div class="control" data-page-trigger="'/','/index'" data-toggle-class="active" onclick="$('.mobile-menu-games').slideToggle('fast'); $('#mobile-games-angle').toggleClass('fa-rotate-180')">
                    <i class="fas fa-spade"></i>
                    <div><i class="fal fa-angle-up" style="margin-right: 1px" id="mobile-games-angle"></i> {{ __('general.head.games') }}</div>
                </div>
                <div class="control" onclick="$.swapChat()">
                    <i class="fad fa-comments"></i>
                    <div>{{ __('general.head.chat') }}</div>
                </div>
                <div class="control" data-page-trigger="'/bonus'" data-toggle-class="active" onclick="redirect('/bonus')">
                    <i class="fad fa-coins"></i>
                    <div>{{ __('general.head.bonus_short') }}</div>
                </div>
                <div class="control" onclick="$('.mobile-menu-extended').slideToggle('fast', function() { if($(this).is(':visible')) $(this).css('display', 'flex'); }); $(this).find('svg').toggleClass('fa-rotate-180');">
                    <i class="fal fa-angle-up"></i>
                </div>
            </div>
            <div class="modal-wrapper">
                <div class="modal-overlay"></div>
            </div>
            <div class="notifications">
                <i class="fal fa-times" data-close-notifications></i>
                <div class="title">{{ __('general.notifications.title') }}</div>
                <div class="notifications-content os-host-flexbox"></div>
            </div>
            <div class="notifications-overlay"></div>
            <div class="searchbar">
                <i class="fal fa-times" data-close-searchbar></i>
                <div class="title">{{ __('general.searchbar') }}</div>
                <div class="searchbar-content os-host-flexbox" style="color: white;">
                    <input type="text" id="searchbar" placeholder="Search game or provider..">
                    <div class="our-games" style="background: transparent !important;" id="searchbar_result">
                    </div>
                </div>
            </div>
            <div class="searchbar-overlay"></div>
           @if(!auth()->guest())
<script>
  window.intercomSettings = {
    app_id: "sg6bq218",
    custom_launcher_selector:'#intercomopenlink',
    user_id: <?php echo json_encode(auth()->user()->id) ?>, 
    name: <?php echo json_encode(auth()->user()->name) ?>, 
    email: <?php echo json_encode(auth()->user()->email) ?>,
    register_ip: <?php echo json_encode(auth()->user()->register_ip) ?>,
    login_ip: <?php echo json_encode(auth()->user()->login_ip) ?>,
    accounts_registerip: <?php echo json_encode(\App\User::where('register_ip', auth()->user()->register_ip)->count()) ?>, 
    accounts_loginip: <?php echo json_encode(\App\User::where('login_ip', auth()->user()->login_ip)->count()) ?>, 
    accounts_registerhash: <?php echo json_encode(\App\User::where('register_multiaccount_hash', auth()->user()->register_multiaccount_hash)->count()) ?>, 
    accounts_loginhash: <?php echo json_encode(\App\User::where('login_multiaccount_hash', auth()->user()->login_multiaccount_hash)->count()) ?>, 
    created_at: <?php echo json_encode(auth()->user()->created_at) ?>, 
    vipLevel: <?php echo json_encode(auth()->user()->vipLevel()) ?>, 
    deposits: <?php echo json_encode(\App\Invoice::where('user', auth()->user()->_id)->where('status', 1)->where('ledger', '!=','Offerwall Credit')->count()) ?>,
    freegames: <?php echo json_encode(auth()->user()->freegames) ?>
    };
</script>

<script>
// We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/sg6bq218'
(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/sg6bq218';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>
@endif
        </body>
    </html>