<?php

namespace App\Http\Controllers\Api;

use \Cache;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    
	public static function apiRates()
    {
	   $result = Cache::remember('key', 180, function () {
       return json_decode(file_get_contents('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,BCH,LTC,IOTA,DOGE,XMR,TRX&tsyms=USD,EUR'));
       });
	   return $result;
    }
	
	/* 
	    Usd crypto rates values
	*/
	
	public static function rateDollarBtc() {
        $value = self::apiRates();
		$price = $value->BTC->USD;
        return $price;
    }
	
	public static function rateDollarBtcCash() {
        $value = self::apiRates();
		$price = $value->BCH->USD;
        return $price;
    } 
	


	public static function rateDollarEth() {
        $value = self::apiRates();
		$price = $value->ETH->USD;
        return $price;
    }
	
	public static function rateDollarXmr() {
        $value = self::apiRates();
		$price = $value->XMR->USD;
        return $price;
    }
	
	public static function rateDollarLtc() {
        $value = self::apiRates();
		$price = $value->LTC->USD;
        return $price;
    }
	
	public static function rateDollarIota() {
        $value = self::apiRates();
		$price = $value->IOTA->USD;
        return $price;
    }
	
	public static function rateDollarDoge() {
        $value = self::apiRates();
		$price = $value->DOGE->USD;
        return $price;
    }

    public static function rateDollarTron() {
        $value = self::apiRates();
		$price = $value->TRX->USD;
        return $price;
    }
	
	/* 
	    Euro crypto rates values
	*/
	
	public static function rateDollarBtcEur() {
        $value = self::apiRates();
		$price = $value->BTC->EUR;
        return $price;
    }
	
	public static function rateDollarBtcCashEur() {
        $value = self::apiRates();
		$price = $value->BCH->EUR;
        return $price;
    } 
	
	public static function rateDollarEthEur() {
        $value = self::apiRates();
		$price = $value->ETH->EUR;
        return $price;
    }
	
	public static function rateDollarXmrEur() {
        $value = self::apiRates();
		$price = $value->XMR->EUR;
        return $price;
    }
	
	public static function rateDollarLtcEur() {
        $value = self::apiRates();
		$price = $value->LTC->EUR;
        return $price;
    }
	
	public static function rateDollarIotaEur() {
        $value = self::apiRates();
		$price = $value->IOTA->EUR;
        return $price;
    }
	
	public static function rateDollarDogeEur() {
        $value = self::apiRates();
		$price = $value->DOGE->EUR;
        return $price;
    }

    public static function rateDollarTronEur() {
        $value = self::apiRates();
		$price = $value->TRX->EUR;
        return $price;
    }
	
	
}
