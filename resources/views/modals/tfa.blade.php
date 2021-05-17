<div
  class="tfa modal fade"
  id="tfa modal"
  tabindex="-1"
    style="display: block; padding-right: 15px;"
  aria-labelledby="tfa modal"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">2FA
        <button
          type="button"
          class="btn-close"
          data-mdb-dismiss="tfa modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="ui-blocker" style="display: none;">
            <div class="loader"><div></div></div>
        </div>
        <div class="lockContainer">
            <i class="fas fa-lock"></i>

            <div class="lock"></div>

            <div class="bubble"></div>
            <div class="bubble"></div>
        </div>

        <div class="tfah">2FA</div>
        <div class="tfad">{{ __('general.profile.2fa_description') }}</div>

        <div class="inputs">
            <input maxlength="2">
            <input maxlength="2">
            <input maxlength="2">
            <input maxlength="2">
            <input maxlength="2">
            <input maxlength="1">
        </div>

        <div class="tfaStatus">{{ __('general.profile.2fa_digits', ['digits' => 6]) }}</div>
    </div>
</div>
</div>
</div>
