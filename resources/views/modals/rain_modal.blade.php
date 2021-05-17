<div
  class="rain_modal modal fade"
  id="rain_modal modal"
  tabindex="-1"
    style="display: block; padding-right: 15px;"
  aria-labelledby="rain_modal modal"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">Rain
        <button
          type="button"
          data-mdb-dismiss="rain_modal modal"
                class="btn-secondary btn-close"
                ><i class="fas fa-close-symbol"></i></button>
      </div>
      <div class="modal-body">
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

        <div class="cc_label">{{ __('general.chat_commands.modal.rain.amount') }}</div>
        <input id="rainamount" type="text" value="0.00000000">
        <div class="cc_label">{{ __('general.chat_commands.modal.rain.number_of_users') }}</div>
        <input id="rainusers" type="text" value="10">
        <button class="btn btn-primary">{{ __('general.chat_commands.modal.rain.send') }}</button>
    </div>
</div>
</div>
</div>
