<div class="container-fluid mt-2">
    <div class="row">
        <div class="col-12 col-md-12">
            <div class="card">
                <div class="card-body p-3">
                    <h5>Withdrawal Requests</h5>
                    <div class="float-right">
                        <button class="btn btn-primary btn-sm" onclick="redirect('/admin/wallet_ignored')">Suspicious Queue (<b>{{ \App\Withdraw::where('status', 3)->count() }}</b>)</button>
                    </div>
                    @if(\App\Withdraw::where('status', 0)->count() == 0)
                    <i style="display: flex; margin-left: auto; margin-right: auto;" data-feather="clock"></i>
                    <div class="text-center mt-1">No withdrawal requests</div>
                    @else
                    <div class="row">
                        @foreach(\App\Withdraw::where('status', 0)->get() as $withdraw)
                        @php $user = \App\User::where('_id', $withdraw->user)->first(); @endphp
                        @php $withdrawals = \App\Withdraw::where('user', $user->id)->where('status', 1)->count(); @endphp
                        @php $deposits = \App\Invoice::where('user', $user->id)->where('status', 1)->where('ledger', '!=','Offerwall Credit')->count(); @endphp
                        <div class="col-sm-12 col-md-4 col-lg-4 {{ $user->vipLevel() == 5 ? 'order-1' : 'order-2' }}" data-w-id="{{ $withdraw->_id }}">
                            <div class="card" @if($user->vipLevel() == 5) style="border: 1px solid #00fffb" @endif>
                                <div class="card-body p-3">
                                    <div class="media">
                                        <img src="{{ $user->avatar }}" class="mr-3 avatar-sm rounded" alt="shreyu">
                                        <div class="media-body">
                                            <button class="btn btn-danger btn-sm" data-toggle="tooltip" title="Suspicious Queue" data-ignore-withdraw="{{ $withdraw->_id }}" style="position: absolute; right: 15px;">Suspicious</button>
                                            <h6 class="mt-1 mb-1">
                                            <a href="/admin/user/{{ $user->_id }}">{{ $user->name }}</a>
                                            </h6>
                                            <p class="text-muted">
                                                <strong>Deposits:</strong> {{ $deposits }}
                                                <strong>Withdrawals:</strong> {{ $withdrawals }}
                                                <br>
                                                <strong>Registered:</strong>
                                                {{ $user->created_at }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="row mt-2 border-top pt-2">
                                        <div class="col-12">
                                            <div class="media">
                                                <div class="media-body">
                                                    <h6 class="mb-0">Withdraw</h6>
                                                    <h6 class="font-weight-normal mt-0">
                                                    {{ number_format($withdraw->sum, 8, '.', ' ') }} {{ \App\Currency\Currency::find($withdraw->currency)->name() }}, {{ $withdraw->created_at->diffForHumans() }}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="media">
                                                <div class="media-body">
                                                    <h6 class="mb-0">Address</h6>
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
                                                    <h6 class="font-weight-normal mt-0">
                                                    @if($user->register_multiaccount_hash == null || $user->login_multiaccount_hash == null)
                                                    @if($user->register_multiaccount_hash == null) <div class="text-danger">Cleared cookie before registration</div> @endif
                                                    @if($user->login_multiaccount_hash == null) <div class="text-danger">Cleared cookie before authorization</div> @endif
                                                    @else
                                                    @if(count($same_register_hash) <= 1 && count($same_login_hash) <= 1 && count($same_register_ip) <= 1 && count($same_login_ip) <= 1)
                                                    <div>Good standing</div>
                                                    @else
                                                    @if(count($same_register_hash) > 1)
                                                    <div class="text-danger">Same registration hash: @php echo(count($same_register_hash)) @endphp</div>
                                                    @endif
                                                    @if(count($same_login_hash) > 1)
                                                    <div class="text-danger">Same auth hash: @php echo(count($same_login_hash)) @endphp</div>
                                                    @endif
                                                    @if(count($same_register_ip) > 1)
                                                    <div class="text-danger">Same registration IP:  <b>@php echo(count($same_register_ip)) @endphp</b></div>
                                                    @endif
                                                    @if(count($same_login_ip) > 1)
                                                    <div class="text-danger">Same auth IP: <b>@php echo(count($same_login_ip)) @endphp</b></div>
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
                                            <button data-accept-withdraw="{{ $withdraw->_id }}" type="button" class="btn btn-primary btn-sm btn-block mr-1">Mark Accepted</button>
                                        </div>
                                        <div class="col">
                                            <button data-decline-withdraw="{{ $withdraw->_id }}" type="button" class="btn btn-danger btn-sm btn-block">Decline</button>
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
        <div class="col-12 col-md-12">
            <div class="card">
                <div class="card-body p-3">
                    <h5>Deposits</h5>
                    <table id="deposits" class="table dt-responsive nowrap">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Ledger</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach(\App\Invoice::where('status', 1)->where('ledger', '!=','Offerwall Credit')->where('ledger', '!=', null)->get() as $invoice)
                            @php $user = \App\User::where('_id', $invoice->user)->first(); @endphp
                            <tr>
                                <td>{{ $invoice->created_at->format('d/m/Y h:i:s') }}</td>
                                <td> <a href="/admin/user/{{ $user->_id }}">{{ $user->name }}</a></td>
                                <td>{{ $invoice->sum }}</td>
                                <td>{{ $invoice->currency }}</td>
                                <td>{{ $invoice->ledger }}</td>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body p-3">
                        <h5>Withdrawals</h5>
                        <table id="withdraws" class="table dt-responsive nowrap">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                    <th>Auto</th>
                                    <th>Ledger</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach(\App\Withdraw::where('status', '=', 1)->get() as $withdraw)
                                @php $user = \App\User::where('_id', $withdraw->user)->first(); @endphp
                                <tr>
                                    <td>{{ $withdraw->created_at->format('d/m/Y h:i:s') }}</td>
                                    <td> <a href="/admin/user/{{ $user->_id }}">{{ $user->name }}</a></td>
                                    <td>{{ number_format($withdraw->sum, 8, '.', ' ') }}</td>
                                        <td>{{ $withdraw->currency }}</td>
                                    <td>{{ $withdraw->auto }}</td>
                                    <td>{{ $withdraw->address }}</td>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body p-3">
                            <h5>Offerwall</h5>
                            <table id="offerwall" class="table dt-responsive nowrap">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Amount</th>
                                        <th>Currency</th>
                                        <th>Ledger</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach(\App\Invoice::where('status', 1)->where('ledger', '=','Offerwall Credit')->where('ledger', '!=', null)->get() as $invoice)
                                    @php $user = \App\User::where('_id', $invoice->user)->first(); @endphp
                                    <tr>
                                        <td>{{ $invoice->created_at->format('d/m/Y h:i:s') }}</td>
                                        <td> <a href="/admin/user/{{ $user->_id }}">{{ $user->name }}</a></td>
                                        <td>{{ $invoice->sum }}</td>
                                        <td>{{ $invoice->currency }}</td>
                                        <td>{{ $invoice->ledger }}</td>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>