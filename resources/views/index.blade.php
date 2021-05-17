@if(auth()->guest())
@else
<div class="container-md" style="background: transparent !important;">
  <div class="row">
    <div class="col-12 col-sm-12 col-md-12">
      <div class="slider slider_home">
        <div class="slider__container">
          <div class="slider__list js-slider2 owl-carousel">
            <div class="slider__item parallex" style="transform-style: preserve-3d; min-height: 80px !important; background: radial-gradient(103.03% 103.03% at 0% 0%, #4a227c 0%, #2f1154 100%); background-size: cover;">
              <div class="slider__wrap"  style="float: right; ">
                <div class="slider__info">Participate in Contests</div>
                <button class="btn btn-primary" onclick="$.races()" >Today's Contest</button>
              </div>
              <div class="slider__preview" style="
                padding: 0px;
                left: 0;
                transform: translateZ(30px);
                top: 0;
              "><img src="/img/misc/pinata.png" alt=""></div>
            </div>
            <div class="slider__item parallex" style="transform-style: preserve-3d; min-height: 80px !important; background: radial-gradient(103.03% 103.03% at 0% 0%, #4a227c 0%, #2f1154 100%); background-size: cover;">
              <div class="slider__wrap"  style="float: left; ">
                <div class="slider__info">Daily Cash simply by betting</div>
                <button class="btn btn-primary" onclick="$.vipBonus()">Rewards</button>
              </div>
              <div class="slider__preview" style="
                padding: 0px;
                transform: translateZ(30px);
                right: 5%;
                bottom: 5%;
              "><img src="/img/misc/cashback.png" alt=""></div>
            </div>
            <div class="slider__item parallex" style="transform-style: preserve-3d; min-height: 80px !important; background: radial-gradient(103.03% 103.03% at 0% 0%, #4a227c 0%, #2f1154 100%); background-size: cover;">
              <div class="slider__wrap"  style="float: left;">
                <div class="slider__info">Bull Vs Bear Forex Game</div>
                <button class="btn btn-primary disabled ">Coming Soon</button>
              </div>
              <div class="slider__preview" style="
                padding: 0px;
                transform: translateZ(30px);
                right: 0;
                bottom: 0;
              "><img src="/img/misc/bullvsbear.png" alt=""></div>
            </div>
            <div class="slider__item parallex" style="transform-style: preserve-3d; min-height: 80px !important; background: radial-gradient(103.03% 103.03% at 0% 0%, #4a227c 0%, #2f1154 100%); background-size: cover;">
              <div class="slider__wrap"  style="float: right;">
                <div class="slider__info">Moon Event</div>
                <button class="btn btn-primary disabled">Random in Chat</button>
              </div>
              <div class="slider__preview" style="
                padding: 0px;
                left: 0;
                transform: translateZ(30px);
                top: 0;
              "><img src="/img/misc/lunaman-peek_small.png" alt=""></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  @foreach(\App\GlobalNotification::get() as $notification)
  <div class="col-md-12">
    <div class="d-flex">
      @if(!auth()->guest() && auth()->user()->isDismissed($notification)) @continue @endif
      <div class="alert alert-info globalNotification p-2 m-0 mb-3" id="emailNotification" style="border-radius: 4px !important; padding: 1rem !important; padding: 1rem;
        margin-bottom: 1rem; font-weight: 500 !important; color: #22738e !important; background: url(/img/misc/arrows.svg), #d7f2fb !important;">
        <div class="icon"><i class="{{ $notification->icon }}"></i></div>
        <div class="text">{{ $notification->text }}</div>
      </div>
    </div>
  </div>
  @endforeach
  @php
  $freespins = \App\Settings::where('name', 'freespin_slot')->first()->value;
  $slotname = \App\Slotslist::get()->where('id', $freespins)->first();
  $freespinevo = \App\Settings::where('name', 'evoplay_freespin_slot')->first()->value;
  $evoslotname = \App\Slotslist::get()->where('u_id', $freespinevo)->first()->n;
  $evoslotabsolute = \App\Slotslist::get()->where('u_id', $freespinevo)->first()->id;
  $notify = auth()->user()->unreadNotifications();
  @endphp
  @if(auth()->user()->freegames > '1')
  <div class="alert alert-info mb-3 mt-3" role="alert">
    You have <strong>{{ auth()->user()->freegames }} free <i class="{{ \App\Currency\Currency::find('eth')->icon() }}" style="color: {{ \App\Currency\Currency::find('eth')->style() }}"></i> spins</strong> on your account! Get spinning on Netent's <a href="/slots/{{ $slotname->id }}" span style="capitalize; font-weight: 600 !important;">{{ $slotname->n }}</a> or on EvoPlay's <a href="/slots-evo/{{ $evoslotabsolute }}" span style="capitalize; font-weight: 600 !important;">{{ $evoslotname }}</a>.</b>
  </span>
