
<div class="demo-notify modal" id="demo-notify modal" tabindex="-1" aria-labelledby="demo-notify modal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="demo-notify modal">{{ __('general.demo.title') }}</h5>
              <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">{{ __('general.demo.description') }}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">
                Close
                        <button class="btn btn-primary btn-block" onclick="$.modal('demo-notify', 'hide'); $.register();">{{ __('general.demo.register') }}</button>

              </button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>