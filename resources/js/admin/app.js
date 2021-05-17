import ApexCharts from 'apexcharts';
window.ApexCharts = ApexCharts;

import MetisMenu from 'metismenujs';
window.flatpickr = require('flatpickr');
window.clipboard = require('clipboard-polyfill');
window.$ = window.jQuery = require('jquery');

import NProgress from 'nprogress';
const feather = require('feather-icons');
require('bootstrap');
require('jquery-pjax');
require('jquery-slimscroll');
require('datatables.net');
require('select2');

require('../lang');
require('../routes');
require('../request');
require('../cookie');
require('../toast');

const container = '.pageContent';
let cachedResources = [];

$.on = function(route, callback, cssUrls = []) {
    $(document).on(`page:${route.substr(1)}`, function() {
        $.loadCSS(cssUrls, callback);
    });
};

const initializeRoute = function() {
    let route = $.routes()[`/${$.currentRoute()}`];
    if(route === undefined) {
        $.loadCSS([], () => {});
        console.error(`/${$.currentRoute()} is not routed`);
    } else {
        $.loadScripts(route, function () {
            $(document).trigger(`page:${$.currentRoute()}`);

            let pathname = window.location.pathname.substr(1);
            if(pathname !== $.currentRoute()) $(document).trigger(`page:${window.location.pathname.substr(1)}`);
        });
    }

    NProgress.done();

    // Bootstrap helpers
    $('.tooltip').remove();
    $('[data-toggle="popover"]').popover('hide');

    $('[data-toggle="popover"]').popover();
    $('[data-toggle="popover"]').on('click', function() {
        $(this).toggleClass('popover-active');
    });
    $('body').tooltip({selector: '[data-toggle="tooltip"]', boundary: 'window'});

    feather.replace();

    $.each($('*[data-page-trigger]'), function(i, e) {
        let match = false;
        $.each(JSON.parse(`[${$(e).attr('data-page-trigger').replaceAll('\'', '"')}]`), function(aI, aE) {
            if(window.location.pathname === aE) match = true;
        });
        $(e).toggleClass($(e).attr('data-toggle-class'), match);
    });
};


$(document).pjax('a:not(.disable-pjax)', container);

window.redirect = function(page) {
    $.pjax({url: page, container: container})
};

$(document).on('pjax:start', function() {
    NProgress.start();
});

$(document).on('pjax:beforeReplace', function(e, contents) {
    $(container).css({'opacity': 0}).html(contents);
});

$(document).on('pjax:end', function() {
    $('[data-async-css]').remove();
    initializeRoute();
    $('.modal-backdrop').removeClass('show');
});

$(document).on('pjax:timeout', function(event) {
    event.preventDefault();
});

$.loadScripts = function(urls, callback) {
    let notLoaded = [];
    for(let i = 0; i < urls.length; i++) $.cacheResource(urls[i], function() {
        notLoaded.push(urls[i]);
    });

    if(notLoaded.length > 0) {
        let index = 0;
        const next = function() {
            $.getScript(notLoaded[index], index !== notLoaded.length - 1 ? function() {
                index++;
                next();
            } : callback);
        };
        next();
    } else callback();
};

$.loadCSS = function(urls, callback) {
    let loaded = 0;
    const finish = function() {
        $(container).animate({opacity: 1}, 250, callback);
        NProgress.done();
        $(document).trigger('page:ready');
    };

    const stylesheetLoadCallback = function() {
        loaded++;
        if(loaded >= urls.length) setTimeout(finish, 150);
    };

    if(urls.length === 0) finish();
    $.map(urls, function(url) {
        loadStyleSheet(url, stylesheetLoadCallback);
    });
};

