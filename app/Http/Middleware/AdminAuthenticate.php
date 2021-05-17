<?php

namespace App\Http\Middleware;

use App\AdminActivity;
use App\Games\Kernel\Game;
use Carbon\Carbon;
use Closure;

class AdminAuthenticate {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        if(!auth()->guest()) {
            if(auth()->user()->access === 'admin' && auth()->user()->validate2FA(true)) {
                return $next($request);
            }
        }
        return redirect('/');
    }

}
