<div class="container-fluid">
    <div class="row page-title">
        <div class="col-md-12">
            <h4 class="mb-1 mt-0">Activity Log</h4>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-8">
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <a class="text-dark" data-toggle="collapse" href="#todayTasks" aria-expanded="false" aria-controls="todayTasks">
                                        <h5 class="mb-0"><i class="uil uil-angle-down font-size-18"></i>Activity</h5>
                                    </a>
                                    <div class="collapse show">
                                        <div class="card mb-0 shadow-none">
                                            <div class="card-body">
                                                @foreach(\App\AdminActivity::latest()->get()->reverse() as $log)
                                                    @if(\App\ActivityLog\ActivityLogEntry::find($log->type) == null) @continue @endif
                                                    @php $user = \App\User::where('_id', $log->user)->first(); @endphp
                                                    <div class="row justify-content-sm-between border-bottom">
                                                        <div class="col-lg-9 mb-2 mb-lg-0 d-flex align-items-center">
                                                            <div class="mr-2">
                                                                <img src="{{ $user->avatar }}" alt="image" class="avatar-xs rounded-circle" data-toggle="tooltip" title="{{ $user->name }}">
                                                            </div>
                                                            {{ $user->name }} - {!! \App\ActivityLog\ActivityLogEntry::find($log->type)->display($log) !!}
                                                        </div>
                                                        <div class="col-lg-3">
                                                            <div class="d-sm-flex justify-content-between">
                                                                <div class="mt-3 mt-sm-0">
                                                                    <ul class="list-inline font-13 text-sm-right">
                                                                        <li class="list-inline-item pr-1">
                                                                            <i class="uil uil-schedule font-16 mr-1"></i>
                                                                            {{ \Carbon\Carbon::parse($log->time)->diffForHumans() }}
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                @endforeach
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-4">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <div class="row">
                                <div class="col-6">
                                    <p class="mt-2 mb-1 text-muted">Moderators</p>
                                    <div class="media">
                                        <div class="media-body">
                                            <h5 class="mt-1 font-size-14">
                                                {{ \App\User::where('access', 'moderator')->count() }}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <p class="mt-2 mb-1 text-muted">Administrators</p>
                                    <div class="media">
                                        <div class="media-body">
                                            <h5 class="mt-1 font-size-14">
                                                {{ \App\User::where('access', 'admin')->count() }}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col">
                                    <h5 class="mb-2 font-size-16">Moderators</h5>
                                    @if(\App\User::where('access', 'moderator')->count() == 0) Empty @endif
                                    @foreach(\App\User::where('access', 'moderator')->get() as $user)
                                        @if(!$loop->first) <hr> @endif
                                        <div class="media mt-3 p-1">
                                            <img alt src="{{ $user->avatar }}" class="mr-2 rounded-circle" height="36">
                                            <div class="media-body">
                                                <h5 class="mt-0 mb-0 font-size-14">
                                                    {{ $user->name }}
                                                </h5>
                                                <p class="mt-1 mb-0 text-muted">
                                                    Last activity: {{ $user->latest_activity->diffForHumans() }}
                                                </p>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col">
                                    <h5 class="mb-2 font-size-16">Admins</h5>
                                    @if(\App\User::where('access', 'admin')->count() == 0) Empty @endif
                                    @foreach(\App\User::where('access', 'admin')->get() as $user)
                                        @if(!$loop->first) <hr> @endif
                                        <div class="media mt-3 p-1">
                                            <img alt src="{{ $user->avatar }}" class="mr-2 rounded-circle" height="36">
                                            <div class="media-body">
                                                <h5 class="mt-0 mb-0 font-size-14">
                                                    {{ $user->name }}
                                                </h5>
                                                <p class="mt-1 mb-0 text-muted">
                                                    Last activity: {{ $user->latest_activity->diffForHumans() }}
                                                </p>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
