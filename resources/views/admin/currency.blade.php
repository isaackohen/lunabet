@if(isset($data))
    @php
        $currency = \App\Currency\Currency::find($data);
        $cold = $currency->coldWalletBalance();
        $hot = $currency->hotWalletBalance();
    @endphp
    @if($currency->isRunning())
        <div><strong>Auto-withdraw wallet balance:</strong> {{ number_format($hot, 8, '.', '') }} {{ $currency->name() }}</div>
    @else
        <div class="text-danger"><strong>Node is offline</strong></div>
    @endif
@else
    @php
        $foundEmpty = false;
        $foundCount = 0;
        foreach (\App\Currency\Currency::all() as $currency) {
            if($currency->option('withdraw_address') === '' || $currency->option('transfer_address') === '' || $currency->option('withdraw_address') === '1' || $currency->option('transfer_address') === '1') {
                $foundEmpty = true;
                $foundCount++;
            }
        }
    @endphp

            @if($foundEmpty)
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <h5>Auto-setup</h5>
                            <div>Click this button to setup missing wallet addresses.</div>
                            <div class="mb-2"><strong>When generation finishes save provided backups to safe location, otherwise you could lose access to your wallet!</strong></div>
                            <button class="btn btn-danger" id="autogen">Generate</button>
                        </div>
                    </div>
                </div>
            </div>
        @endif

    <div class="row page-title">
        <div class="col-md-12">
            <h4 class="mb-1 mt-1">Currencies</h4>
        </div>
    </div>

    <div class="container-fluid">
            <div class="row">

                <div class="col-12">
                    <div class="card text-white bg-info mb-3">
  <div class="card-body">
    <p class="card-text">Currently NOWPayments.io service is loaded. Contact support to change to Nodes or to integrate any other payment API provisioning that you would want to use.<br>
          If you get error on generating deposit address: make sure minimum deposit is sufficient (varies depending on transaction fee) and higher it till it works.</p>
  </div>
</div>
                </div>
            </div>
        @if($foundEmpty)

        @endif
        @if($foundCount == 0)

        @endif
        <div class="row">
            @foreach(\App\Currency\Currency::all() as $currency)
                <div class="col-12 col-sm-6 col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-1">{{ $currency->name() }}</h5>
                            <h6 class="text-muted font-weight-normal mt-0 mb-3">{{ $currency->id() }}</h6>
                            <div data-currency-wallet="{{ $currency->id() }}">
                               <!-- @if($currency->option('isrpc') == 'disabled') <div><strong>Auto-withdraw wallet balance:</strong> {{ $currency->hotWalletBalance() }} {{ $currency->name() }} <!--- <div class="spinner-grow spinner-grow-sm"></div> </div> @endif !-->
                            </div>
                            <div class="mt-2">
                                @foreach($currency->getOptions() as $option)
                                  <div class="form-group mt-2">
                                        <label data-toggle="tooltip" data-placement="top" title="{{ $option->id() }}">{{ $option->name() }} <br><small>
                                    @php
                                        $getvalue = $currency->option($option->id())
                                        @endphp
                                        @if(is_numeric($getvalue) == true)
                                        @if($currency->id() == 'btc')
                                        {{ number_format((\App\Http\Controllers\Api\WalletController::rateDollarBtc() * $getvalue), 3, '.', '') }}$
                                                                                @endif

                                        @if($currency->id() == 'eth')
                                        {{ number_format((\App\Http\Controllers\Api\WalletController::rateDollarEth() * $getvalue), 3, '.', '') }}$
                                                                                @endif

                                        @if($currency->id() == 'ltc')
                                        {{ number_format((\App\Http\Controllers\Api\WalletController::rateDollarLtc() * $getvalue), 3, '.', '') }}$
                                                                                @endif 

                                        @if($currency->id() == 'doge')

                                        {{ number_format((\App\Http\Controllers\Api\WalletController::rateDollarDoge() * $getvalue), 3, '.', '') }}$
                                        @endif

                                        @if($currency->id() == 'bch')
                                        {{ number_format((\App\Http\Controllers\Api\WalletController::rateDollarBtcCash() * $getvalue), 3, '.', '') }}$
                                                                                @endif

                                        @if($currency->id() == 'trx')
                                        {{ number_format((\App\Http\Controllers\Api\WalletController::rateDollarTron() * $getvalue), 3, '.', '') }}$
                                                                                @endif

                                        @endif
                                        </small></label> 
                                        <input data-currency="{{ $currency->id() }}" data-option="{{ $option->id() }}" type="text" value="{{ $currency->option($option->id()) }}" class="form-control">
                                    </div>
                                

                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

    <script>$('.pageContent').css({opacity: 1})</script>
@endif
