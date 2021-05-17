@php
    $humanDiff = function(array $array) {
        foreach($array as $value) $array[array_search($value, $array)] = \Carbon\Carbon::parse($value)->toFormattedDateString();
        return $array;
    };
@endphp

<div class="row">

    <div class="col-xl-6">
        <div class="card">
            <div class="card-body pt-2">
                <a href="/admin/wallet" class="btn btn-primary btn-sm mt-2 float-right">
                    View Requests
                </a>
                <h5>Latest withdraws</h5>
                @if(\App\Withdraw::where('auto', false)->count() == 0)
                    <i style="display: flex; margin-left: auto; margin-right: auto;" data-feather="clock"></i>
                    <div class="text-center mt-2">Nothing here</div>
                @else
                    @foreach(\App\Withdraw::where('status', 0)->latest()->take(4)->get() as $withdraw)
                        @php $user = \App\User::where('_id', $withdraw->user)->first(); @endphp
                        <div class="media border-top pt-3 mb-0">
                            <img src="{{ $user->avatar }}" class="avatar rounded mr-3" alt="shreyu">
                            <div class="media-body">
                                <h6 class="mt-1 mb-0 font-size-15"><a href="/admin/user/{{ $user->id }}/">{{ $user->name }}</a></h6><span class="font-weight-light">Requested {{ $withdraw->created_at->diffForHumans() }} -  <span class="badge badge-danger">Pending Moderation</span> </span>

                                <h6 class="text-muted font-weight-normal mt-1 mb-3">{{ number_format($withdraw->sum, 8, '.', ' ') }} {{ \App\Currency\Currency::find($withdraw->currency)->name() }}
                                <br>
                                <span class="font-weight-light">{{ $withdraw->address }}</span></h6>                                                                        
                            </div>
                        </div>
                    @endforeach
                    @foreach(\App\Withdraw::where('status', 1)->latest()->take(4)->get() as $withdraw)
                        @php $user = \App\User::where('_id', $withdraw->user)->first(); @endphp
                        <div class="media border-top pt-3 mb-0">
                            <img src="{{ $user->avatar }}" class="avatar rounded mr-3" alt="shreyu">
                            <div class="media-body">
                                <h6 class="mt-1 mb-0 font-size-15"><a href="/admin/user/{{ $user->id }}/">{{ $user->name }}</a></h6><span class="font-weight-light">Requested {{ $withdraw->created_at->diffForHumans() }} -  <span class="badge badge-success">Accepted {{ $withdraw->updated_at->diffForHumans() }}</span> </span>

                                <h6 class="text-muted font-weight-normal mt-1 mb-3">{{ number_format($withdraw->sum, 8, '.', ' ') }} {{ \App\Currency\Currency::find($withdraw->currency)->name() }}
                                <br>
                                <span class="font-weight-light">{{ $withdraw->address }}</span></h6>                                                                        
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>

    </div>
    <div class="col-xl-6">
        <div class="card">
            <div class="card-body pt-2">
                <a href="/admin/wallet" class="btn btn-primary btn-sm mt-2 float-right">
                    View
                </a>
                <h5>Latest deposits</h5>
                @if(\App\Invoice::where('status', 1)->count() == 0)
                    <i style="display: flex; margin-left: auto; margin-right: auto;" data-feather="clock"></i>
                    <div class="text-center mt-2">Nothing here</div>
                @else
                    @foreach(\App\Invoice::latest()->where('status', '=', 1)->limit(30)->get() as $invoice)
                        @php $user = \App\User::where('_id', $invoice->user)->first(); @endphp
                        <div class="media border-top pt-3">
                            <img src="{{ $user->avatar }}" class="avatar rounded mr-3" alt="shreyu">
                            <div class="media-body">
                                <h6 class="mt-1 mb-0 font-size-15">{{ $user->name }}</h6>
                                <h6 class="text-muted font-weight-normal mt-1 mb-3">{{ $invoice->sum }} {{ \App\Currency\Currency::find($invoice->currency)->name() }}
                                    <br><span class="font-weight-light">{{ $invoice->created_at->diffForHumans() }}</span></h6>
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>

    </div>
</div>

