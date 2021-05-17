
    $(document).ready(function(){

    $('.img-small-slots').lazy({
        visibleOnly: true
        });
    
  $('#gamelist-search').keydown(function(){
 
   // Search text
   var text = $(this).val().toLowerCase();
 
   // Hide all content class element
   $('.gamepostercard').hide();

   $('.img-small-slots').lazy({
          bind: "event"
        });

   // Search 
   $('.gamepostercard').each(function(){
 
    if($(this).text().toLowerCase().indexOf(""+text+"") != -1 ){
     $(this).closest('.gamepostercard').show();
    }
  });
 });


$('.owl-carousel').owlCarousel({
    loop:false,
    autoplay:false,
    margin:10,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        450:{
            items:2,
            nav:false
        },
        925:{
            items:3,
            nav:false
        },
        1125:{
            items:4,
            nav:false
        },
        1190:{
            items:5,
            nav:false
        }
    }
})
    });



$.on('/provider', function() {
    $('.help .title').on('click', function() {
        $(this).parent().toggleClass('active');
    });



}, ['/css/pages/provider.css']);
