@php

@endphp
<div class="container-lg">
                  <div class="card nope p-2" style="max-height: 75px; background: linear-gradient(#6242d1, #5b3acf);">

                  <div onclick="redirect('/provider/{{ $url }}')" class="providers m-1 p-1" style="    transform: scale(0.94);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image:url(/img/providers/{{ $url }}_small.webp)">                  </div>
              </div>
<div class="our-games-box" style="border-radius: 0px !important;">

            <input type="text" id="gamelist-search" class="input m-2 mb-4 p-2" placeholder="Search {{ $url }} games..">

           @foreach(\App\Slotslist::get() as $slots)
               @if($slots->p == $url)
                    <div class="card gamepostercard m-1" style="margin-right: 17px !important; margin-left: 17px !important; margin-bottom: 15px !important;">
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
                            <button class="btn btn-secondary" onclick="redirect('/slots-evo/{{ $slots->id }}')">Play</button>      
                    @else 
                            <button class="btn btn-secondary" onclick="redirect('/slots/{{ $slots->id }}')">Play</button>      
                    @endif
                @else
                            <button class="btn btn-primary" onclick="$.register()">
                                Login
                            </button>
                @endif                                    
                        </div>
                    </div>
                </div>
               <div class="card-footer" style="max-width: 170px;">
                <small>{{ $slots->n }}</small></div>
            </div>
            @endif
        @endforeach
</div>

</div>


<div class="container-lg mt-5 mb-4">

          <div class="divider">
            <div class="line"></div>
                        <div class="btn btn-primary p-1 m-2" style="min-width: 100px" onclick="redirect('/')">Home</div>
                        <div class="btn btn-primary p-1 m-2" style="min-width: 100px" onclick="redirect('/gamelist/')">All Games</div>
                        <div class="btn btn-primary p-1 m-2" style="min-width: 100px" onclick="redirect('/earn/')">Earn</div>

            <div class="line"></div>
        </div>

      </div>
