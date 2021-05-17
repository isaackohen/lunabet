@if(isset($data))
<div data-history-tab="payments" data-mdb-perfect-scrollbar="true" class="mt-2">
    @if(\App\Invoice::where('user', auth()->user()->_id)->count() == 0)
    <div class="walletHistoryEmpty">
        <i class="fas fa-waiting"></i>
        <div>{{ __('wallet.history.empty') }}</div>
    </div>
    @else
    <table class="live-table">
        <thead>
            <tr>
                <th>
                    {{ __('wallet.history.name') }}
                </th>
                <th>
                    {{ __('wallet.history.date') }}
                </th>
                <th class="d-none d-md-table-cell">
                    {{ __('wallet.history.sum') }}
                </th>
            </tr>
        </thead>
        <tbody class="live_games">
            @foreach(\App\Invoice::where('user', auth()->user()->_id)->where('sum', '!=', null)->latest()->get() as $invoice)
            <tr>
                <th>
                    <div>
                        <div><i class="{{ \App\Currency\Currency::find($invoice->currency)->icon() }}" style="color: {{ \App\Currency\Currency::find($invoice->currency)->style() }}"></i> -   {{ \App\Currency\Currency::find($invoice->currency)->name() }}</div>
                    </div>
                    <div>
                        <small>{{ $invoice->ledger }}</small>
                    </div>
                </th>
                <th>
                    <div>
                        {{ $invoice->created_at->diffForHumans() }}
                    </div>
                </th>
                <th class="d-none d-md-table-cell">
                    <div>
                        @if($invoice->status == 0)
                        <i class="fal fa-clock"></i>
                        @else
                        {{ $invoice->sum }}
                        @endif
                    </div>
                </th>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
</div>
<div data-history-tab="withdraws" class="mt-2" style="display: none">
    @if(\App\Withdraw::where('user', auth()->user()->_id)->count() == 0)
    <div class="walletHistoryEmpty">
        <i class="fas fa-waiting"></i>
        <div>{{ __('wallet.history.empty') }}</div>
    </div>
    @else
    <table class="live-table">
        <thead>
            <tr>
                <th>
                    {{ __('wallet.history.name') }}
                </th>
                <th class="d-none d-md-table-cell">
                    {{ __('wallet.history.sum') }}
                </th>
                <th>
                    {{ __('wallet.history.date') }}
                </th>
                <th>
                    {{ __('wallet.history.status') }}
                </th>
            </tr>
        </thead>
        <tbody class="live_games">
            @foreach(\App\Withdraw::where('user', auth()->user()->_id)->latest()->get() as $withdraw)
            <tr>
                <th>
                    <div>
                        <div><i class="{{ \App\Currency\Currency::find($withdraw->currency)->icon() }}" style="color: {{ \App\Currency\Currency::find($withdraw->currency)->style() }}"></i> {{ \App\Currency\Currency::find($withdraw->currency)->name() }}</div>
                        <div data-highlight>{{ mb_strimwidth($withdraw->address, 0, 10, '...') }}</div>
                    </div>
                </th>
                <th class="d-none d-md-table-cell">
                    <div>
                        {{ number_format($withdraw->sum, 8, '.', '') }} <i class="{{ \App\Currency\Currency::find($withdraw->currency)->icon() }}"></i>
                    </div>
                </th>
                <th>
                    <div>
                        {{ $withdraw->created_at->diffForHumans() }}
                    </div>
                </th>
                <th>
                    @switch($withdraw->status)
                    @case(0)
                    @case(3)
                    {{ __('wallet.history.withdraw_status.moderation') }}
                    @if($withdraw->status == 0)
                    @if(!$withdraw->auto ?? false)
                    <div data-highlight style="cursor: pointer;" onclick="$.cancelWithdraw('{{ $withdraw->_id }}')">
                        {{ __('wallet.history.cancel') }}
                    </div>
                    @endif
                    @endif
                    @break
                    @case(1)
                    <div class="text-success">{{ __('wallet.history.withdraw_status.accepted') }}</div>
                    @break
                    @case(2)
                    <div class="text-danger">{{ __('wallet.history.withdraw_status.declined') }}</div>
                    <div data-highlight>{{ __('wallet.history.withdraw_status.reason') }} {{ $withdraw->decline_reason }}</div>
                    @break
                    @case(4)
                    {{ __('wallet.history.withdraw_status.cancelled') }}
                    @break
                    @endswitch
                </th>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
