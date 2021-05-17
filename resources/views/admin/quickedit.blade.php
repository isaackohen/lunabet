@php $user = \App\User::where('_id', $data)->first(); @endphp
<script>window._id = '{{ $user->_id }}';</script>

<div class="container-fluid">
    <div class="row page-title">
        <div class="col-md-12">
            <h4 class="mb-1 mt-0">{{ $user->name }}</h4>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-3">
            <div class="card">
                <div class="card-body">
                    <div class="text-center mt-3">
                        <img src="{{ $user->avatar }}" alt="" class="avatar-lg rounded-circle">
                        <h5 class="mt-2 mb-0">{{ $user->name }}</h5>
                        @if(count($user->name_history) > 1)
                            <h6 class="font-weight-normal mt-2 mb-0">Also known as:</h6>
                            @foreach($user->name_history as $history)
                                {!! "<h6 class=\"text-muted font-weight-normal\">".\Carbon\Carbon::parse($history['time'])->diffForHumans().' - '.$history['name'].'</h6>' !!}
                            @endforeach
                        @endif

                        <button type="button" class="btn {{ $user->ban ? 'btn-primary' : 'btn-danger' }} btn-sm mr-1 mt-1" onclick="$.request('/admin/ban', { id: '{{ $data }}' }).then(() => { redirect(window.location.pathname) });">
                            {{ $user->ban ? 'Unban' : 'Ban' }}
                        </button>
                    </div>
                    <div class="mt-3 pt-2 border-top">
                        <h4 class="mb-3 font-size-15">Info</h4>
                        <div class="table-responsive">
                            <table class="table table-borderless mb-0 text-muted">
                                <tbody>
                                    <tr>
                                        <th scope="row">Games</th>
                                        <td>{{ \App\Game::where('user', $user->_id)->where('demo', '!=', true)->where('status', '!=', 'in-progress')->where('status', '!=', 'cancelled')->count() }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Register IP</th>
                                        <td>{{ $user->register_ip }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Latest login IP</th>
                                        <td>{{ $user->login_ip }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Created at</th>
                                        <th>{{ $user->created_at }}</th>
                                    </tr>
                                    <tr>
                                        <th scope="row">Last activity</th>
                                        <th>{{ \Carbon\Carbon::parse($user->latest_activity)->diffForHumans() }}</th>
                                    </tr>
                                    <tr>
                                        <th scope="row">Referrer</th>
                                        <th>{!! $user->referral == null ? '-' : '<a href="/admin/user/'.$user->referral.'">'.\App\User::where('_id', $user->referral)->first()->name.'</a>' !!}</th>
                                    </tr>
                                    <tr>
                                        <th scope="row">2FA status</th>
                                        <th>{{ ($user->tfa_enabled ?? false) ? 'Enabled' : 'Disabled' }}</th>
                                    </tr>
                                    <tr>
                                        <th scope="row">Free games</th>
                                        <th><input data-freegames="{{ $user->id }}" class="form-control form-control-sm" value="{{ $user->freegames }}"></th>
                                    </tr>
                                    <tr>
                                        <th scope="row">Access Level</th>
                                        <th>
                                            <select id="access">
                                                <option value="user" @if($user->access === 'user') selected @endif>User</option>
                                                <option value="moderator" @if($user->access === 'moderator') selected @endif>Moderator</option>
                                                <option value="admin" @if($user->access === 'admin') selected @endif>Administrator</option>
                                            </select>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th scope="row">Accounts</th>
                                        <th>
                                            @php
                                                $same_register_hash = \App\User::where('register_multiaccount_hash', $user->register_multiaccount_hash)->get();
                                                $same_login_hash = \App\User::where('login_multiaccount_hash', $user->login_multiaccount_hash)->get();
                                                $same_register_ip = \App\User::where('register_ip', $user->register_ip)->get();
                                                $same_login_ip = \App\User::where('login_ip', $user->login_ip)->get();

                                                $printAccounts = function($array) {
                                                    foreach($array as $value) echo '<div><a href="/admin/user/'.$value->_id.'">'.$value->name.'</a></div>';
                                                }
                                            @endphp

                                            @if($user->register_multiaccount_hash == null || $user->login_multiaccount_hash == null)
                                                @if($user->register_multiaccount_hash == null) <div class="text-danger">Cleared cookie before registration</div> @endif
                                                @if($user->login_multiaccount_hash == null) <div class="text-danger">Cleared cookie before authorization</div> @endif
                                            @else
                                                @if(count($same_register_hash) > 1)
                                                    <div class="text-danger">Same registration hash:</div>
                                                    @php $printAccounts($same_register_hash) @endphp
                                                @endif
                                                @if(count($same_login_hash) > 1)
                                                    <div class="text-danger">Same auth hash:</div>
                                                    @php $printAccounts($same_login_hash) @endphp
                                                @endif
                                                @if(count($same_register_ip) > 1)
                                                    <div class="text-danger">Same register IP:</div>
                                                    @php $printAccounts($same_register_ip) @endphp
                                                @endif
                                                @if(count($same_login_ip) > 1)
                                                    <div class="text-danger">Same auth IP:</div>
                                                    @php $printAccounts($same_login_ip) @endphp
                                                @endif
                                                @if(count($same_register_hash) <= 1 && count($same_login_hash) <= 1 && count($same_register_ip) <= 1 && count($same_login_ip) <= 1)
                                                    <div class="text-success">Good standing</div>
                                                @endif
                                            @endif
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-9">
            <div class="card">
                <div class="card-body">
                    <table class="table dt-responsive nowrap">
                        <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Games</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Wagered</th>
                            <th>Deposited</th>
                            <th>Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
							@php
							$statistics = \App\Statistics::where('_id', $user->_id)->first();	
							@endphp
                        @if($statistics == null)
                            @foreach(\App\Currency\Currency::all() as $currency)
                                <td>{{ $currency->name() }}</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td><input data-currency-balance="{{ $currency->id() }}" class="form-control form-control-sm" placeholder="{{ $currency->name() }} balance" value="{{ number_format($user->balance($currency)->get(), 8, '.', '') }}"></td>
                            </tr>
                                                        @endforeach
                         @else
                            <td>Total</td>
                            <td>{{ $statistics->bets_btc + $statistics->bets_eth + $statistics->bets_ltc + $statistics->bets_doge + $statistics->bets_bch + $statistics->bets_trx }}</td>
                            <td>{{ $statistics->wins_btc + $statistics->wins_eth + $statistics->wins_ltc + $statistics->wins_doge + $statistics->wins_bch + $statistics->wins_trx }}</td>
                            <td>{{ $statistics->loss_btc + $statistics->loss_eth + $statistics->loss_ltc + $statistics->loss_doge + $statistics->loss_bch + $statistics->loss_trx }}</td>
                        </tr>
                        @foreach(\App\Currency\Currency::all() as $currency)
                            <tr>
							@php
											if($currency->name() == 'BTC'){
												$bets = $statistics->bets_btc;
												$wins = $statistics->wins_btc;
												$loss = $statistics->loss_btc;
												$wagered = $statistics->wagered_btc;
												$profit = $statistics->profit_btc;
											}
											if($currency->name() == 'ETH'){
												$bets = $statistics->bets_eth;
												$wins = $statistics->wins_eth;
												$loss = $statistics->loss_eth;
												$wagered = $statistics->wagered_eth;
												$profit = $statistics->profit_eth;
											}
											if($currency->name() == 'LTC'){
												$bets = $statistics->bets_ltc;
												$wins = $statistics->wins_ltc;
												$loss = $statistics->loss_ltc;
												$wagered = $statistics->wagered_ltc;
												$profit = $statistics->profit_ltc;
											}
											if($currency->name() == 'DOGE'){
												$bets = $statistics->bets_doge;
												$wins = $statistics->wins_doge;
												$loss = $statistics->loss_doge;
												$wagered = $statistics->wagered_doge;
												$profit = $statistics->profit_doge;
											}
											if($currency->name() == 'BCH'){
												$bets = $statistics->bets_bch;
												$wins = $statistics->wins_bch;
												$loss = $statistics->loss_bch;
												$wagered = $statistics->wagered_bch;
												$profit = $statistics->profit_bch;
											}
											if($currency->name() == 'TRX'){
												$bets = $statistics->bets_trx;
												$wins = $statistics->wins_trx;
												$loss = $statistics->loss_trx;
												$wagered = $statistics->wagered_trx;
												$profit = $statistics->profit_trx;
											}
							@endphp
                                <td>{{ $currency->name() }}</td>
                                <td>{{ $bets }}</td>
                                <td>{{ $wins }}</td>
                                <td>{{ $loss }}</td>
                                <td>{{ number_format(floatval($wagered), 8, '.', '') }} {{ $currency->name() }}</td>
                                <td>{{ number_format(\App\Invoice::where('user', $user->_id)->where('currency', $currency->id())->sum('wager'), 8, '.', '') }} {{ $currency->name() }}</td>
                                <td><input data-currency-balance="{{ $currency->id() }}" class="form-control form-control-sm" placeholder="{{ $currency->name() }} balance" value="{{ number_format($user->balance($currency)->get(), 8, '.', '') }}"></td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                    @endif
                    <hr>

                    <div class="alert alert-danger mb-4 p-4 text-center" role="alert">Only last 50 transactions and no games are shown as you are on Quick View. Go to <a style="color: blue; cursor: pointer;" onclick="redirect('/admin/user/{{ $user->_id }}')">Full View</a> for full transactions/games.</div>


                    <table id="transactions" class="table dt-responsive nowrap">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th style="width: 80%">Transaction</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach(\App\Transaction::where('user', $user->_id)->where('demo', '!=', true)->limit(50)->get() as $transaction)
                            <tr>
                                <td>{{ $transaction->created_at->format('d.m.Y H:i:s') }}</td>
                                <td style="width: 80%">
                                    <div>Message: {{ $transaction->data['message'] ?? '-' }}</div>
                                    <div>Game: {{ $transaction->data['game'] ?? '-' }}</div>
                                    <div>
                                        Amount: {{ number_format($transaction->amount, 8, '.', '') }} {{ \App\Currency\Currency::find($transaction->currency)->name() }}
                                        (Before: {{ number_format($transaction->old, 8, '.', '') }}, Now: {{ number_format($transaction->new, 8, '.', '') }})
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                        </tbody>

                    </table>

                </div>
                                    <div class="alert alert-danger mb-4 p-4 text-center" role="alert">Only last 50 transactions and no games are shown as you are on Quick View. Go to <a style="color: blue; cursor: pointer;" onclick="redirect('/admin/user/{{ $user->_id }}')">Full View</a> for full transactions/games.</div>
            </div>
        </div>
    </div>
</div>
