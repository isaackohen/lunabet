@php
    $game = \App\Games\Kernel\Game::findSlots($data);
    if($game == null || $game->isDisabled()) {
        header('Location: /');
        die();
    }
@endphp

<div class="container-fluid">
                <div class="game-content" style="width: auto;height: 400px;margin-left: auto;margin-right: auto;">
				<style>
				.modal__iframe {
					border-radius: 5px;
					overflow: hidden;
					height: 100%;
				}
				.modal-iframe {
					width: 100%;
					height: 100%;
					border: 0;
				}
				</style>
				<div class="modal__iframe">
				<iframe class="modal-iframe" id="gameFrame" src="https://6p736ftkbj.skygamming.com/" frameborder="0"></iframe>
				</div>
				</div>
</div>

@if(!auth()->guest())
    @php $latest_game = \App\Game::latest()->where('game', $data)->where('user', auth()->user()->_id)->where('status', 'in-progress')->first(); @endphp
    @if(!is_null($latest_game))
        <script type="text/javascript">
            window.restoreGame = {
                'game': {!! json_encode($latest_game->makeHidden('server_seed')->makeHidden('nonce')->makeHidden('data')->toArray()) !!},
                'history': {!! json_encode($latest_game->data['history']) !!},
                'user_data': {!! json_encode($latest_game->data['user_data']) !!}
            };
        </script>
    @else
        <script type="text/javascript">
            window.restoreGame = undefined;
        </script>
    @endif
@endif
