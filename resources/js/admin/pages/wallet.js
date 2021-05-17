$.on('/admin/wallet_ignored', function() {
    $('[data-unignore-withdraw]').on('click', function() {
        const id = $(this).attr('data-unignore-withdraw');
        $.request('/admin/wallet/unignore', { id: id }).then(function() {
            $(`[data-w-id="${id}"]`).remove();
            $.success('Success');
        }, function(error) {
            $.error(error);
        });
    });
});

$.on('/admin/wallet', function() {

        $('#withdraws').DataTable({
        destroy: true,
        "type": "date-euro",
        "order": [[ 0, "desc" ]],
        "lengthMenu": [[10, 50, 100, 250, -1], [10, 50, 100, 250, "All"]],
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
        $('#deposits').DataTable({
        destroy: true,
        "type": "date-euro",
        "order": [[ 0, "desc" ]],
        "lengthMenu": [[10, 50, 100, 250, -1], [10, 50, 100, 250, "All"]],
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
        $('#offerwall').DataTable({
        destroy: true,
        "type": "date-euro",
        "order": [[ 0, "desc" ]],
        "lengthMenu": [[10, 50, 100, 250, -1], [10, 50, 100, 250, "All"]],
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

    $('[data-accept-withdraw]').on('click', function() {
        const id = $(this).attr('data-accept-withdraw');
        $.request('/admin/wallet/accept', { id: id }).then(function() {
            $(`[data-w-id="${id}"]`).remove();
            $.success('Success');
        }, function(error) {
            $.error(error);
        });
    });
    $('[data-decline-withdraw]').on('click', function() {
        const id = $(this).attr('data-decline-withdraw');
        const reason = prompt('Decline Reason to User');
        if(reason == null) return;
        $.request('/admin/wallet/decline', { id: id, reason: reason }).then(function() {
            $(`[data-w-id="${id}"]`).remove();
            $.success('Success (Reason: '+reason+')');
        }, function(error) {
            $.error(error);
        });
    });
    $('[data-ignore-withdraw]').on('click', function() {
        const id = $(this).attr('data-ignore-withdraw');
        $.request('/admin/wallet/ignore', { id: id }).then(function() {
            $(`[data-w-id="${id}"]`).remove();
            $('.tooltip').remove();
            $.success('Success');
        }, function(error) {
            $.error(error);
        });
    });
});
