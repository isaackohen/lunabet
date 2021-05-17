<div class="container-lg">

    <div class="row">
        <div class="col vertical-tabs-column">
            <div class="vertical-tabs">
                <div data-toggle-tab="overview" class="option active">
                    {{ __('fairness.tabs.overview') }}
                </div>
                <div data-toggle-tab="dev" class="option">
                    {{ __('fairness.tabs.dev') }}
                </div>
                <div data-toggle-tab="transform" class="option">
                    {{ __('fairness.tabs.transform') }}
                </div>
                <div data-toggle-tab="events" class="option">
                    {{ __('fairness.tabs.events') }}
                </div>
                <div data-toggle-tab="calculator" class="option">
                    {{ __('fairness.tabs.calculator') }}
                </div>
            </div>
        </div>
        <div class="col vertical-tabs-content-column">
            <div class="vertical-tabs-content">
                <div class="tab-content" data-tab="overview">
                    {!! __('fairness.overview.1') !!}
                    <code>fair result = operators input (hashed) + players input</code>
                </div>
                <div class="tab-content" data-tab="dev" style="display: none">
                    {!! __('fairness.dev.1') !!}
<pre><code>// Random number generation based on following inputs: serverSeed,
// clientSeed, nonce and cursor
function byteGenerator({ serverSeed, clientSeed, nonce, cursor }) {

    // Setup cursor variables
    let currentRound = Math.floor(cursor / 32);
    let currentRoundCursor = cursor;
    currentRoundCursor -= currentRound * 32;

    // Generate outputs until cursor requirement fullfilled
    while (true) {

        // HMAC function used to output provided inputs into bytes
        const hmac = createHmac('sha256', serverSeed);
        hmac.update(`${clientSeed}:${nonce}:${currentRound}`);
        const buffer = hmac.digest();

        // Update curser for next iteration of loop
        while (currentRoundCursor < 32) {
            yield Number(buffer[currentRoundCursor]);
            currentRoundCursor += 1;
        }
        currentRoundCursor = 0;
        currentRound += 1;
    }
}</code></pre>
                    {!! __('fairness.dev.2') !!}
                </div>
                <div class="tab-content" data-tab="transform" style="display: none">
                    {!! __('fairness.transform.1') !!}
<pre><code>// Convert the hash output from the rng byteGenerator to floats
function generateFloats ({ serverSeed, clientSeed, nonce, cursor, count }) {
  // Random number generator function
  const rng = byteGenerator({ serverSeed, clientSeed, nonce, cursor });
  // Declare bytes as empty array
  const bytes = [];

  // Populate bytes array with sets of 4 from RNG output
  while (bytes.length < count * 4) {
    bytes.push(rng.next().value);
  }

  // Return bytes as floats using lodash reduce function
  return _.chunk(bytes, 4).map(bytesChunk =>
    bytesChunk.reduce((result, value, i) => {
      const divider = 256 ** (i + 1);
      const partialResult = value / divider;
      return result + partialResult;
    }, 0)
  );
};</code></pre>
                    {!! __('fairness.transform.2') !!}
                </div>
                <div class="tab-content" data-tab="events" style="display: none;">
                    {!! __('fairness.events.1') !!}
<pre><code>// Index of 0 to 51 : ♦2 to ♣A
const CARDS = [
  ♦2, ♥2, ♠2, ♣2, ♦3, ♥3, ♠3, ♣3, ♦4, ♥4,
  ♠4, ♣4, ♦5, ♥5, ♠5, ♣5, ♦6, ♥6, ♠6, ♣6,
  ♦7, ♥7, ♠7, ♣7, ♦8, ♥8, ♠8, ♣8, ♦9, ♥9,
  ♠9, ♣9, ♦10, ♥10, ♠10, ♣10, ♦J, ♥J, ♠J,
  ♣J, ♦Q, ♥Q, ♠Q, ♣Q, ♦K, ♥K, ♠K, ♣K, ♦A,
  ♥A, ♠A, ♣A
];

// Game event translation
const card = CARDS[Math.floor(float * 52)];</code></pre>
                    {!! __('fairness.events.2') !!}
<pre><code>// Index of 0 to 6 : green to blue
const GEMS = [ green, purple, yellow, red, light_blue, pink, blue ];

// Game event translation
const gem = GEMS[Math.floor(float * 7)];</code></pre>
                    {!! __('fairness.events.3') !!}
<pre><code>// Game event translation
const roll = (float * 10001) / 100;</code></pre>
                    {!! __('fairness.events.4') !!}
<pre><code>// Game event translation with houseEdge of 0.99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Crash point rounded down to required denominator
const crashPoint = Math.floor(floatPoint * 100) / 100;</code></pre>
                    {!! __('fairness.events.5') !!}
