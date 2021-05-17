<div class="row page-title">
    <div class="col-md-12">
        <div class="float-right">
            <button class="btn btn-primary" data-toggle="modal" data-target="#create">Create</button>
        </div>
        <h4 class="mb-1 mt-0">Settings</h4>
    </div>
</div>
<div class="row">
    @foreach(\App\Settings::where('internal', '!=', true)->get() as $setting)
        <div class="col-xl-3 col-lg-6">
            <div class="card">
                <div class="card-body">
                    <h5><a href="javascript:void(0)" class="text-dark" onclick="clipboard.writeText('$setting(\'{{ $setting->name }}\')')" data-toggle="tooltip" data-placement="top" title="Copy">{{ $setting->name }}</a></h5>
                    <div class="text-muted">
                        {{ $setting->description }}
                        <div class="form-group mt-2">
                            <input data-key="{{ $setting->name }}" value="{{ $setting->value }}" type="text" class="form-control" placeholder="Value">
                        </div>
                    </div>
                </div>
                    <div class="card-body border-top">
                        <div class="row align-items-center">
                            <div class="col-sm-auto">
                                <ul class="list-inline mb-0">
                                    <li class="list-inline-item pr-2">
                                        <a data-remove="{{ $setting->name }}" href="javascript:void(0)" class="text-muted d-inline-block" data-toggle="tooltip" data-placement="top" title="" data-original-title="Remove">
                                            <i class="uil uil-trash-alt mr-1"></i> Remove
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    @endforeach
</div>
<div class="row page-title">
    <div class="col-md-12">
        <h4 class="mb-1 mt-0">System Settings</h4>
        <small><code>Read-only</code></small>
    </div>
</div>
<div class="row">
    @foreach(\App\Settings::where('internal', true)->get() as $setting)
        <div class="col-xl-3 col-lg-6">
            <div class="card">
                <div class="card-body">
                    <h5><a href="javascript:void(0)" class="text-dark" onclick="clipboard.writeText('{{ $setting->name }}')" data-toggle="tooltip" data-placement="top" title="Copy">{{ $setting->name }}</a></h5>
                    <div class="text-muted">
                        {{ $setting->description }}
                        <div class="form-group mt-2">
                            <input readonly value="{{ $setting->value }}" type="text" class="form-control" placeholder="Value">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endforeach
</div>
<div class="modal fade" id="create" tabindex="-1" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header py-3 px-4 border-bottom-0 d-block">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h5 class="modal-title">New Key</h5>
            </div>
            <div class="modal-body p-4">
                <form class="needs-validation" name="event-form" id="form-event" novalidate="">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">Key</label>
                                <input class="form-control" placeholder="Key" type="text" id="key">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label class="control-label">Description</label>
                                <input class="form-control" placeholder="Description" id="description">
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6"></div>
                        <div class="col-6 text-right">
                            <button type="button" class="btn btn-light mr-1" id="close" data-dismiss="modal">Close</button>
                            <div class="btn btn-success" id="finish">Create</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
