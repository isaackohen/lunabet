$.on('/admin/user', function() {
    $('#access').select2();
    $('#access').on('select2:selecting', function(e) {
        $.request('/admin/role', { id: window._id, role: e.params.args.data.id });
    });

    $('[data-currency-balance]').on('input', function() {
        if(isNaN(parseFloat($(this).val()))) return;
        $.request('/admin/balance', { id: window._id, balance: parseFloat($(this).val()), currency: $(this).attr('data-currency-balance') });
    });

    $('[data-freegames]').on('input', function() {
        if(isNaN(parseFloat($(this).val()))) return;
        $.request('/admin/freegames', { id: window._id, freegames: parseFloat($(this).val())});
    });

    $('#datatable').DataTable({
        destroy: true,
        "type": "date-euro",
        "order": [[ 1, "desc" ]],
        "lengthMenu": [[25, 50, 100, 250, -1], [25, 50, 100, 250, "All"]],
        "language": {
            "paginate": {
                "previous": "<i class='uil uil-angle-left'>",
                "next": "<i class='uil uil-angle-right'>"
            }
        },
        "drawCallback": function () {
            $('.dataTables_paginate > .pagination').addClass('pagination-rounded');
        }
    });

    $('#transactions').DataTable({
        destroy: true,
        "type": "date-euro",
        "order": [[ 0, "desc" ]],
        "lengthMenu": [[25, 50, 100, 250, -1], [25, 50, 100, 250, "All"]],
        "language": {
            "paginate": {
                "previous": "<i class='uil uil-angle-left'>",
                "next": "<i class='uil uil-angle-right'>"
            }
        },
        "drawCallback": function () {
            $('.dataTables_paginate > .pagination').addClass('pagination-rounded');
        }
    });
});