function loadStyleSheet(path, fn, scope) {
    const head = document.getElementsByTagName('head')[0], link = document.createElement('link');
    link.setAttribute('href', path);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('data-async-css', 'true');

    let sheet, cssRules;
    if ('sheet' in link) {
        sheet = 'sheet';
        cssRules = 'cssRules';
    } else {
        sheet = 'styleSheet';
        cssRules = 'rules';
    }

    let interval_id = setInterval( function() {
        try {
            if (link[sheet] && link[sheet][cssRules].length) {
                clearInterval(interval_id);
                clearTimeout(timeout_id);
                fn.call(scope || window, true, link);
            }
        } catch(e) {} finally {}
    }, 10);
    let timeout_id = setTimeout( function() {
        clearInterval(interval_id);
        clearTimeout(timeout_id);
        head.removeChild(link);
        fn.call(scope || window, false, link);
        console.error(path + ' loading error');
    }, 15000);
    head.appendChild(link);
    return link;
}

$.cacheResource = function(key, callback) {
    if(cachedResources.includes(key)) return;
    cachedResources.push(key);
    console.log(`${key} is loaded`);
    return callback();
};

$.currentRoute = function() {
    let page = window.location.pathname;
    const format = function(skip) {
        return page.count('/') > skip ? page.substr(skip === 1 ? 1 : page.indexOf('/'+page.split('/')[skip]), page.lastIndexOf('/') - 1 ) : page.substr(1);
    };

    if(page.startsWith('/admin')) {
        if(page.endsWith('/index') || page === '/admin') return 'admin';
        page = page.substr('/admin'.length);
        return 'admin/'+format(1);
    }
    return format(1);
};

String.prototype.replaceAll = String.prototype.replaceAll || function(string, replaced) {
    return this.replace(new RegExp(string, 'g'), replaced);
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.substring(1);
};

String.prototype.count = function(find) {
    return this.split(find).length - 1;
};

$(document).ready(function() {
    initializeRoute();

    var menuRef = new MetisMenu('#menu-bar').on('shown.metisMenu', function (event) {
        window.addEventListener('click', function menuClick(e) {
            if (!event.target.contains(e.target)) {
                menuRef.hide(event.detail.shownElement);
                window.removeEventListener('click', menuClick);
            }
        });
    });
});

$.toggleRightBar = function() {
    const active = $('.rightbar-overlay').hasClass('active');
    $('.rightbar-overlay').toggle().toggleClass('active');
    $('.right-bar').css({'right': active ? '-270px' : 0});
};

