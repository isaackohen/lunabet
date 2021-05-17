<div class="container-lg">
    
    <div class="bonus-box-small" style="max-width: 1520px;">
    <div class="container">
            <input type="text" id="gamelist-search" placeholder="Search game or provider..">
                <div class="container p-1 d-none d-md-block">
                    <button class="btn btn-success m-1 p-1 active" value="" onclick="$.moveNumbers(this.value )">all slots</button>
                    <button class="btn btn-primary m-1 p-1" value="feature" onclick="$.moveNumbers(this.value )">featured</button>
                    <button class="btn btn-primary m-1 p-1" value="bonus" onclick="$.moveNumbers(this.value )">bonus slots</button>
                    <button class="btn btn-primary m-1 p-1" value="wilds" onclick="$.moveNumbers(this.value )">wilds</button>
                    <button class="btn btn-primary m-1 p-1" value="free" onclick="$.moveNumbers(this.value )">free spins</button>
                    <button class="btn btn-primary m-1 p-1" value="respin" onclick="$.moveNumbers(this.value )">respin</button>
                    <button class="btn btn-primary m-1 p-1" value="fair" onclick="$.moveNumbers(this.value )">fair</button>
                    <button class="btn btn-secondary m-1 p-1" value="netent" onclick="$.moveNumbers(this.value )">mascot</button>
                    <button class="btn btn-secondary m-1 p-1" value="evoplay" onclick="$.moveNumbers(this.value )">evoplay</button>
                    <button class="btn btn-secondary m-1 p-1" value="netent" onclick="$.moveNumbers(this.value )">netent</button>
                    <button class="btn btn-secondary m-1 p-1" value="playtech" onclick="$.moveNumbers(this.value )">playtech</button>
                    <button class="btn btn-secondary m-1 p-1" value="greentube" onclick="$.moveNumbers(this.value )">greentube</button>
                    <button class="btn btn-secondary m-1 p-1" value="pragmatic" onclick="$.moveNumbers(this.value )">pragmatic</button>
                    <button class="btn btn-secondary m-1 p-1" value="quickspin" onclick="$.moveNumbers(this.value )">quickspin</button>
                    <button class="btn btn-secondary m-1 p-1" value="microgaming" onclick="$.moveNumbers(this.value )">microgaming</button>
                    <button class="btn btn-secondary m-1 p-1" value="booongo" onclick="$.moveNumbers(this.value )">booongo</button>
                    <button class="btn btn-secondary m-1 p-1" value="gaminator" onclick="$.moveNumbers(this.value )">gaminator</button>
                    <button class="btn btn-secondary m-1 p-1" value="wazdan" onclick="$.moveNumbers(this.value )">wazdan</button>
                    <button class="btn btn-secondary m-1 p-1" value="aristocrat" onclick="$.moveNumbers(this.value )">aristocrat</button>
                    <button class="btn btn-secondary m-1 p-1" value="merkur" onclick="$.moveNumbers(this.value )">merkur</button>
                    <button class="btn btn-secondary m-1 p-1" value="playson" onclick="$.moveNumbers(this.value )">playson</button>
                    <button class="btn btn-secondary m-1 p-1" value="amatic" onclick="$.moveNumbers(this.value )">amatic</button>
                    <button class="btn btn-secondary m-1 p-1" value="kajot" onclick="$.moveNumbers(this.value )">kajot</button>
                    <button class="btn btn-secondary m-1 p-1" value="konami" onclick="$.moveNumbers(this.value )">konami</button>
                    <button class="btn btn-secondary m-1 p-1" value="igrosoft" onclick="$.moveNumbers(this.value )">igrosoft</button>
                    <button class="btn btn-secondary m-1 p-1" value="apollo" onclick="$.moveNumbers(this.value )">apollo</button>
            </div>
                <div class="our-games-box">

@foreach(\App\Games\Kernel\Game::list() as $game)
@if(!$game->isDisabled() &&  $game->metadata()->id() !== "slotmachine" && $game->metadata()->id() !== "evoplay")
            <div class="card gamepostercard m-1" onclick="redirect('/game/{{ $game->metadata()->id() }}')"  style="margin-right: 5px !important; margin-left: 5px !important; margin-bottom: 15px !important;">

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
                    <div class="card-footer" style="max-width: 205px;">
                      <span class="game-card-name-small">{{ $game->metadata()->name() }}</span></div>
                    </div>
            @else
            @endif
        @endforeach




           @foreach(\App\Slotslist::get()->shuffle() as $slots)
                    <div class="card gamepostercard m-1" style="margin-right: 5px !important; margin-left: 5px !important; margin-bottom: 15px !important;">

            @if(!auth()->guest())
             @if($slots->p == 'evoplay') 
            <div class="slots_small_poster" onclick="redirect('/slots-evo/{{ $slots->id }}')"  >
              @else
            <div class="slots_small_poster" onclick="redirect('/slots/{{ $slots->id }}')"  >
              @endif
                    <img class="img-small-slots" data-src="/img/slots/webp/{{ $slots->id }}.webp">
             @else
                <div class="slots_small_poster" onclick="$.register()">
                    <img class="img-small-slots" data-src="/img/slots/webp/{{ $slots->id }}.webp">
            @endif
                    <div class="label">
                    {{ $slots->p }}
                </div>
                    <div class="name">
                        <div class="name-text">
                            <div class="title">{{ $slots->n }}</div>
                            <div class="desc">{{ $slots->desc }}</div>
                @if(!auth()->guest())          
                             @if($slots->p == 'evoplay')      
                            <button class="btn btn-primary" onclick="redirect('/slots-evo/{{ $slots->id }}')">Play</button>                  
                            @else
                            <button class="btn btn-primary" onclick="redirect('/slots/{{ $slots->id }}')">Play</button>                  
                            @endif
                @else
                            <button class="btn btn-primary" onclick="$.register()">
                                Login
                            </button>
                @endif                                    
                        </div>
                    </div>
                </div>
                    <div class="card-footer" style="max-width: 205px;">
                      <span class="game-card-name-small">{{ $slots->n }}</span>
                    </div></div>
        @endforeach
                </div>
            </div>
        </div>
    </div>
