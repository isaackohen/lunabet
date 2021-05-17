<?php

namespace App\Providers;

use App\Http\Middleware\BearerTokenMiddleware;
use Illuminate\Auth\GenericUser;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot() {
        Route::middleware(BearerTokenMiddleware::class)->post('/broadcasting/auth', function() {
            $user = auth()->guest() ? new GenericUser(['_id' => microtime()]) : auth()->user();

            request()->setUserResolver(function() use ($user) {
                return $user;
            });

            return Broadcast::auth(request());
        });

        require base_path('routes/channels.php');
    }
}
