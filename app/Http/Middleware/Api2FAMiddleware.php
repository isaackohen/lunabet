<?php namespace App\Http\Middleware;

use Closure;

class Api2FAMiddleware {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        if(!auth()->guest() && !auth()->user()->validate2FA(true)
            && !$request->is('api/user/2fa_validate')
            && !$request->is('auth/token')) return reject(-1024);
        return $next($request);
    }

}
