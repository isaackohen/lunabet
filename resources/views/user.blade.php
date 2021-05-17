@php
    $user = \App\User::where('_id', $data)->first();
    if(is_null($user)) {
        header('Location: /404');
        die();
    }

    $isOwner = !auth()->guest() && $user->_id == auth()->user()->id;
@endphp

<div class="container-lg" data-user-profile-id="{{ $user->_id }}">
    <div class="profile-container h-100">
        <div class="row profile_row">
            <div class="profile_column col">
                <div class="profile-sidebar">
                    <div class="avatar">
                        <img alt src="{{ $user->avatar }}">
                    </div>
                    @if(!auth()->guest() && auth()->user()->access !== 'user')
                        @php
                            $name_change_history = '';
                            foreach($user->name_history as $history) {
                                $name_change_history .= '<div>'.\Carbon\Carbon::parse($history['time'])->diffForHumans().' - '.$history['name'].'</div>';
                            }
                        @endphp
                    @endif
                    <div class="name" @if(!auth()->guest() && auth()->user()->access !== 'user') data-toggle="tooltip" data-placement="bottom" data-html="true" title="{!! $name_change_history !!}" style="cursor: help" @endif>
                        {{ $user->name }}
                    </div>
                    <ul class="profile-menu">
                        <li class="active" data-toggle-tab="profile">{{ __('general.head.profile') }}</li>
                        @if($isOwner)
                            <li onclick="$.vip()">
                                {{ __('general.profile.vip') }}
                                <span><i class="fad fa-gem"></i></span>
                            </li>
                            <li onclick="redirect('/partner')">
                                {{ __('general.profile.partner') }}
                            </li>
                            <li data-toggle-tab="security">{{ __('general.profile.security') }}</li>
                            <li data-toggle-tab="settings">{{ __('general.profile.settings') }}</li>
                            <li onclick="$.request('/auth/logout', [], 'get').then(function() { window.location.reload(); });">{{ __('general.head.logout') }}</li>
                        @endif
                    </ul>
                </div>
            </div>
            <div class="content_column col">
                <div class="profile-content">
                    @if((!$isOwner && $user->private_profile == true) && (auth()->guest() || auth()->user()->access != 'admin'))
                        <div class="incognito">
                            <img src="/img/misc/incognito-dark.png" data-incognito-dark>
                            <img src="/img/misc/incognito-default.png" data-incognito-white>
                            <div class="incognito-desc">
                                {{ __('general.profile.incognito') }}
                            </div>
                        </div>
                    @else
                        <div data-tab="profile">
                            @if(\Illuminate\Support\Facades\DB::table('games')->where('user', $user->_id)->where('status', 'win')->where('demo', '!=', true)->first() == null)
                                <div class="incognito">
                                    <i class="fas fa-history"></i>
                                    <div class="incognito-desc">
                                        {{ __('general.profile.empty') }}
                                    </div>
                                </div>
                            @else
                                <div class="cat">
                                    {{ __('general.profile.stats') }}
                                </div>
                                <table class="live-table">
                                    <thead>
                                    <tr>
                                        <th>
                                            {{ __('general.profile.bets') }}
                                        </th>
                                        <th  class="d-none d-md-table-cell">
                                            {{ __('general.profile.wins') }}
                                        </th>
                                        <th  class="d-none d-md-table-cell">
                                            {{ __('general.profile.losses') }}
                                        </th>
                                        <th style="text-align: right">
                                            {{ __('general.profile.wagered') }}
                                        </th>
                                        <th>
                                            {{ __('general.profile.wagered') }} ($)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="live_games">

                                        @foreach(\App\Currency\Currency::all() as $currency)
										@php
										if(\App\Statistics::where('_id', $user->_id)->first() == null) {
											$a = \App\Statistics::create([
											'_id' => $data->user()->_id, 'bets_btc' => 0, 'wins_btc' => 0, 'loss_btc' => 0, 'wagered_btc' => 0, 'profit_btc' => 0, 'bets_eth' => 0, 'wins_eth' => 0, 'loss_eth' => 0, 'wagered_eth' => 0, 'profit_eth' => 0, 'bets_ltc' => 0, 'wins_ltc' => 0, 'loss_ltc' => 0, 'wagered_ltc' => 0, 'profit_ltc' => 0, 'bets_doge' => 0, 'wins_doge' => 0, 'loss_doge' => 0, 'wagered_doge' => 0, 'profit_doge' => 0, 'bets_bch' => 0, 'wins_bch' => 0, 'loss_bch' => 0, 'wagered_bch' => 0, 'profit_bch' => 0, 'bets_trx' => 0, 'wins_trx' => 0, 'loss_trx' => 0, 'wagered_trx' => 0, 'profit_trx' => 0
											]);
										}				
										$statistics = \App\Statistics::where('_id', $user->_id)->first();
											if($currency->name() == 'BTC'){
												$bets = $statistics->bets_btc;
												$wins = $statistics->wins_btc;
												$loss = $statistics->loss_btc;
												$wagered = $statistics->wagered_btc;
                                                $wageredusd = number_format((\App\Http\Controllers\Api\WalletController::rateDollarBtc() * $wagered), 3, '.', '');

												$profit = $statistics->profit_btc;
											}
											if($currency->name() == 'ETH'){
												$bets = $statistics->bets_eth;
												$wins = $statistics->wins_eth;
												$loss = $statistics->loss_eth;
												$wagered = $statistics->wagered_eth;
                                                $wageredusd = number_format((\App\Http\Controllers\Api\WalletController::rateDollarEth() * $wagered), 3, '.', '');
												$profit = $statistics->profit_eth;
											}
											if($currency->name() == 'LTC'){
												$bets = $statistics->bets_ltc;
												$wins = $statistics->wins_ltc;
												$loss = $statistics->loss_ltc;
												$wagered = $statistics->wagered_ltc;
                                                $wageredusd = number_format((\App\Http\Controllers\Api\WalletController::rateDollarLtc() * $wagered), 3, '.', '');
												$profit = $statistics->profit_ltc;
											}
											if($currency->name() == 'DOGE'){
												$bets = $statistics->bets_doge;
												$wins = $statistics->wins_doge;
												$loss = $statistics->loss_doge;
												$wagered = $statistics->wagered_doge;
                                                $wageredusd = number_format((\App\Http\Controllers\Api\WalletController::rateDollarDoge() * $wagered), 3, '.', '');
												$profit = $statistics->profit_doge;
											}
											if($currency->name() == 'BCH'){
												$bets = $statistics->bets_bch;
												$wins = $statistics->wins_bch;
												$loss = $statistics->loss_bch;
												$wagered = $statistics->wagered_bch;
                                                $wageredusd = number_format((\App\Http\Controllers\Api\WalletController::rateDollarBtcCash() * $wagered), 3, '.', '');
												$profit = $statistics->profit_bch;
											}
											if($currency->name() == 'TRX'){
												$bets = $statistics->bets_trx;
												$wins = $statistics->wins_trx;
												$loss = $statistics->loss_trx;
												$wagered = $statistics->wagered_trx;
												$wageredusd = number_format((\App\Http\Controllers\Api\WalletController::rateDollarTron() * $wagered), 3, '.', '');
                                                $profit = $statistics->profit_trx;
											}
										@endphp
                                            <tr>
                                                <th>
                                                    <div>
                                                        <div class="icon d-none d-md-inline-block">
                                                            <i class="{{ $currency->icon() }}" style="color: {{ $currency->style() }}"></i>
                                                        </div>
                                                        <div class="name">
                                                            <div data-highlight>{{ $currency->name() }}</div>
                                                        <small>{{ $bets == null ? 0 : $bets }}</small>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th data-highlight class="d-none d-md-table-cell">
                                                    <div>
                                                        <span>{{ $wins == null ? 0 : $wins }}</span>
                                                    </div>
                                                </th>
                                                <th data-highlight  class="d-none d-md-table-cell">
                                                    <div>
                                                        <span>{{ $loss == null ? 0 : $loss }}</span>
                                                    </div>
                                                </th>
                                                <th data-highlight style="text-align: right">
                                                    <div>
                                                        <span>{{ number_format(floatval($wagered), 8, '.', '') }}</span>
														<i class="{{ $currency->icon() }}" style="color: {{ $currency->style() }}"></i>
                                                    </div>
                                                </th>
                                                <th data-highlight>
                                                    <div>
                                                        <span>{{ number_format(floatval($wageredusd), 0, '.', '') }}</span>
														<i class="fas fa-usd-circle" style="color:#02b320"></i>
                                                    </div>
                                                </th>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                                <div class="cat">
                                    {{ __('general.profile.latest_games') }}
                                </div>
                                <table class="live-table">
                                    <thead>
                                    <tr>
                                        <th>
                                            {{ __('general.bets.game') }}
                                        </th>
                                        <th class="d-none d-md-table-cell">
                                            {{ __('general.bets.bet') }}
                                        </th>
                                        <th class="d-none d-md-table-cell">
                                            {{ __('general.bets.mul') }}
                                        </th>
                                        <th>
                                            {{ __('general.bets.win') }}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="live_games user_games_selector"></tbody>
                                </table>
                            @endif
                        </div>
                    @endif
                    @if($isOwner)
                        <div data-tab="security" style="display: none">
                            <div class="cat">{{ __('general.profile.email') }}</div>
                            <input id="emailUpdate" placeholder="Email" value="{{ auth()->user()->email }}" type="email">
                            <button class="btn btn-sm btn-primary mt-2" data-update-email>{{ __('general.profile.email_update') }}</button>
                            <div class="cat">{{ __('general.profile.2fa') }}</div>
                            <div class="settingsNotify" style="text-align: left">
                                <div class="settingsNotifyLoading" style="display: none">
                                    <div class="loader"><div></div></div>
                                </div>
                                @php
                                    $tfa = auth()->user()->tfa();
                                    $secret = $tfa->createSecret(160);
                                @endphp

                                @if(!(auth()->user()->tfa_enabled ?? false))
                                    {{ __('general.profile.copy_this_to_2fa') }}
                                    <input id="2facode" onclick="this.select()" type="text" style="cursor: pointer !important;" class="mt-1" value="{{ $secret }}" data-toggle="tooltip" data-placement="top" title="{{ __('wallet.copy') }}" readonly>
                                    <div class="mt-2">
                                        <div class="text-center mb-2">{{ __('general.profile.keep_secure') }}</div>
                                        <canvas id="qrcanvas" data-text="{{ $tfa->getQRText('funbits.io', $secret) }}" class="d-flex ml-auto mr-auto">
                                    </div>
                                    <div>{{ __('general.profile.2fa_code') }}</div>
                                    <input type="text" id="2faucode" class="mt-1">
                                    <button id="enable2fa" class="btn btn-primary">{{ __('general.profile.2fa_enable') }}</button>
                                @else
                                    <div class="text-center">{!! __('general.profile.2fa_enabled') !!}</div>
                                    <button id="2fadisable" class="btn btn-primary mt-2 btn-block">{{ __('general.profile.disable_2fa') }}</button>
                                @endif
                            </div>
                        </div>
                        <div data-tab="settings" style="display: none">
                            <div class="avatar-settings">
                                <img alt src="{{ auth()->user()->avatar }}">
                                <input class="d-none" type="file" id="image-input">
                                <button class="btn btn-primary" data-change-avatar>{{ __('general.profile.change_avatar') }}</button>
                            </div>
                            <button class="btn btn-primary mt-3 mb-2" onclick="$.modal('change_name')">{{ __('general.profile.change_name') }}</button>
                            <div class="cat">{{ __('general.profile.social') }}</div>
                            <div class="link-group">
                                {{ __('general.profile.discord') }}
                                <span>
                                    @if($user->discord != null)
                                        <i class="fal fa-check mr-1"></i> {{ __('general.profile.linked') }}
                                    @else
                                        <a href="/auth/discord">{{ __('general.profile.link') }}</a>
                                    @endif
                                </span>
                            </div>
                            <!--
                            @if(auth()->user()->vipLevel() > 0)
                                <div class="settingsNotify mt-2">
                                    @if(auth()->user()->discord == null)
                                        {!! __('general.profile.link_discord') !!}
                                    @else
                                        {!! __('general.profile.discord_vip') !!}
                                        <button data-vip-discord-update class="btn btn-block btn-primary mt-2">{{ __('general.profile.discord_vip_ok') }}</button>
                                    @endif
                                </div>
                            @endif
                            <div class="cat">{{ __('general.profile.privacy') }}</div>
                            <div class="form-check pl-0">
                                <label for="stackedCheck1" class="form-check-label">{{ __('general.profile.set_private_profile') }}</label>
                                <input onchange="$.request('settings', ['privacy_toggle'], 'get')" {{ auth()->user()->private_profile ? 'checked' : '' }} data-on="<i class='fal fa-check'></i>" data-off="<i class='fal fa-times'></i>" id="stackedCheck1" class="form-check-input" type="checkbox" data-toggle="toggle">
                            </div>
                            <div class="form-check pl-0">
                                <label for="stackedCheck2" class="form-check-label">{{ __('general.profile.set_private_bets') }}</label>
                                <input onchange="$.request('settings', ['privacy_bets_toggle'], 'get')" {{ auth()->user()->private_bets ? 'checked' : '' }} data-on="<i class='fal fa-check'></i>" data-off="<i class='fal fa-times'></i>" id="stackedCheck2" class="form-check-input" type="checkbox" data-toggle="toggle">
                            </div>
                            !-->
                            <div class="cat">{{ __('general.profile.fairness') }}</div>
                            <div>{{ __('general.profile.client_seed') }}</div>
                            <a href="javascript:void(0)" onclick="$.modal('change_client_seed')" data-toggle="tooltip" data-placement="bottom" title="{{ __('general.profile.change') }}">{{ auth()->user()->client_seed }}</a>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
