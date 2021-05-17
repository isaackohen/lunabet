<div
  class="overview modal fade "
  id="overview modal"
  tabindex="-1"
    style="display: block; padding-right: 15px;"
  aria-labelledby="overview modal"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Overview</h5>
        <button
          type="button"
          data-mdb-dismiss="overview modal"
                class="btn-secondary btn-close"
                ><i class="fas fa-close-symbol"></i></button>
      </div>
      <div class="modal-body">
        <div class="ui-blocker" style="display: none;">
            <div class="loader"><div></div></div>
        </div>
        <div class="modal-scrollable-content">
            <div class="overview-share-options">
                <a data-share="link" href="javascript:void(0)" data-toggle="tooltip" data-placement="top" title="{{ __('general.share_link') }}">
                    <i class="fas fa-link"></i>
                </a>
                @if(!auth()->guest())
                    <a data-share="chat" href="javascript:void(0)" data-toggle="tooltip" data-placement="top" title="{{ __('general.share_chat') }}">
                        <i class="fas fa-comments"></i>
                    </a>
                @endif
                <a data-share="vk" target="_blank" data-toggle="tooltip" data-placement="top" title="{{ __('general.share_vk') }}">
                    <i class="fab fa-vk"></i>
                </a>
                <a data-share="twitter" target="_blank" data-toggle="tooltip" data-placement="top" title="{{ __('general.share_twitter') }}">
                    <i class="fab fa-twitter"></i>
                </a>
                <a data-share="telegram" target="_blank" data-toggle="tooltip" data-placement="top" title="{{ __('general.share_telegram') }}">
                    <i class="fab fa-telegram"></i>
                </a>
            </div>

            <div class="heading text-left"></div>

            <div class="overview-player">
                <div>{{ __('general.bets.player') }}: <a onclick="$.modal('overview')"></a></div>
            </div>
            <div class="overview-bet">
                <div class="option">{{ __('general.bets.bet') }}: <span></span></div>
                <div class="option">{{ __('general.bets.mul') }}: <span></span></div>
                <div class="option">{{ __('general.bets.win') }}: <span></span></div>
            </div>

            <div class="overview-render-target"></div>
            <div class="client_seed mt-2">
                <div>{{ __('general.fairness.client_seed') }}</div>
                <a onclick="$.modal('overview')" class="client_seed_target"></a>
            </div>
            <div class="server_seed mt-2">
                <div>{{ __('general.fairness.server_seed') }}</div>
                <a onclick="$.modal('overview')" class="server_seed_target"></a>
            </div>
            <div class="nonce mt-2">
                <div>{{ __('general.fairness.nonce') }}</div>
                <a onclick="$.modal('overview')" class="nonce_target"></a>
            </div>
        </div>
    </div>
</div>
    </div>
</div>