<pre><code>const bucket = Math.floor(float * (pins + 1));</code></pre>
                    {!! __('fairness.events.6') !!}
<pre><code>/ Index of 0 to 36
const POCKETS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36 ];

// Game event translation
const pocket = POCKETS[Math.floor(float * 37)];</code></pre>
                    {!! __('fairness.events.7') !!}
<pre><code>// Index of 0 to 39 : 1 to 40
const SQUARES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40 ];

const hit = SQUARES[Math.floor(float * 40)];</code></pre>
                    {!! __('fairness.events.8') !!}
<pre><code>// Index of 0 to 51 : ♦2 to ♣A
const CARDS = [
  ♦2, ♥2, ♠2, ♣2, ♦3, ♥3, ♠3, ♣3, ♦4, ♥4,
  ♠4, ♣4, ♦5, ♥5, ♠5, ♣5, ♦6, ♥6, ♠6, ♣6,
  ♦7, ♥7, ♠7, ♣7, ♦8, ♥8, ♠8, ♣8, ♦9, ♥9,
  ♠9, ♣9, ♦10, ♥10, ♠10, ♣10, ♦J, ♥J, ♠J,
  ♣J, ♦Q, ♥Q, ♠Q, ♣Q, ♦K, ♥K, ♠K, ♣K, ♦A,
  ♥A, ♠A, ♣A
];

// Game event translation
const card = CARDS[Math.floor(float * 52)];</code></pre>
                    {!! __('fairness.events.9') !!}
                </div>
                <div class="tab-content" data-tab="calculator" style="display: none">
                    <div><strong>{{ __('fairness.calculator.game') }}</strong></div>
                    <div class="fairness-games">
                        @foreach(\App\Games\Kernel\Game::list() as $game)
                            @if($game->metadata()->isPlaceholder()) @continue @endif
                                    @if($game->metadata()->id() == "slotmachine" || $game->isDisabled() || $game->metadata()->id() == "evoplay")
                                    @else
                            <div class="game {{ $game->metadata()->id() == 'dice' ? 'active' : '' }}" data-fairness-game="{{ $game->metadata()->id() }}" data-toggle="tooltip" data-placement="top" title="{{ $game->metadata()->id() }}">
                                <i class="{{ $game->metadata()->icon() }}"></i>
                            </div>
                            @endif
                        @endforeach
                    </div>
                    <div class="mb-1 mt-1"><strong>{{ __('fairness.calculator.client_seed') }}</strong></div>
                    <input value="{{ auth()->guest() ? '' : auth()->user()->client_seed }}" id="clientSeed" type="text" placeholder="{{ __('fairness.calculator.client_seed') }}">
                    <div class="mb-1 mt-1"><strong>{{ __('fairness.calculator.nonce') }}</strong></div>
                    <input id="nonce" type="number" placeholder="{{ __('fairness.calculator.nonce') }}">
                    <div class="mb-1 mt-1"><strong>{{ __('fairness.calculator.server_seed') }}</strong></div>
                    <input id="serverSeed" type="text" placeholder="{{ __('fairness.calculator.server_seed') }}">
                    <div class="mb-1 mt-1"><strong>{{ __('fairness.calculator.result') }}</strong></div>
                    <span id="f_result">-</span>
                </div>
            </div>
        </div>
    </div>
                <div class="our-games-box mt-5">

@foreach(\App\Games\Kernel\Game::list() as $game)
        @if(!$game->isDisabled() &&  $game->metadata()->id() !== "slotmachine" &&  $game->metadata()->id() !== "evoplay")
            <div class="card gamepostercard" onclick="redirect('/game/{{ $game->metadata()->id() }}')"  style="margin-right: 17px !important; margin-left: 17px !important; margin-bottom: 15px !important;">

            <div style="background-size: cover;" class="slots_small_poster card-img-top game-{{ $game->metadata()->id() }}" @if(!$game->isDisabled()) onclick="redirect('/game/{{ $game->metadata()->id() }}')" @endif>
        <?php
        $getname = $game->metadata()->name();
         ?>
        @if($getname == "Dice") 
                <div class="label-red">
                    HOT!
                </div>
            @elseif($getname == "Triple") 
                <div

                 class="label-red">
                    NEW GAME!
                </div>
                    @endif
                <div class="label-fair">
                    FAIR
                </div>
                <div class="name">
                    <div class="name-text">
                            <div class="title">
                    {{ $game->metadata()->name() }}
                            </div>
                    <button class="btn btn-primary"  onclick="redirect('/game/{{ $game->metadata()->id() }}')">Play</button>                  
                 </div>
                </div>
            </div>
                    <div class="card-footer" style="max-width: 170px;">
                      <span class="game-card-name-small">{{ $game->metadata()->name() }}</span></div>
                    </div>
            @else
            @endif
        @endforeach

      </div></div>
