<div class="bonus-side-menu-container">
    <i class="fal fa-times" data-close-bonus-modal></i>
    <h2>{{ __('bonus.discord.title') }}</h2>
    <div class="bonus-scrollable os-host-flexbox">
        <div>{!! __('bonus.discord.common_desc') !!}</div>
        @if(auth()->user()->discord)
            <button class="btn btn-primary btn-block mt-2" onclick="window.open('{{ \App\Settings::where('name', 'discord_invite_link')->first()->value }}', '_blank')">{{ __('bonus.discord.redirect_group') }}</button>
            <button class="btn btn-primary btn-block mt-2" data-check-subscription>{{ __('bonus.discord.check') }}</button>
        @else
            {!! __('bonus.discord.link') !!}
            <button class="btn btn-primary btn-block mt-2" onclick="redirect('/user/{{ auth()->user()->_id }}#settings')">{{ __('bonus.discord.redirect') }}</button>
        @endif
    </div>
</div>
