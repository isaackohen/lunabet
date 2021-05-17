<div class="row page-title">
    <div class="col-md-12">
        <div class="float-left">
            <button class="btn btn-primary" data-toggle="modal" data-target="#create_standalone">Send notification</button>
        </div>
    </div>
</div>
<div class="row">

</div>
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <a href="javascript:void(0)" class="btn btn-primary btn-sm float-right" data-toggle="modal" data-target="#create_global">
                    Create
                </a>
                <h5 class="card-title mt-0 mb-0 header-title">Global Notifications</h5>

                <div class="table-responsive mt-4">
                    <table class="table table-hover table-nowrap mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 10%">Icon</th>
                                <th scope="col">Text</th>
                                <th scope="col" style="width: 10%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach(\App\GlobalNotification::get() as $notification)
                                <tr>
                                    <td style="width: 10%"><span class="badge badge-soft-danger py-1">{{ $notification->icon }}</span></td>
                                    <td>{{ $notification->text }}</td>
                                    <td style="width: 10%"><button class="btn btn-danger btn-sm" data-gn-remove="{{ $notification->_id }}">Remove</button></td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="create_global" tabindex="-1" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-3 px-4 border-bottom-0 d-block">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h5 class="modal-title">Global Notification</h5>
            </div>
            <div class="modal-body p-4">
                <form class="needs-validation" name="event-form" novalidate="">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">FontAwesome 5 Icon</label>
                                <input class="form-control" placeholder="Title" type="text" value="fal fa-exclamation-triangle" id="icon_global">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">Text</label>
                                <input class="form-control" placeholder="Text" id="text_global">
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6"></div>
                        <div class="col-6 text-right">
                            <button type="button" class="btn btn-light mr-1" id="close_global" data-dismiss="modal">Close</button>
                            <div class="btn btn-success" id="finish_global">Send</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="create_standalone" tabindex="-1" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-3 px-4 border-bottom-0 d-block">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h5 class="modal-title">Notification</h5>
            </div>
            <div class="modal-body p-4">
                <form class="needs-validation" name="event-form" novalidate="">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">Title</label>
                                <input class="form-control" placeholder="Title" type="text" id="title_standalone">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">Text</label>
                                <input class="form-control" placeholder="Text" id="message_standalone">
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6"></div>
                        <div class="col-6 text-right">
                            <button type="button" class="btn btn-light mr-1" id="close_standalone" data-dismiss="modal">Close</button>
                            <div class="btn btn-success" id="finish_standalone">Send</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="create" tabindex="-1" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-3 px-4 border-bottom-0 d-block">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h5 class="modal-title">Push Notification</h5>
            </div>
            <div class="modal-body p-4">
                <form class="needs-validation" name="event-form" novalidate="">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">Title</label>
                                <input class="form-control" placeholder="Title" type="text" id="title">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">Text</label>
                                <input class="form-control" placeholder="Text" id="message">
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6"></div>
                        <div class="col-6 text-right">
                            <button type="button" class="btn btn-light mr-1" id="close" data-dismiss="modal">Close</button>
                            <div class="btn btn-success" id="finish">Send</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