!function ($) {
    "use strict";

    var Components = function () { };

    //initializing tooltip
    Components.prototype.initTooltipPlugin = function () {
        $.fn.tooltip && $('[data-toggle="tooltip"]').tooltip()
    },

    //initializing popover
    Components.prototype.initPopoverPlugin = function () {
        $.fn.popover && $('[data-toggle="popover"]').popover()
    },

    //initializing Slimscroll
    Components.prototype.initSlimScrollPlugin = function () {
        //You can change the color of scroll bar here
        $.fn.slimScroll && $(".slimscroll").slimScroll({
            height: 'auto',
            position: 'right',
            size: "4px",
            touchScrollStep: 20,
            color: '#9ea5ab'
        });
    },

    //initializing form validation
    Components.prototype.initFormValidation = function () {
        $(".needs-validation").on('submit', function (event) {
            $(this).addClass('was-validated');
            if ($(this)[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
            return true;
        });
    },

    //initilizing
    Components.prototype.init = function () {
        var $this = this;
        this.initTooltipPlugin(),
        this.initPopoverPlugin(),
        this.initSlimScrollPlugin(),
        this.initFormValidation()
    },

    $.Components = new Components, $.Components.Constructor = Components

}(window.jQuery),

function ($) {
    'use strict';

    var App = function () {
        this.$body = $('body'),
        this.$window = $(window)
    };

    /**
    Resets the scroll
    */
    App.prototype._resetSidebarScroll = function () {
        // sidebar - scroll container
        $('.slimscroll-menu').slimscroll({
            height: 'auto',
            position: 'right',
            size: "4px",
            color: '#9ea5ab',
            wheelStep: 5,
            touchScrollStep: 20
        });
    },

    /**
     * Initlizes the menu - top and sidebar
    */
    App.prototype.initMenu = function () {
        var $this = this;

        // Left menu collapse
        $('.button-menu-mobile').on('click', function (event) {
            event.preventDefault();

            var layout = $this.$body.data('layout');
            if (layout === 'topnav') {
                $(this).toggleClass('open');
                $('#topnav-menu-content').slideToggle(400);
            } else {
                $this.$body.toggleClass('sidebar-enable');
                if ($this.$window.width() >= 768) {
                    $this.$body.toggleClass('left-side-menu-condensed');
                } else {
                    $this.$body.removeClass('left-side-menu-condensed');
                }

                // sidebar - scroll container
                $this._resetSidebarScroll();
            }
        });

        // right side-bar toggle
        $('.right-bar-toggle').on('click', function (e) {
            $('body').toggleClass('right-bar-enabled');
        });

        $(document).on('click', 'body', function (e) {
            if ($(e.target).closest('.right-bar-toggle, .right-bar').length > 0) {
                return;
            }

            if ($(e.target).closest('.left-side-menu, .side-nav').length > 0 || $(e.target).hasClass('button-menu-mobile')
                || $(e.target).closest('.button-menu-mobile').length > 0) {
                return;
            }

            $('body').removeClass('right-bar-enabled');
            $('body').removeClass('sidebar-enable');
            return;
        });


        // activate topnav menu
        // $('#topnav-menu li a').each(function () {
        //     var pageUrl = window.location.href.split(/[?#]/)[0];
        //     if (this.href == pageUrl) {
        //         $(this).addClass('active');
        //         $(this).parent().parent().addClass('active'); // add active to li of the current link
        //         $(this).parent().parent().parent().parent().addClass('active');
        //         $(this).parent().parent().parent().parent().parent().parent().addClass('active');
        //     }
        // });

        // // horizontal menu
        // $('#topnav-menu .dropdown-menu a.dropdown-toggle').on('click', function () {
        //     console.log("hello");
        //     if (
        //         !$(this)
        //             .next()
        //             .hasClass('show')
        //     ) {
        //         $(this)
        //             .parents('.dropdown-menu')
        //             .first()
        //             .find('.show')
        //             .removeClass('show');
        //     }
        //     var $subMenu = $(this).next('.dropdown-menu');
        //     $subMenu.toggleClass('show');

        //     return false;
        // });

        // Preloader
        $(window).on('load', function () {
            $('#status').fadeOut();
            $('#preloader').delay(350).fadeOut('slow');
        });
    },

    /**
     * Init the layout - with broad sidebar or compact side bar
    */
    App.prototype.initLayout = function () {
        // in case of small size, add class enlarge to have minimal menu
        if (this.$window.width() >= 768 && this.$window.width() <= 1024) {
            this.$body.addClass('left-side-menu-condensed');
        } else {
            if (this.$body.data('left-keep-condensed') != true) {
                this.$body.removeClass('left-side-menu-condensed');
            }
        }

        // if the layout is scrollable - let's remove the slimscroll class from menu
        if (this.$body.hasClass('scrollable-layout')) {
            $('#sidebar-menu').removeClass("slimscroll-menu");
        }
    },

    //initilizing
    App.prototype.init = function () {
        var $this = this;
        this.initLayout();
        this.initMenu();
        $.Components.init();
        // on window resize, make menu flipped automatically
        $this.$window.on('resize', function (e) {
            e.preventDefault();
            $this.initLayout();
            $this._resetSidebarScroll();
        });

        // feather
        feather.replace();
    },

    $.App = new App, $.App.Constructor = App


}(window.jQuery),
//initializing main application module
function ($) {
    "use strict";
    $.App.init();
}(window.jQuery);
