@if(auth()->guest())
    <script type="text/javascript">
        redirect('/');
        $.auth();
    </script>
@elseif(auth()->user())
    <script type="text/javascript">
        redirect('/');
    </script>
@else

<div class="container-fluid">
    <div class="row investRow">
        <div class="col">
            <div class="investSidebar">
                <div class="title">{{ __('invest.sidebar.new_investment') }}</div>
                <select class="currency-selector-withdraw">
                    @foreach(\App\Currency\Currency::all() as $currency)
                        <option value="{{ $currency->id() }}" data-icon="{{ $currency->icon() }}" data-style="{{ $currency->style() }}">
                            {{ number_format(auth()->user()->balance($currency)->get(), 8, '.', '') }}
                        </option>
                    @endforeach
                </select>
                <div class="label" id="investMin">{{ __('invest.sidebar.amount', ['min' => number_format(floatval(auth()->user()->clientCurrency()->option('min_invest')), 8, '.', '')]) }}</div>
                <input id="investamount" placeholder="{{ __('invest.sidebar.amount', ['min' => number_format(floatval(auth()->user()->clientCurrency()->option('min_invest')), 8, '.', '')]) }}" value="0.00000000">
                <button id="investbtn" class="btn btn-primary btn-block mb-2 mt-2">{{ __('invest.sidebar.invest') }}</button>
                <div class="title">{{ __('invest.sidebar.stats') }}</div>
                <div class="stats">
                    <div class="loader"><div></div></div>

                    <div class="stat">
                        {{ __('invest.sidebar.your_bankroll') }}
                        <div data-stat="your_bankroll"></div>
                    </div>
                    <div class="stat">
                        {{ __('invest.sidebar.your_bankroll_percent') }}
                        <div data-stat="your_bankroll_percent"></div>
                    </div>
                    <div class="stat">
                        {{ __('invest.sidebar.your_share') }}
                        <div data-stat="your_share"></div>
                    </div>
                    <div class="stat">
                        {{ __('invest.sidebar.your_investing_profit') }}
                        <div data-stat="investment_profit"></div>
                    </div>
                    <div class="mt-1 mb-1"></div>
                    <div class="stat">
                        {{ __('invest.sidebar.site_bankroll') }}
                        <div data-stat="site_bankroll"></div>
                    </div>
                    <div class="stat">
                        {{ __('invest.sidebar.site_profit') }}
                        <div data-stat="site_profit"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="investInfo">
                <div class="tabs">
                    <div class="tab active" data-invest-tab="info">
                        {{ __('invest.tabs.info') }}
                    </div>
                    <div class="tab" data-invest-tab="history">
                        {{ __('invest.tabs.history') }}
                    </div>
                </div>
                <div data-invest-tab-container="info">
                    <div class="info mt-2">
                        <div class="description">{!! __('invest.description') !!}</div>
                    </div>
                    @for($i = 1; $i <= 5; $i++)
                        <div class="info">
                            <div class="title">{!! __("invest.info.$i.title") !!}</div>
                            <div class="description">{!! __("invest.info.$i.description") !!}</div>
                        </div>
                    @endfor
                </div>
                <div data-invest-tab-container="history" style="display: none">
                    <div class="loader"><div></div></div>

                    <table class="live-table">
                        <thead>
                            <tr>
                                <th>
                                    {{ __('invest.history.amount') }}
                                </th>
                                <th>
                                    {{ __('invest.history.your_share') }}
                                </th>
                                <th>
                                    {{ __('invest.history.profit') }}
                                </th>
                                <th>
                                    {{ __('invest.history.status') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="live_games"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endif