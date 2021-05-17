import 'owl.carousel';


    $(document).ready(function(){

$('.relevantgames').owlCarousel({
    loop:true,
    autoplay:false,
    margin:10,
    items:5,
    responsiveRefreshRate: 250,
    responsiveBaseElement: ".pageContent",
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


$('.randomgames').owlCarousel({
    loop:true,
    autoplay:false,
    margin:10,
    items:5,
    responsiveRefreshRate: 350,
    responsiveBaseElement: ".pageContent",
    navContainer: '#customNav1',
    navText: ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
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



$.on('/slots-evo', function() {
    $('.help .title').on('click', function() {
        $(this).parent().toggleClass('active');
    });



}, ['/css/pages/external-slots.css']);