</div>
@endif
</div>
@endif
<div class="container-lg">
@if(auth()->guest())
<div class="row">
  <div class="col-12 col-sm-12 col-md-12">
    <div class="slider slider_home">
      <div class="slider__container">
        <div class="slider__list js-slider owl-carousel">
          <div class="slider__item" style="background: radial-gradient(103.03% 103.03% at 0% 0%, #4a227c 0%, #2f1154 100%); background-size: cover;">
            <div class="slider__wrap"  style="float: right;">
              <div class="slider__date">May 2021 </div>
              <div class="slider__title">Welcome to Lunabet</div>
              <div class="slider__info">Register and make use of our non-depositor & depositor offers! </div><button class="btn btn-primary" onclick="$.auth()">Join</button>
            </div>
            <div class="slider__preview" style="
              padding: 0px;
              left: 0;
              top: 0;
            "><img src="/img/misc/happyguy.webp" alt=""></div>
          </div>
          <div class="slider__item" style="background: radial-gradient(103.03% 103.03% at 0% 0%, #4a227c 0%, #2f1154 100%); background-size: cover;">
            <div class="slider__wrap">
              <div class="slider__date">No Crypto? Start Earning!</div>
              <div class="box__body">
                <div class="stats">
                  <div class="stats__amount">Complete Survey Offers</div>
                  <div class="stats__caption"><button class="btn btn-primary" onclick="redirect('/earn/')">Paid Instantly</button></div>
                </div>
                <div class="stats">
                  <div class="stats__amount">Become an Affiliate!</div>
                  <div class="stats__caption"><button class="btn btn-primary" onclick="redirect('/partner/')">Invite Friends</button></div>
                </div>
              </div>
            </div>
            <div class="slider__preview" style="
              bottom: 0;
              right: 20%;
            "><img src="/img/misc/lunaman-peek.png" alt=""></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  @endif
  <div class="games-box" style="z-index: 1;">
    <h5 class="game-box-top-title"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-cubes"></i> Provably Fair</h5>
    <div id="customNav5" class="owl-nav d-none d-md-block"></div>
    <div class="container-flex owl-carousel provably"  style="z-index: 1;">
      @foreach(\App\Games\Kernel\Game::list() as $game)
      @if(!$game->isDisabled() &&  $game->metadata()->id() !== "slotmachine" && $game->metadata()->id() !== "evoplay")
      <div class="card gamepostercard provablycard" onclick="redirect('/game/{{ $game->metadata()->id() }}')" style="cursor: pointer; ">
        <div class="game_poster" style="background-image:url(/img/game/{{ $game->metadata()->id() }}.png); background-size: cover; background-position: center; background-repeat: no-repeat;" @if(!$game->isDisabled()) onclick="redirect('/game/{{ $game->metadata()->id() }}')" @endif>
          <?php
          $getname = $game->metadata()->name();
          ?>
          @if($getname == "Slide")
          <div class="label-red">
            NEW!
          </div>
          @endif
          <div class="label-fair">
            FAIR
          </div>
          <div class="name" style="opacity: 0;">
            test
          </div>
        </div>
        <div class="card-footer">
                <span class="game-card-name">{{ $game->metadata()->name() }}</span><br>
                <small><span class="game-card-provider">{{ \App\Settings::where('name', 'platform_name')->first()->value }}</span></small></div>
        </div>
        @else
        @endif
        @endforeach
      </div>
    </div>
    <div class="games-box" style="z-index: 1;">
      <h5 class="game-box-top-title"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-lemon"></i>  Popular Slots</h5>
      <div id="customNav4" class="owl-nav d-none d-md-block"></div>
      <div class="container-flex owl-carousel featured" style="z-index: 1;">
        @foreach(\App\Slotslist::get()->shuffle() as $slots)
        @if($slots->f == '1')
        <div class="card gamepostercard featuredcard" style="cursor: pointer; ">
          @if(!auth()->guest())
          @if($slots->p == 'evoplay')
          <div onclick="redirect('/slots-evo/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
            @else
            <div onclick="redirect('/slots/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
              @endif
              @else
              <div onclick="$.auth()" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                @endif
              </div>
              <div class="card-footer">
                <span class="game-card-name">{{ $slots->n }}</span><br>
                <small><span class="game-card-provider">{{ $slots->p }}</span></small></div>
              </div>
              @endif
              @endforeach
            </div>
          </div>
          @if(!auth()->guest() || auth()->guest())
          <div class="games-box" style="z-index: 1;">
          <h5 class="game-box-top-title"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-layer-plus"></i>  Bonus Buy Games</h5>
          <div id="customNav55" class="owl-nav d-none d-md-block"></div>
          <div class="container-flex owl-carousel evoplay" style="z-index: 1;">
            @foreach(\App\Slotslist::get()->shuffle() as $slots)
            @if($slots->f == '6')
            <div class="card gamepostercard" style="cursor: pointer; ">
              @if(!auth()->guest())
              @if($slots->p == 'evoplay')
              <div onclick="redirect('/slots-evo/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                @else
                <div onclick="redirect('/slots/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                  @endif
                  @else
                  <div onclick="$.auth()" class="game_poster" style="background-image: url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                    @endif
                  </div>
                  <div class="card-footer">
                    <span class="game-card-name">{{ $slots->n }}</span><br>
                    <small><span class="game-card-provider">{{ $slots->p }}</span></small></div>
                  </div>
                  @endif
                  @endforeach
                </div>
              </div>
              @if(!auth()->guest())
              <div class="games-box" style="z-index: 1;">
      <h5 class="game-box-top-title"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-spade"></i>  Casino Games</h5>
      <div id="customNav25" class="owl-nav d-none d-md-block"></div>
              <div class="container-flex owl-carousel casinogames"  style="z-index: 1;">
                @foreach(\App\Slotslist::get()->shuffle() as $slots)
                @if($slots->f == '3')
                <div class="card gamepostercard" style="">
                  @if(!auth()->guest())
                  @if($slots->p == 'evoplay')
                  <div onclick="redirect('/slots-evo/{{ $slots->id }}')" class="game_poster" style="cursor: pointer; background-image:url(/img/slots/webp/{{ $slots->id }}.webp);">
                    @else
                    <div onclick="redirect('/slots/{{ $slots->id }}')" class="game_poster" style="cursor: pointer; background-image:url(/img/slots/webp/{{ $slots->id }}.webp);">
                      @endif
                      @endif
                    </div>
                    <div class="card-footer">
                      <span class="game-card-name">{{ $slots->n }}</span><br>
                      <small><span class="game-card-provider">{{ $slots->p }}</span></small></div>
                    </div>
                    @endif
                    @endforeach
                  </div>
                </div>
                <div class="games-box" style="z-index: 1;">
                <h5 class="game-box-top-title"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-plane-arrival"></i>  New Arrivals</h5>
                <div id="customNav2" class="owl-nav d-none d-md-block"></div>
                <div class="container-flex owl-carousel popular" style="z-index: 1;">
                  @foreach(\App\Slotslist::get()->shuffle() as $slots)
                  @if($slots->f == '2')
                  <div class="card gamepostercard" style="cursor: pointer;">
                    @if(!auth()->guest())
                    @if($slots->p == 'evoplay')
                    <div onclick="redirect('/slots-evo/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                      @else
                      <div onclick="redirect('/slots/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                        @endif
                        @endif
                      </div>
                      <div class="card-footer">
                        <span class="game-card-name">{{ $slots->n }}</span><br>
                        <small><span class="game-card-provider">{{ $slots->p }}</span></small></div>
                      </div>
                      @endif
                      @endforeach
                    </div>
                  </div>
                  <div class="games-box" style="z-index: 1;">
                <h5 class="game-box-top-title"><i style="color: #5f3fd0; margin-right: 7px;" class="fad fa-random"></i>  Random</h5>
                <div id="customNav3" class="owl-nav d-none d-md-block"></div>
                  <div class="container-flex owl-carousel random" style="z-index: 2;">
                    @foreach(\App\Slotslist::all()->shuffle()->random(12) as $slots)
                    @if($slots->p !== "amatic" && $slots->p !== "igrosoft" && $slots->p !== "egt" && $slots->p !== "greentube" && $slots->p !== "konami" && $slots->p !== "apollo")
                    <div class="card gamepostercard" style="cursor: pointer; filter: brightness(0.92);">
                      @if(!auth()->guest())
                      @if($slots->p == 'evoplay')
                      <div onclick="redirect('/slots-evo/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                        @else
                        <div onclick="redirect('/slots/{{ $slots->id }}')" class="game_poster" style="background-image:url(/img/slots-wide/{{ $slots->p }}/{{ $slots->id }}.webp);">
                          @endif
                          @endif
                        </div>
                        <div class="card-footer">
                          <span class="game-card-name">{{ $slots->n }}</span><br>
                          <small><span class="game-card-provider">{{ $slots->p }}</span></small></div>
                        </div>
                        @endif
                        @endforeach
                      </div>
                    </div>
                    @endif
                    <div class="divider">
                      <div class="line"></div>
                      <div class="btn btn-primary p-3 m-2" style="min-width: 150px" onclick="redirect('/gamelist/')">View All Games</div>
                      <div class="line"></div>
                      @endif
                    </div>
                                        <div class="container-md provider-carousel owl-carousel mt-3" style="z-index: 1;">
                      @foreach(\App\Providers::all()->shuffle()->random(18) as $providers)
                      <div class="card m-1" style="background: linear-gradient(#6242d1, #5b3acf);">
                        <div onclick="redirect('/provider/{{ $providers->name }}')" class="providers p-2" style="background-image: url(/img/providers/{{ $providers->name }}_small.webp); transform: scale(0.7); background-size: contain; background-position: center; background-repeat: no-repeat;">                  </div>
                      </div>
                      @endforeach
                    </div>
                  </div>