const stats = {
    wager: 0,
    profit: 0,
    wins: 0,
    losses: 0,
    reset: function() {
        this.wager = 0;
        this.profit = 0;
        this.wins = 0;
        this.losses = 0;
        this.series = [];
        this.update();
    },
    pushToSeries: function() {
        if(this.series.length === 0) this.series.push({
            x: 0,
            y: 0.00
        });
        this.series.push({
            x: this.series.length + 1,
            y: parseFloat(this.profit.toFixed(8))
        });
    },
    update: function() {
        $('#wager').html(this.wager.toFixed(8));
        $('#profit').html(this.profit.toFixed(8)).attr('class', `text-${this.profit >= 0 ? 'success' : 'danger'}`);
        $('#wins').html(this.wins);
        $('#losses').html(this.losses);

        this.chart.updateSeries([{
            name: $.lang('general.profit'),
            data: this.series
        }]);
    },
    chart: null,
    series: []
};

$.stats = function() {
    return stats;
};

$(document).ready(function() {
    const chart = new ApexCharts(document.querySelector(".profit-monitor-chart"), {
        series: [{
            name: $.lang('general.profit'),
            data: []
        }],
        noData: {
            text: $.lang('general.profit_monitoring.no_data')
        },
        chart: {
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            },
            type: 'line',
            height: 200
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        xaxis: {
            type: 'numeric',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: false
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            tickAmount: 1,
            floating: false,

            labels: {
                show: false
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            }
        },
        fill: {
            opacity: 0.5
        },
        tooltip: {
            x: {
                show: false,
            },
            fixed: {
                enabled: false,
                position: 'topRight'
            }
        },
        grid: {
            borderColor: 'transparent',
            yaxis: {
                lines: {
                    offsetX: -30
                }
            },
            padding: {
                left: -10,
                right: 0
            }
        }
    });
    chart.render();

    let x, y;
    $('.draggableWindow .head').on('mousedown', function(e) {
        if(e.offsetX === undefined) {
            x = e.pageX - $(this).offset().left;
            y = e.pageY - $(this).offset().top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }

        $('body').addClass('noselect');
    });
    $('body').on('mouseup', function(e) {
        $('body').removeClass('noselect');
    });
    $('body').on('mousemove', function(e) {
        if($(this).hasClass('noselect')) $('.draggableWindow').offset({
            top: e.pageY - y,
            left: e.pageX - x
        });
    });

    $(document).on('click', '.draggableWindow .head i:first-child', function() {
        $.stats().reset();
    });

    $(document).on('click', '.draggableWindow .head i:last-child', function() {
        $('.draggableWindow').removeClass('active');
    });

    $.stats().chart = chart;
    $.stats().reset();
});
