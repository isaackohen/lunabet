<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;


Route::post('partner_cashout', function() {
        $user = auth()->user();
        $currency = 'eth';
        $balanceusd = number_format(floatval("$user->referral_balance_usd"), 2);
        $ethvalue = $balanceusd / \App\Http\Controllers\Api\WalletController::rateDollarEth();
        if($balanceusd < 3) return reject(1, 'Minimum 3 dollar before you can cashout');
        $user->balance(\App\Currency\Currency::find($currency))->add($ethvalue, \App\Transaction::builder()->message('Referral Payout')->get()); 
        $user->update([
            'referral_balance_usd' => 0
        ]);
    });

Route::get('/slots/{game}', 'C27Controller@game');
Route::get('/provider/{provider}', 'C27Controller@provider');
Route::get('/slots-evo/{game}', 'EvoController@game');
Route::get('/evoplayapi/list', 'EvoController@list');

Route::group(['prefix' => '/', 'middleware' => 'throttle:360,1'], function() {

Route::get('avatar/{hash}', 'MainController@avatar')->name('avatar');
Route::get('/lang/{locale}', 'MainController@locale');
Route::get('/{page?}/{data?}', 'MainController@main');

});
