<div class="container-fluid">
@if(!auth()->guest())

        <div class="bonus-box" style="max-width: 1200px;">
          <h5 style="font-weight: 600;"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-layer-plus"></i>       <button style="font-size: 8px !important;" onclick="redirect('/provider/mascot')" class="btn btn-light p-1 m-1">NEW</a> </button>
         Your Bonus</h5>

                  <div class="row">
           @if(auth()->user()->referral == '60a084ed7c66a53694260342')
            <div class="col-12 col-sm-12 col-md-6">
                <div class="bonus-box-small">
                    <div class="banner-img"><div class="text" style=" height: 100%;">
                        <div class="header"><h5>AdGateMedia Offer</h5></div>
                        <p>Deposit 15$ BTC and place 15 bets.</p>
                        
                        @if(auth()->user()->agm == 'offer1completed')
                            <div class="btn btn-primary m-1 p-1 disabled">Completed Offer Already</div>
                        @else
                        <div class="btn btn-primary m-1 p-1 agm1">Complete Offer</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        @endif
            <div class="col-12 col-sm-12 col-md-6">
                <div class="bonus-box-small">
                    <div class="banner-img"><div class="text" style=" height: 100%;">
                        <div class="header"><h5>Ethereum Deposit Bonus</h5></div>
                        <p>Deposit 20.00$ ETH or more and claim 10 Free Spins.</p>
                        @if(auth()->user()->bo1 == '1')
                            <div class="btn btn-primary m-1 p-1 bo1 disabled">Completed Offer Already</div>
                        @else
                        <div class="btn btn-primary m-1 p-1 bo1">Claim Spins</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
            <div class="col-12 col-sm-12 col-md-6">
                <div class="bonus-box-small">
                    <div class="banner-img">
                        <div class="text" style=" height: 100%;">
                            <div class="header"><h5>Promocode</h5></div>
                            <p>Enter your Promocode. Find promocodes on <a onclick="redirect('{{ \App\Settings::where('name', 'discord_invite_link')->first()->value }}')"><u>Discord</u></a>.</p><div class="btn btn-primary m-1 p-1" data-toggle-bonus-sidebar="promo">Enter Code</div>
                        </div>
                    </div></div>
                </div>
                <div class="col-12 col-sm-12 col-md-6">
                    <div class="bonus-box-small">
                        <div class="banner-img">
                            <div class="text" style=" height: 100%;">
                                <div class="header"><h5>Faucet</h5></div>
                                <p>Use our faucet once every 24 hours for 0.10$ to 1.00$.</p> <div class="btn btn-primary m-1 p-1" data-toggle-bonus-sidebar="wheel">Spin Wheel</div>
                            </div>
                            <div class="wheel-popup" style="display: none">
                                {!! __('bonus.wheel.prompt') !!}
                            </div></div>
                        </div>
                    </div>
</div>
        </div>
@endif

        <div class="bonus-box" style="max-width: 1200px;">
          <h5 style="font-weight: 600;"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-layer-plus"></i>       <button style="font-size: 8px !important;" onclick="redirect('/provider/mascot')" class="btn btn-light p-1 m-1">NEW</a> </button>
         Reward Program</h5>
        <div class="row">
                    <div class="col-12 col-sm-12 col-md-6">
                        <div class="bonus-box-small">
                            <div class="banner-img">
                                <div class="text" style=" height: 100%;">
                                    <div class="header"><h5>Reward Program</h5></div>
                                    <p>Simply play to work on your Reward Level, each level unlocks new rewards. First rank you just need to wager {{ \App\Settings::where('name', 'emeraldvip')->first()->value }}$.
                                    </p><div class="btn btn-primary m-1 p-1" onclick="$.vip()">Reward Program</div>
                                </div>                                </div>
                            </div>
                        </div>
            <div class="col-12 col-sm-12 col-md-6">
                <div class="bonus-box-small">
                    <div class="banner-img"><div class="text" style=" height: 100%;">
                        <div class="header"><h5>Daily Cashback</h5></div>
                        <p> Get Daily Cashback depending on your Luna Level.<br>Resets in: <?php $timeLeft = 86400 - (time() - strtotime("today"));
                        echo date("H\\h  i\\m", $timeLeft); ?></p>
                        <div class="btn btn-primary m-1 p-1" onclick="$.vipBonus()">More Info</div>
                    </div>
                </div>
            </div>
        </div>
                    </div>
                </div>

                <div class="container-sm">
                   <div class="alert mt-1 mb-3 p-2 text-center" role="alert"><p class="mb-1"><button onclick="redirect('/earn/')" style="font-size: 10px;" class="btn btn-danger p-1 mt-1">HOT</button> Complete offers on <a href="/earn/"> Earn Wall</a> for cash!</p></div>
                </div>

            </div>
            <div class="bonus-side-menu"></div>