</div>
@else
<div
    class="wallet_modal modal fade"
    id="wallet_modal modal"
    tabindex="-1"
    style="display: block; padding-right: 15px;"
    aria-labelledby="wallet_modal"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content" style="min-height: 500px;">
            <div class="modal-header">
                <div class="tabs">
                    <div class="tab active" data-wallet-toggle-tab="deposit">
                        {{ __('wallet.tabs.deposit') }}
                    </div>
                    <div class="tab" data-wallet-toggle-tab="withdraw">
                        {{ __('wallet.tabs.withdraw') }}
                    </div>
                    <div class="tab" data-wallet-toggle-tab="history">
                        {{ __('wallet.tabs.history') }}
                    </div>
                </div>
                <button
                type="button"
                data-mdb-dismiss="wallet_modal modal"
                aria-label="Close"
                class="btn-secondary btn-close"
                ><i class="fas fa-close-symbol"></i></button>
            </div>
            <div class="modal-body">
                <div class="ui-blocker" style="display: none;">
                    <div class="loader"><div></div></div>
                </div>
                <div class="modal-scrollable-content">
                    <div data-wallet-tab-content="deposit">
                        <select id="currency-selector-deposit" style="min-width: 200px;">
                            @foreach(\App\Currency\Currency::all() as $currency)
                            <option value="{{ $currency->id() }}" data-icon="{{ $currency->icon() }}" data-style="{{ $currency->style() }}">
                                {{ $currency->name() }}
                            </option>
                            @endforeach
                        </select>
                        <div class="walletNotification" style="display: none">
                            <div class="icon">
                                <i class="fal fa-exclamation-triangle"></i>
                            </div>
                            <div class="description">{{ __('general.error.offline_node') }}</div>
                        </div>
                        <div class="alert alert-light mb-4 p-2 text-center" role="alert">We accept 0 confirmation deposits and instant auto-withdrawals on <i class="{{ \App\Currency\Currency::find('ltc')->icon() }}" style="color: {{ \App\Currency\Currency::find('ltc')->style() }}"></i> LTC, <i class="{{ \App\Currency\Currency::find('bch')->icon() }}" style="color: {{ \App\Currency\Currency::find('bch')->style() }}"></i> BCH and <i class="{{ \App\Currency\Currency::find('doge')->icon() }}" style="color: {{ \App\Currency\Currency::find('doge')->style() }}"></i> DOGE!</div>
                        <div class="walletMinDeposit" style="display: none">
                            <div class="icon">
                                <i class="fal fa-exclamation-triangle"></i>
                            </div>
                            <div class="description">{{ __('wallet.deposit.minimumdepo') }} <b><span id="minimumdepo"> </span>$</b>.</div>
                        </div>
                        <div id="currency-label"></div>
                        <div>
                            <input onclick="this.select()" style="cursor: pointer !important;" data-mdb-toggle="tooltip" title="{{ __('wallet.copy') }}" type="text" readonly>
                        </div>
                        <div class="btn btn-primary" onclick="getDepositAddress()" id="generatorbutton" style="margin: 0px; padding: 10px; margin-top:10px;margin-bottom:10px;">Generate deposit address</div>
                    </div>
                    <div data-wallet-tab-content="withdraw" style="display: none">
                        <select class="currency-selector-withdraw">
                            @foreach(\App\Currency\Currency::all() as $currency)
                            <option value="{{ $currency->id() }}" data-icon="{{ $currency->icon() }}" data-style="{{ $currency->style() }}">
                                {{ number_format(auth()->user()->balance($currency)->get(), 8, '.', '') }}
                            </option>
                            @endforeach
                        </select>
                        <div id="withdraw-address"></div>
                        <input id="withdraw-address-value" type="text">
                        <div id="withdraw-min"></div>
                        <input id="withdraw-amount-value" type="text">
                        <button class="btn btn-primary" id="withdraw">{{ __('wallet.withdraw.button') }}</button>
                        <div class="alert alert-info mb-1 p-2 text-center" role="alert"> <div id="withdraw-warning" style="color: #22738e !important;"></div></div>
                    </div>
                    <div data-wallet-tab-content="history" style="display: none;">
                        <div class="tabs mt-2">
                            <div class="tab active" data-wallet-history-toggle-tab="payments">
                                {{ __('wallet.tabs.deposits') }}
                            </div>
                            <div class="tab" data-wallet-history-toggle-tab="withdraws">
                                {{ __('wallet.tabs.withdraws') }}
                            </div>
                        </div>
                        <div id="wallet-history-content"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
function getDepositAddress() {
$('#generatorbutton').toggleClass('disabled');
$.request('wallet/getDepositWallet', { currency: $.currency() }).then(function(response) {
if(response.currency !== $.currency()) return;
$(`[data-wallet-tab-content="deposit"] .input-loader .loader`).remove();
$(`[data-wallet-tab-content="deposit"] input`).val(response.wallet);
$(`[data-wallet-tab-content="deposit"] #minimumdepo`).html("");
document.getElementById('minimumdepo').innerHTML += response.mindeposit;
$(`[data-wallet-tab-content="deposit"] .walletMinDeposit`).fadeIn('fast');
setTimeout(function(){
$('#generatorbutton').toggleClass('disabled');
}, 500);
}, function() {
$(`[data-wallet-tab-content="deposit"] .walletNotification`).fadeIn('fast');
});
    //document.getElementById('#generatorbutton').style.display="none";
}
</script>
@endif