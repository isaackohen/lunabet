$.displaySearchBar = function() {
    $('.searchbar-overlay').fadeToggle('fast');
    $('.searchbar').toggleClass('active');
};

$(document).ready(function() {
    $(document).on('click', '.searchbar-overlay, .searchbar [data-close-searchbar]', $.displaySearchBar);

    $('.searchbar-content').overlayScrollbars({
        scrollbars: {
            autoHide: 'leave'
        },
    callbacks : 
    {
        onScroll: function() 
        { 
            $('.img-small-slots').lazy({
                bind: "event",
                visibleOnly: true,
                appendScroll: $('#searchbar_result')
            });
        },
    }
    });
    
var typingTimer;
var doneTypingInterval = 250; 
    
$('#searchbar').keyup(function(){
    clearTimeout(typingTimer);
    if ($('#searchbar').val()) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
}); 

function doneTyping () {
            var text = $('#searchbar').val();
            $.request('search/games', { text: text }).then(function(response) {
                $('#searchbar_result').html('');
                var data = response;
                var result = data.map(function(o){
                    return `
                    <div class="card gamepostercard m-2">
                    <div class="slots_small_poster" onclick="redirect('/slots/${o.Id}')"  >
                    <img class="img-small-slots" data-src="/img/slots_webp/${o.Id}.webp">
                    <div class="label">${o.SectionId}</div>
                    <div class="name">
                    <div class="name-text">
                    <div class="title">${o.Name}</div>
                    <div class="desc">${o.Description}</div>
                    <button class="btn btn-secondary" onclick="redirect('/slots/${o.Id}')">Play</button>                  
                    </div>
                    </div>
                    </div>
                    <div class="card-footer p-2" style="max-width: 190px;">
                    <small><p class="card-title">${o.Name}</p>
                    <span class="cardprovider"><a href="/provider/${o.SectionId}">${o.SectionId}</a></span></small></div>
                    </div>
                    `;
                });
                $('#searchbar_result').append(result);
                   $('.img-small-slots').lazy({
                        bind: "event"
                    });
            }, function(error) {
                $.error(error);
            });
}
    
});