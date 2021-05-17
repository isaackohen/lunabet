<div class="bonus-side-menu-container">
    <script type="text/javascript">
        window.next = {{ auth()->user()->bonus_claim->timestamp ?? 0 }};
        window.timeout();
    </script>
	{!! NoCaptcha::renderJs() !!}

    <div class="modal-ui-block bonus-wheel-reload" style="display: none">
        <h1>{{ __('general.reload') }}</h1>
        <h3 id="reload"></h3>
    </div>
    <div class="container-md bswheel-container">

    <i class="fal fa-times" data-close-bonus-modal></i>
    <div class="wheel"></div>
	                                   <div style="height: 78px; margin-bottom: 20px; transform:scale(0.89);">
                                       {!! NoCaptcha::display(['data-theme' => 'light'], ['data-callback' => 'recaptchaCallback']) !!}
                                    </div>
        <button class="btn btn-reverse btn-block p-4 m-1" data-target="#captchaModal">{{ __('general.spin') }}</button>
        <div class="btn btn-reverse p-1 m-1 w-10" style="float: right;" data-close-bonus-modal>Close</div>
</div>
    <div class="container-lg">
