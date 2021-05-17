<div class="nav-middle">
    <div class="our-games-box">
        @if(!auth()->guest())
        <button class="btn btn-secondary p-2 m-1" onclick="redirect('https://t.me/BitsArcade')">Welcome back {{ auth()->user()->name }}</button>
        @else
<img src="/img/logo/logo_temp.png" style="margin: 6px; width: 22px; height: 22px;">
        @endif
    </div>
</div>
