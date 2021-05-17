@php
use Carbon\Carbon;
@endphp
@if(!isset($data))
<style>
.first th div {
color: #ffa900;
font-weight: 600;
}
		
		.first th div a {
			color: #ffa900;
			font-weight: 600;
		}
.second th div {
color: #bfdffb;
font-weight: 500;
		}
.second th div a {
color: #bfdffb;
font-weight: 500;
}
.third th div {
color: #d0898f;
font-weight: 500;
		}
.third th div a {
color: #d0898f;
font-weight: 500;
}
.playerTh {
max-width: 115px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}
.modal_content {
padding-top: 20px;
}
.rankings-table {
max-height: 350px;
min-height: 300px;
}
</style>
<div
	class="leaderboard modal show"
	id="leaderboard modal"
	tabindex="-1"
	style="display: block; padding-right: 15px;"
	aria-labelledby="leaderboard modal"
	aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-header"><i style="color: #0fd560;" class="fas fa-trophy-alt me-3"></i><span>Leaderboard</span>
				<button
				type="button"
				data-mdb-dismiss="leaderboard modal"
                class="btn-secondary btn-close"
                ><i class="fas fa-close-symbol"></i></button>
			</div>
			<div class="modal-body leader-stage">
				<div class="ui-blocker" style="display: none;">
					<div class="loader"><div></div></div>
				</div>
				<div class="modal-scrollable-content">
					<div class="modal_content"><div class="os-host os-host-foreign os-theme-thin-light rankings-table os-host-overflow os-host-overflow-x os-host-overflow-y os-host-resize-disabled os-host-transition"><div class="os-resize-observer-host observed"><div class="os-resize-observer" style="left: 0px; right: auto;"></div></div> <div class="os-size-auto-observer observed" style="height: calc(100% + 1px); float: left;"><div class="os-resize-observer"></div></div><div class="os-content-glue" style="margin: 0px; height: 3570px; width: 409px;"></div><div class="os-padding"><div class="os-viewport os-viewport-native-scrollbars-invisible" style="overflow: scroll;"><div class="os-content" style="padding: 0px; height: auto; width: 100%;">
				</div>
			</div>
		</div>
		<div class="os-scrollbar os-scrollbar-horizontal os-scrollbar-auto-hidden"><div class="os-scrollbar-track os-scrollbar-track-off"><div class="os-scrollbar-handle" style="width: 70.568%; transform: translate(0px, 0px);"></div></div></div> <div class="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden"><div class="os-scrollbar-track os-scrollbar-track-off"><div class="os-scrollbar-handle" style="height: 9.80392%; transform: translate(0px, 0px);"></div></div></div> <div class="os-scrollbar-corner"></div></div></div>
	</div>
	@endif
	@if($data === 'stat')
	@php
	if(!isset($_GET['currency'])) $currencystated = 'usd';
	$currencystated = $_GET['currency'];
	
	if(!isset($_GET['days'])) {
		$days = 'all';
		$type = 'all';
		$time = Carbon::minValue()->timestamp;
	}
	$days = $_GET['days'];
	$type = 'all';
	$time = Carbon::minValue()->timestamp;
	if($days == 'today') {
	$type = 'today';
	$time = Carbon::today()->timestamp;	
	}
	if($days == 'yesterday') {
	$type = 'today';
	$time = Carbon::yesterday()->timestamp;	
	}
	if($days == 'subday2') {
	$type = 'today';
	$time = Carbon::today()->subDays(2)->timestamp;	
	}
	if($days == 'subday3') {
	$type = 'today';
	$time = Carbon::today()->subDays(3)->timestamp;	
	}
	if($days == 'subday4') {
	$type = 'today';
	$time = Carbon::today()->subDays(4)->timestamp;	
	}
	if($days == 'subday5') {
	$type = 'today';
	$time = Carbon::today()->subDays(5)->timestamp;	
	}
	if($days == 'subday6') {
	$type = 'today';
	$time = Carbon::today()->subDays(6)->timestamp;	
	}
	if($days == 'subdayweek') {
	$type = 'today';
	$time = Carbon::today()->subWeek()->timestamp;	
	}
	if($days == 'subdaymonth') {
	$type = 'today';
	$time = Carbon::today()->subMonth()->timestamp;	
	}
	
	if($currencystated == 'usd'){
	$orderby = 'usd_wager';
	} else {
	$orderby = 'wager';
	}
	@endphp
	<div class="modal-body">
		<div class="ui-blocker" style="display: none;">
			<div class="loader"><div></div></div>
		</div>


		<div class="modal-scrollable-content">
			<div class="modal_content"><div class="os-host os-host-foreign os-theme-thin-light rankings-table os-host-overflow os-host-overflow-x os-host-overflow-y os-host-resize-disabled os-host-transition"><div class="os-resize-observer-host observed"><div class="os-resize-observer" style="left: 0px; right: auto;"></div></div> <div class="os-size-auto-observer observed" style="height: calc(100% + 1px); float: left;"><div class="os-resize-observer"></div></div><div class="os-content-glue" style="margin: 0px; height: 3570px; width: 409px;"></div><div class="os-padding"><div class="os-viewport os-viewport-native-scrollbars-invisible" style="overflow: scroll;"><div class="os-content" style="padding: 0px; height: auto; width: 100%;"><table class="live-table"><thead>
			<tr><th>#</th> <th>{{ __('general.bets.player') }}</th> <th>{{ __('general.profile.bets') }}</th> <th>{{ __('general.profile.wager') }}</th> <th>{{ __('general.profile.profit') }}</th></tr></thead>
			<tbody class="live_games">
				@foreach (\App\Leaderboard::where('type', $type)->where('currency', $currencystated)->where('time', $time)->orderBy($orderby, 'desc')->take(10)->get() as $entry)
				@if($loop->first)
				<tr class="first"><th>
					@elseif($loop->index == 1)
					<tr class="second"><th>
						@elseif($loop->index == 2)
						<tr class="third"><th>
							@else
							<tr class=""><th>
								@endif
								<div>{{ $loop->index + 1 }}</div>
							</th>
							<th>
								<div class="playerTh">
									@if($loop->first)
									<a onclick="$('.btn-close').click()" style="color: #ffa900; font-weight: 600;" href="/user/{{ \App\User::where('_id', $entry->user)->first()->_id }}" class="">{{ \App\User::where('_id', $entry->user)->first()->name }}</a>
									@elseif($loop->index == 1)
									<a onclick="$('.btn-close').click()" style="color: #bfdffb; font-weight: 400;" href="/user/{{ \App\User::where('_id', $entry->user)->first()->_id }}" class="">{{ \App\User::where('_id', $entry->user)->first()->name }}</a>
									@elseif($loop->index == 2)
									<a onclick="$('.btn-close').click()" style="color: #d0898f; font-weight: 400;" href="/user/{{ \App\User::where('_id', $entry->user)->first()->_id }}" class="">{{ \App\User::where('_id', $entry->user)->first()->name }}</a>
									@else
									<a onclick="$('.btn-close').click()" href="/user/{{ \App\User::where('_id', $entry->user)->first()->_id }}" class="">{{ \App\User::where('_id', $entry->user)->first()->name }}</a>
									@endif
								</div>
							</th>
							<th>
								<div>{{ $entry->bets }}</div>
							</th>
							<th>
								@if($currencystated != 'usd')
								<div>{{ number_format(floatval($entry->wager), 8, '.', '') }} <i class="{{ \App\Currency\Currency::find($currencystated)->icon() }}" style="color: {{ \App\Currency\Currency::find($currencystated)->style() }}"></i></div>
								@else
								<div>≈ {{ number_format(floatval($entry->usd_wager), 2, '.', '') }} <i class="fas fa-usd-circle" style="color:#02b320"></i></div>
								@endif
							</th>
							<th>
								@if($currencystated != 'usd')
								<div>{{ number_format(floatval($entry->profit), 8, '.', '') }} <i class="{{ \App\Currency\Currency::find($currencystated)->icon() }}" style="color: {{ \App\Currency\Currency::find($currencystated)->style() }}"></i></div>
								@else
								<div>≈ {{ number_format(floatval($entry->usd_profit), 2, '.', '') }} <i class="fas fa-usd-circle" style="color:#02b320"></i></div>
								@endif
							</th>
						</tr>
						@endforeach
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="os-scrollbar os-scrollbar-horizontal os-scrollbar-auto-hidden"><div class="os-scrollbar-track os-scrollbar-track-off"><div class="os-scrollbar-handle" style="width: 70.568%; transform: translate(0px, 0px);"></div></div></div> <div class="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden"><div class="os-scrollbar-track os-scrollbar-track-off"><div class="os-scrollbar-handle" style="height: 9.80392%; transform: translate(0px, 0px);"></div></div></div> <div class="os-scrollbar-corner"></div></div></div>
</div>
</div>
</div>
</div>
</div>
@endif
<hr>
	<div class="modal-footer">		
		<div class="container">
 <button data-mdb-ripple-radius="5" class="btn btn-transparent">
				<div style="width: 110px !important; display: flex;justify-content: center;">
			<select id="days-selector-leader" style="min-width: 200px;">
				<option value="all" data-style="#02b320">
					All-time
				</option>
				<option value="today" data-style="#02b320">
					Today
				</option>
				<option value="yesterday" data-style="#02b320">
					Yesterday
				</option>
			</select>
		</div>
	</button>

 <button data-mdb-ripple-radius="5" class="btn btn-transparent">
		<div style="width: 100px !important;display: flex; font-size: 10px; justify-content: center;margin-left: auto;margin-right: auto;">
			<select id="currency-selector-leader" style="min-width: 100px;">
				<option value="usd" data-icon="fas fa-usd-circle" data-style="#02b320">
					USD
				</option>
				@foreach(\App\Currency\Currency::all() as $currency)
				<option value="{{ $currency->id() }}" data-icon="{{ $currency->icon() }}" data-style="{{ $currency->style() }}">
					{{ $currency->name() }}
				</option>
				@endforeach
			</select>
		</div>	
	</button>
</div>
</div>
