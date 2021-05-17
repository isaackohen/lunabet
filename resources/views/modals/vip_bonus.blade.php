@if(isset($data))
    
    @if(auth()->user()->weekly_bonus_obtained)
        <div class="unavailable">
            <div class="slanting">
                <div class="unavailableContent">
                    {!! __('vip.bonus.timeout') !!}
                </div>
            </div>
        </div>
    @else

    <div class="bonus-image" style="background: url(img/misc/bonus-box.svg); background-size: cover; background-position: center; margin-top: 1px;">
        <div class="progress">
            @php $percent = number_format(auth()->user()->weekly_bonus ?? 0, 2, '.', ''); @endphp
            <div class="progress-bar" role="progressbar" style="width: {{ $percent }}%;">{{ $percent }}%</div>
        </div>
        <div class="btn btn-primary mt-2 @if((auth()->user()->weekly_bonus ?? 0) < 0.1) disabled @endif">{!! __('general.take', ['value' => number_format(((auth()->user()->weekly_bonus ?? 0) / 100) * auth()->user()->vipBonus(), 8, '.', ''), 'icon' => "fab fa-eth"]) !!}</div>
    </div>

    @switch(auth()->user()->vipLevel())
        @case(0) @php $vip = "none"; @endphp @break
        @case(1) @php $vip = "emerald"; @endphp @break
        @case(2) @php $vip = "ruby"; @endphp @break
        @case(3) @php $vip = "gold"; @endphp @break
        @case(4) @php $vip = "platinum"; @endphp @break
        @case(5) @php $vip = "diamond"; @endphp @break
    @endswitch
        <br>

    <div class="vipDesc">{!! __('vip.bonus.description', [
            'vip' => "<svg style='width: 14px; height: 14px;'><use href='#vip-$vip'></use></svg>"
        ]) !!}</div>
        @endif
@else

<div
  class="vip_bonus modal fade"
  id="vip_bonus modal"
  tabindex="-1"
    style="display: block; padding-right: 15px;"
  aria-labelledby="vip_bonus modal"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header"><i style="color: #0fd560;" class="fad fa-gift me-1"></i><span>Daily Cashback</span>
        <button
          type="button"
          data-mdb-dismiss="vip_bonus modal"
                aria-label="Close"
                class="btn-secondary btn-close"
                ><i class="fas fa-close-symbol"></i></button>
      </div>
      <div class="modal-body" style="min-height:350px;">
        <div class="ui-blocker" style="display: none;">
            <div class="loader"><div></div></div>
        </div> 
        <div class="modal-scrollable-content">


            <div class="vip_bonus_content"></div>
        </div>
    </div>    
    </div>
    </div>
    </div>

@endif
