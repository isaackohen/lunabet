@php
    $game = \App\Games\Kernel\Game::find($data);
    if($game == null || $game->isDisabled()) {
        header('Location: /');
        die();
    }
@endphp

<div class="container" id="gamecontainer">
    <div class="game-container mt-1">
        <div class="row">
            <div class="col {{-- d-none d-md-block --}}">
                <div class="game-sidebar"></div>
            </div>
            <div class="col">
                <div class="game-content"></div>
            </div>
        </div>
 </div>
 </div>

<div class="container-lg mt-5 mb-4">

          <div class="divider">
            <div class="line"></div>
                        <div class="btn btn-primary p-1 m-2" style="min-width: 100px" onclick="redirect('/gamelist/')">Games</div>
                        <div class="btn btn-primary p-1 m-2" style="min-width: 100px" onclick="redirect('/bonus/')">Rewards</div>
                        <div class="btn btn-primary p-1 m-2" style="min-width: 100px" onclick="redirect('/earn/')">Earn</div>

            <div class="line"></div>
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

  <script>

  const containerElement = document.getElementById("gamecontainer");
  function toggleThing() {
  const newClass = containerElement.className == "container" ? "container-fluid" : "container";
  containerElement.className = newClass;
  }
    </script>