var dataTable;
$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#DT_load').DataTable({
        "ajax": {
            "url": "../Books/GetAll/",
            "type": "GET",
            "dataType": "json"
        },
        "columns": [
            { "data": "name", "width": "20%" },
            { "data": "author", "width": "20%" },
            { "data": "isbn", "width": "20%" },
            {
                "data": "id",
                "render": function (data) {
                    return '<div class="text-center">' +
                        '<a href="../Books/Upsert?id=' + data + '" class="btn btn-success text-white" style="cursor:pointer;width:30%">Edit</a> &nbsp;' +
                        '<a class="btn btn-danger text-white" style="cursor:pointer;width:30%" onclick=Delete("../Books/Delete?id=' + data + '")>Delete</a>' +
                        '</div>';
                }, "width": "40%"
            }
        ],
        "language": {
            "emptyTable": "No Books Found."
        },
        "width": "100%"
    });
}

function Delete(url) {
    Swal.fire({
        title: 'Are you sure you want to delete this book?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText :'No, cancel the order'
    }).then((willDelete) => {
        if (willDelete.value) {

            $.ajax({
                type: "Delete",
                url: url,
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.message);
                        dataTable.ajax.reload();
                        Swal.fire(
                            'Deleted!',
                            data.message,
                            'success'
                        )
                    }
                    else {
                        toastr.error(data.message);
                        Swal.fire(
                            'Error!',
                            data.message,
                            'error'
                        )
                    }
                }
            })

        }
    })
}