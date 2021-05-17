<div
  class="change_name modal modal fade"
  id="change_name modal"
  tabindex="-1"
    style="display: block; padding-right: 15px;"
  aria-labelledby="change_name modal"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">Change Name
        <button
          type="button"
          class="btn-close"
          data-mdb-dismiss="change_name modal modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="ui-blocker" style="display: none;">
            <div class="loader"><div></div></div>
        </div>



        <input class="mt-4 mb-4" type="text" id="new-name" placeholder="{{ __('general.profile.new_name') }}">
        <button class="btn btn-primary mr-2" id="change-name-btn">{{ __('general.change') }}</button>
    </div>
</div>

</div>
</div>
