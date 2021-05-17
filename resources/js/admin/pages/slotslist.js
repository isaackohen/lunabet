$.on('/admin/slotslist', function() {
    $('[data-key]').on('input', function() {
        $.request('/admin/slotslist/editfeature', {
            key: $(this).attr('data-key'),
            value: $(this).val().length === 0 ? 'null' : $(this).val()
        });
    });
    $('[data-name]').on('input', function() {
        $.request('/admin/slotslist/editname', {
            name: $(this).attr('data-name'),
            value: $(this).val().length === 0 ? 'null' : $(this).val()
        });
    });  
    $('[data-desc]').on('input', function() {
        $.request('/admin/slotslist/editdesc', {
            desc: $(this).attr('data-desc'),
            value: $(this).val().length === 0 ? 'null' : $(this).val()
        });
    });  
    $('#datatable').DataTable({
        destroy: true,
        "lengthMenu": [[50, 100, -1], [50, 100, "All"]],
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
