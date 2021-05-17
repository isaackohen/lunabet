import bitcoin from 'bitcoin-units';

let destroy = null, init;
$.on('/', function(){

$('.provablycard').tilt({
    glare: true,
    scale: 1.01
});

$('.featuredcard').tilt({
    glare: true,
    scale: 1.01
});

$('.parallex').tilt({
    glare: false,
    perspective: 1750,
    scale: 1.01
});


    $('.js-slider').owlCarousel({
        items: 1,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: '15000',
        loop: true,
        smartSpeed: 400
    });

    $('.js-slider2').owlCarousel({
        items: 4,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: '20000',
        loop: true,
        smartSpeed: 200,
        responsiveClass:true,
        responsive:{
        0:{
            items:1,
            nav:false
        },
        425:{
            items:2,
            nav:false
        },
        760:{
            items:3,
            nav:false
        }
    }
    });



$('.provider-carousel').owlCarousel({
    loop:true,
    autoplay:true,
    margin:5,
    autoplaySpeed: 250,
    autoplayTimeout:7000,
    responsiveClass:true,
    responsive:{
        0:{
            items:2,
            nav:false
        },
        450:{
            items:3,
            nav:false
        },
        830:{
            items:4,
            nav:false
        },
        1125:{
            items:5,
            nav:false
        },
        1190:{
            items:6,
            nav:false
        }
    }
})

$('.casinogames').owlCarousel({
    loop:true,
    autoplay:false,
    margin:5,
    autoplaySpeed: 250,
    items:5,
    responsiveBaseElement: ".pageContent",
    navContainer: '#customNav25',
    navText: ["<i class='fad fa-arrow-circle-left'></i>","<i class='fad fa-arrow-circle-right'></i>"],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        375:{
            items:2,
            nav:false
        },
        760:{
            items:3,
            nav:false
        },
        950:{
            items:4,
            nav:false
        },
        1190:{
            items:5,
            nav:false
        }
    }
})

$('.random').owlCarousel({
    loop:true,
    autoplay:true,
    autoplayTimeout:12500,
    margin:5,
    autoplaySpeed: 250,
    items:5,
    responsiveBaseElement: ".pageContent",
    navContainer: '#customNav3',
    navText: ["<i class='fad fa-arrow-circle-left'></i>","<i class='fad fa-arrow-circle-right'></i>"],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        375:{
            items:2,
            nav:false
        },
        760:{
            items:3,
            nav:false
        },
        950:{
            items:4,
            nav:false
        },
        1190:{
            items:5,
            nav:false
        }
    }
})

$('.popular').owlCarousel({
    loop:true,
    autoplay:true,
    autoplayTimeout:12500,
    margin:5,
    autoplaySpeed: 250,
    items:5,
    responsiveBaseElement: ".pageContent",
    navContainer: '#customNav2',
    navText: ["<i class='fad fa-arrow-circle-left'></i>","<i class='fad fa-arrow-circle-right'></i>"],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        375:{
            items:2,
            nav:false
        },
        760:{
            items:3,
            nav:false
        },
        950:{
            items:4,
            nav:false
        },
        1190:{
            items:5,
            nav:false
        }
    }
})


$('.provably').owlCarousel({
    loop:true,
    autoplay:false,
    autoplaySpeed: 250,
    margin:5,
    responsiveBaseElement: ".pageContent",
    navContainer: '#customNav5',
    navText: ["<i class='fad fa-arrow-circle-left'></i>","<i class='fad fa-arrow-circle-right'></i>"],
    autoplayTimeout:18000,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        375:{
            items:2,
            nav:false
        },
        760:{
            items:3,
            nav:false
        },
        950:{
            items:4,
            nav:false
        },
        1190:{
            items:5,
            nav:false
        }
    }
})



$('.topcarousel').owlCarousel({
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    loop:true,
    autoplay:true,
    margin:5,
    items:1,
    autoplayTimeout:7500,
    responsiveBaseElement: ".pageContent",
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        1500:{
            items:1,
            nav:false
        }
    }
})

$('.evoplay').owlCarousel({
    loop:false,
    autoplay:false,
    margin:5,
    autoplaySpeed: 250,
    items:5,
    autoplayTimeout:12500,
    responsiveBaseElement: ".pageContent",
    navContainer: '#customNav55',
    navText: ["<i class='fad fa-arrow-circle-left'></i>","<i class='fad fa-arrow-circle-right'></i>"],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        375:{
            items:2,
            nav:false
        },
        760:{
            items:3,
            nav:false
        },
        950:{
            items:4,
            nav:false
        },
        1190:{
            items:5,
            nav:false
        }
    }
})

$('.featured').owlCarousel({
    loop:true,
    autoplay:true,
    margin:5,
    autoplaySpeed: 250,
    items:5,
    autoplayTimeout:12500,
    responsiveBaseElement: ".pageContent",
    navContainer: '#customNav4',
    navText: ["<i class='fad fa-arrow-circle-left'></i>","<i class='fad fa-arrow-circle-right'></i>"],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        375:{
            items:2,
            nav:false
        },
        760:{
            items:3,
            nav:false
        },
        950:{
            items:4,
            nav:false
        },
        1190:{
            items:5,
            nav:false
        }
    }
})



}, ['/css/pages/index.css']);
