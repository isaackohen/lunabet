<div class="tip modal">
    <div class="content">
        <i class="fas fa-close-symbol"></i>
        <div class="ui-blocker" style="display: none;">
            <div class="loader"><div></div></div>
        </div>

        <select class="currency-selector-withdraw">
            @foreach(\App\Currency\Currency::all() as $currency)
                <option value="{{ $currency->id() }}" data-icon="{{ $currency->icon() }}" data-style="{{ $currency->style() }}">
                    {{ number_format(auth()->user()->balance($currency)->get(), 8, '.', '') }}
                </option>
            @endforeach
        </select>
            <p>Tipping disabled.</p>
    </div>
</div>
