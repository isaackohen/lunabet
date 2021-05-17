let tfaSuccessCallbacks = [];

$.tfa = function(success) {
    tfaSuccessCallbacks.push(success);

    if($('.tfa').hasClass('show')) return;

    $.modal('tfa').then(() => {
        $('.tfa input').val('');

        $('.tfaStatus').html($.lang('general.profile.2fa_digits', {digits: 6}));

        $(".lock").removeClass("good").removeClass('bad');
        $(".lockContainer i").removeClass('return').removeClass('away').addClass('fa-lock').removeClass('fa-check').removeClass('fa-times');
        $('.tfa .inputs input:nth-child(1)').focus();
    });
}

$.tfa_test = function() {
    $.request('user/2fa_test').then(function() {
        alert('Test passed');
    });
};

$(document).ready(function() {
    function processInput(holder) {
        let elements = holder.children();

        elements.each(function(e){
            let val = $(this).val().replace(/\D/,""),
                focused = $(this).is(":focus"),
                parseGate = false;

            val.length === 1 ? parseGate = false : parseGate = true;

            $(this).val(val);

            if(parseGate && val.length > 1) {
                let	exist = !!elements[e + 1];
                exist && val[1] ? (elements[e+1].disabled = false, elements[e+1].value = val[1], elements[e].value=val[0], elements[e+1].focus()) : void 0;
            } else if(parseGate && focused && val.length === 0) {
                let exist = !!elements[e - 1];
                if(exist) elements[e-1].focus();
            }
        });

        let str = $('.tfa .inputs input:nth-child(1)').val()
            + $('.tfa .inputs input:nth-child(2)').val()
            + $('.tfa .inputs input:nth-child(3)').val()
            + $('.tfa .inputs input:nth-child(4)').val()
            + $('.tfa .inputs input:nth-child(5)').val()
            + $('.tfa .inputs input:nth-child(6)').val();

        $('.tfaStatus').html($.lang('general.profile.2fa_digits', {digits: 6 - str.length}));
        if(str.length >= 6) {
            $('.tfa').uiBlocker(true);
            $.request('user/2fa_validate', { code: str }).then(function() {
                $('.tfa').uiBlocker(false);

                $(".lock").removeClass('bad').addClass("good");
                $(".lockContainer i").addClass('away').delay(1000).removeClass('fa-lock').addClass('fa-check').removeClass('away').addClass('return');

                setTimeout(function() {
                    $.modal('tfa', 'hide');

                    _.forEach(tfaSuccessCallbacks, function(callback) {
                        callback();
                    });
                    tfaSuccessCallbacks = [];
                }, 1500);
            }, function() {
                $('.tfa').uiBlocker(false);
                $('.tfaStatus').html($.lang('general.profile.error_2fa'));
                $('.tfa .inputs input').val('');
                $('.tfa .inputs input:nth-child(1)').focus();

                $(".lock").removeClass('good').addClass("bad");
                $(".lockContainer i").addClass('away').delay(1000).removeClass('fa-lock').addClass('fa-times').removeClass('away').addClass('return');
            });
        }
    }

    $(document).on('input', ".tfa .inputs", function() {
        processInput($(this));
    });

    $(document).on('click', ".tfa .inputs", function() {
        let els = $(this).children();
        els.each(function() {
            $this = $(this);
            while($this.prev().val() === ""){
                $this.prev().focus();
                $this = $this.prev();
            }
        })
    });

});
