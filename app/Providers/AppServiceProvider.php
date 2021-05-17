<?php

namespace App\Providers;

use App\Settings;
use App\User;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Torann\GeoIP\Facades\GeoIP;

class AppServiceProvider extends ServiceProvider {

    /**
     * Register any application services.
     * @return void
     */
    public function register() {
        //
    }

    /**
     * Bootstrap any application services.
     * @return void
     */
    public function boot() {
        $cookie = Cookie::get('lang');
        if(isset($cookie) && !empty($cookie)) App::setLocale($cookie);

        view()->composer('*', function($view) {
            $view->with('setting', function($name, $default = null) {
                $setting = Settings::where('name', $name)->first();
                if($setting == null) return $default;
                return $setting->value;
            });
            $view->with('hash', function($url) {
                return "$url?".md5_file(public_path().$url);
            });
        });
    }

}
