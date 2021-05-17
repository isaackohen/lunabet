<?php

namespace App\Http\Middleware;

use Closure;

class ModeratorAuthenticate {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        if(!auth()->guest()) if(auth()->user()->access === 'admin' || auth()->user()->access === 'moderator') return $next($request);
        return redirect('/');
    }

}
