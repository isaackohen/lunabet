<div
  class="change_client_seed modal fade"
  id="change_client_seed"
  tabindex="-1"
    style="display: block; padding-right: 15px;"
  aria-labelledby="change_client_seed"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
                <button
                type="button"
                data-mdb-dismiss="change_client_seed modal"
                aria-label="Close"
                class="btn-secondary btn-close"
                ><i class="fas fa-close-symbol"></i></button>
      </div>
      <div class="modal-body">
        <div class="ui-blocker" style="display: none;">
            <div class="loader"><div></div></div>
        </div>

        <input class="mt-4 mb-4" type="text" id="new-client-seed" value="{{ auth()->user()->client_seed }}" placeholder="{{ __('general.profile.client_seed') }}">
        <button class="btn btn-primary mr-2" id="change-client-seed-btn">{{ __('general.change') }}</button>
    </div>
</div>

</div>
</div>



