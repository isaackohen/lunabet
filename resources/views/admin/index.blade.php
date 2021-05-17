<div class="container-fluid mt-3">

    <div class="row">
        <div class="col-md-2">
            <div class="card text-white bg-gradient-primary">
                <div class="card-body p-0">
                    <div class="media p-3">
                        <div class="media-body">
                            <span class="text-muted text-uppercase font-size-12 font-weight-bold">New users</span>
                            <h2 class="mb-0">{{ \App\User::where('created_at', '>=', \Carbon\Carbon::today())->count() }}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="card text-white bg-gradient-primary">
                <div class="card-body p-0">
                    <div class="media p-3">
                        <div class="media-body">
                            <span class="text-muted text-uppercase font-size-12 font-weight-bold">Games</span>
                            <h2 class="mb-0">{{ \Illuminate\Support\Facades\DB::table('games')->where('created_at', '>=', \Carbon\Carbon::today())->count() }}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card text-white bg-gradient-primary">
                <div class="card-body p-0">
                    <div class="media p-3">
                        <div class="media-body">
                            <span class="text-muted text-uppercase font-size-12 font-weight-bold">Control Events</span>
                            <h2 class="mb-0"><button class="btn btn-warning p-2" onclick="$.request('/admin/start-quiz');">Start Quiz</button>
                            <button class="btn btn-danger m-0 p-2" onclick="$.request('/admin/start-rain');">Start Rain</button>
                            <button class="btn btn-danger m-0 p-2" onclick="$.request('/admin/sendtoastmessage');">Send Toast Message</button>
                            <button class="btn btn-success m-0 p-2" onclick="$.request('/admin/start-premiumrain');">Super Drop</button>
                            <button class="btn btn-info m-0 p-2" onclick="$.request('/admin/discord-promocode');">Discord-code</button>
                            <button class="btn btn-info m-0 p-2" onclick="$.request('/admin/discord-vipcode');">Discord VIP-code</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="card text-white bg-gradient-primary">
                <div class="card-body p-0">
                    <div class="media p-3">
                        <div class="media-body">
                            <span class="text-muted text-uppercase font-size-12 font-weight-bold">Maintenance Mode</span>
                            <button class="btn btn-success ml-1 m-0 p-2" onclick="$.request('/admin/artisan-down');">On</button>
                            <button class="btn btn-danger m-0 p-2" onclick="$.request('/admin/artisan-up');">Off</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard">
        <div class="spinner-border d-flex ml-auto mr-auto"></div>
    </div>

    <div class="dashboard_games">
        <div class="spinner-border d-flex ml-auto mr-auto mt-3"></div>
    </div>
</div>
