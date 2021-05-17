<div class="container-fluid mt-2">

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body p-2">
                    <h5>Withdrawal Requests</h5>
                @if(\App\Withdraw::where('status', 3)->count() == 0)
                    <i style="display: flex; margin-left: auto; margin-right: auto;" data-feather="clock"></i>
                    <div class="text-center mt-2">Nothing here</div>
                @else
                    <div class="row">
                        @foreach(\App\Withdraw::where('status', 3)->get() as $withdraw)
                            @php $user = \App\User::where('_id', $withdraw->user)->first(); @endphp
                            <div class="col-sm-6 col-md-6 col-lg-4 {{ $user->vipLevel() == 5 ? 'order-1' : 'order-2' }}" data-w-id="{{ $withdraw->_id }}">
                                <div class="card" @if($user->vipLevel() == 5) style="border: 1px solid #00fffb" @endif>
                                    <div class="card-body p-3">
                                        <div class="media">
                                            <img src="{{ $user->avatar }}" class="mr-3 avatar-lg rounded" alt="shreyu">
                                            <div class="media-body">
                                                <button class="btn btn-primary btn-sm" data-toggle="tooltip" title="Игнорировать" data-ignore-withdraw="{{ $withdraw->_id }}" style="position: absolute; right: 15px;">-</button>
                                                <h5 class="mt-1 mb-0">{{ $user->name }}</h5>
                                                <h6 class="font-weight-normal mt-1 mb-1">
                                                    <a href="/admin/user/{{ $user->_id }}">{{ '@'.substr_replace($user->_id, '...', 8 / 2, strlen($user->_id) - 8) }}</a>
                                                </h6>
                                                <p class="text-muted">
                                                    <strong>Balance:</strong>
                                                    <br>
                                                    {{ number_format($user->balance(\App\Currency\Currency::find($withdraw->currency))->get(), 8, '.', ' ') }}
                                                    {{ \App\Currency\Currency::find($withdraw->currency)->name() }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="row mt-2 border-top pt-2">
                                            <div class="col-12">
                                                <div class="media">
                                                    <div class="media-body">
                                                        <h5 class="mt-2 pt-1 mb-0 font-size-16">Withdraw</h5>
                                                        <h6 class="font-weight-normal mt-0">
                                                            {{ number_format($withdraw->sum, 8, '.', ' ') }} {{ \App\Currency\Currency::find($withdraw->currency)->name() }}, {{ $withdraw->created_at->diffForHumans() }}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="media">
                                                    <div class="media-body">
                                                        <h5 class="mt-2 pt-1 mb-0 font-size-16">Address</h5>
                                                        <h6 class="font-weight-normal mt-0">{{ \App\Currency\Currency::find($withdraw->currency)->name() }} {{ $withdraw->address }}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <div class="media">
                                                    @php
                                                        $same_register_hash = \App\User::where('register_multiaccount_hash', $user->register_multiaccount_hash)->get();
                                                        $same_login_hash = \App\User::where('login_multiaccount_hash', $user->login_multiaccount_hash)->get();
                                                        $same_register_ip = \App\User::where('register_ip', $user->register_ip)->get();
                                                        $same_login_ip = \App\User::where('login_ip', $user->login_ip)->get();

                                                        $printAccounts = function($array) {
                                                            foreach($array as $value) echo '<div><a href="/admin/user/'.$value->_id.'">'.$value->name.'</a></div>';
                                                        }
                                                    @endphp

                                                    <div class="media-body">
                                                        <h5 class="mt-2 pt-1 mb-0 font-size-16">Accounts</h5>
                                                        <h6 class="font-weight-normal mt-0">
                                                            @if($user->register_multiaccount_hash == null || $user->login_multiaccount_hash == null)
                                                                @if($user->register_multiaccount_hash == null) <div class="text-danger">Cleared cookie before registration</div> @endif
                                                                @if($user->login_multiaccount_hash == null) <div class="text-danger">Cleared cookie before authorization</div> @endif
                                                            @else
                                                                @if(count($same_register_hash) <= 1 && count($same_login_hash) <= 1 && count($same_register_ip) <= 1 && count($same_login_ip) <= 1)
                                                                    <div>Good standing</div>
                                                                @else
                                                                    @if(count($same_register_hash) > 1)
                                                                        <div class="text-danger">Same registration hash:</div>
                                                                        @php $printAccounts($same_register_hash) @endphp
                                                                    @endif
                                                                    @if(count($same_login_hash) > 1)
                                                                        <div class="text-danger">Same auth hash:</div>
                                                                        @php $printAccounts($same_login_hash) @endphp
                                                                    @endif
                                                                    @if(count($same_register_ip) > 1)
                                                                        <div class="text-danger">Same registration IP:</div>
                                                                        @php $printAccounts($same_register_ip) @endphp
                                                                    @endif
                                                                    @if(count($same_login_ip) > 1)
                                                                        <div class="text-danger">Same auth IP:</div>
                                                                        @php $printAccounts($same_login_ip) @endphp
                                                                    @endif
                                                                @endif
                                                            @endif
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mt-3 text-center">
                                            <div class="col">
                                                <button data-unignore-withdraw="{{ $withdraw->_id }}" type="button" class="btn btn-primary btn-sm btn-block mr-1">Remove from this list</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
</div>
