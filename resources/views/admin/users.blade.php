<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                <h5>Users</h5>
                    <table id="datatable" class="table dt-responsive nowrap">
                        <thead>
                            <tr>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach(\App\User::get() as $user)
                                <tr>
                                    <td><a onclick="redirect('/admin/user/{{ $user->_id }}')" class="btn btn-primary m-1 p-1 float-right">Full Edit</a> <a onclick="redirect('/admin/user/{{ $user->_id }}')">{{ $user->name }}</a></td> 
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
