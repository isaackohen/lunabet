<?php namespace App\Http\Middleware;

use Closure;

class BanCheck {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        if(!auth()->guest() && auth()->user()->ban) return response(null, 503);
        return $next($request);
    }

}
