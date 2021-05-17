$.on('/admin/users', function() {
    $('#datatable').DataTable({
        destroy: true,
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
