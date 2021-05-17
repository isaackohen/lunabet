<div class="row page-title">
    <div class="col-md-12">
        <h4 class="mb-1 mt-0">Slots</h4>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body p-0">
                <div class="media p-3">
                    <div class="media-body">
                        <span class="text-muted font-size-12 font-weight-bold">Amount</span>
                        <h2 class="mb-0">{{ \App\Slotslist::count() }}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <div class="card">
                <div class="card-body">
                    <table id="datatable" class="table dt-responsive nowrap">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 5%">Id</th>
                                <th scope="col" style="width: 10%">Name</th>
                                <th scope="col" style="width: 10%">Provider</th>
                                <th scope="col" style="width: 10%">Desc</th>
                                <th scope="col" style="width: 5%">Featured</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach(\App\Slotslist::get() as $slotslist)
                                <tr>
                                    <td style="width: 5%"><span class="badge badge-soft-info py-1">{{ $slotslist->id }}</span></td>
                                    <td style="width: 10%"><span><input data-name="{{ $slotslist->id }}" value="{{ $slotslist->n }}" type="text" class="form-control" placeholder="Value"></span></td>
                                    <td style="width: 10%"><span class="badge badge-soft">{{ $slotslist->p }}</span></td>
                                    <td style="width: 10%"><span class="badge badge-soft py-1"><input data-desc="{{ $slotslist->id }}" value="{{ $slotslist->desc }}" type="text" class="form-control" placeholder="Value"></span></td>
                                    <td style="width: 5%"><span class="badge badge-soft py-1"><input data-key="{{ $slotslist->id }}" value="{{ $slotslist->f }}" type="text" class="form-control" placeholder="Value"></span></td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
            </div>
        </div>
    </div>
</div>