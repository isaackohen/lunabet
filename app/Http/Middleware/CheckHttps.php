<?php namespace App\Http\Middleware;

use Closure;

class CheckHttps {

    public function handle($request, Closure $next) {
//        if(!env('APP_DEBUG') && !$request->is('broadcasting/*') && !$request->is('api/*') && !$request->secure()) return redirect()->secure($request->getRequestUri());
        return $next($request);
    }

}
