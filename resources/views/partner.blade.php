<div class="container-lg">
    <div class="row">
        <div class="col vertical-tabs-column">
            <div class="vertical-tabs">
                <div data-toggle-tab="overview" class="option active">
                    {{ __('partner.tabs.overview') }}
                </div>
                @if(!auth()->guest())
                    <div data-toggle-tab="list" class="option">
                        {{ __('partner.tabs.list') }}
                    </div>
                @endif
            </div>
        </div>
        <div class="col vertical-tabs-content-column">
            <div class="vertical-tabs-content">
                <div class="tab-content" data-tab="overview">
                    {!! auth()->guest() ? __('partner.overview.guest_content') : __('partner.overview.content', ['id' => auth()->user()->_id]) !!}
                </div>
                @if(!auth()->guest())
                    <div class="tab-content" data-tab="list" style="display: none">
                        <h6><b>Your current referral rake profit:</b></h6>
                        <input id="balance" value="$ {{ auth()->user()->referral_balance_usd ?? 0 }}" disabled type="text">
                        <br>
                        <p>You get paid between 0.09% and 0.15% of each of your referral's wagers. Above 3$ you can payout your referral rake on this page. All payouts are credited instantly to your account in ETH.</p>

                        @if(auth()->user()->referral_balance_usd >= '3.00')
                            <button class="btn btn-success m-0 p-2" onclick="$.request('/partner_cashout');">Perform Payout in ETH</button>
                        @else
                        @endif
                        
                        <div>{!! __('partner.analytics.referrals', ['count' => \App\User::where('referral', auth()->user()->_id)->count()])  !!}</div>
                        <div>{!! __('partner.analytics.referrals_bonus', ['count' => count(auth()->user()->referral_wager_obtained ?? [])]) !!}</div>
                        <div>{!! __('partner.analytics.referrals_wheel', ['count' => auth()->user()->referral_bonus_obtained ?? 0]) !!}</div>

                        <div class="divider"></div>
                        <br>

                    </div>
                    <div class="tab-content" data-tab="analytics" style="display: none">

                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
