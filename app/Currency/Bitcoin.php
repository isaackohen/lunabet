<?php namespace App\Currency;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\WalletController;

use Nbobtc\Command\Command;
use Nbobtc\Http\Client;

class Bitcoin extends V17RPCBitcoin {

    function id(): string {
        return "btc";
    }

    function name(): string {
        return "BTC";
    }

    public function alias(): string {
        return "bitcoin";
    }

    function icon(): string {
        return "fab fa-btc-icon";
    }

    function style(): string {
        return "#f7931a";
    }

    public function coldWalletBalance(): float {
        return '0';
    }
    public function dailyminslots(): float {
        $dailyslotsbet = \App\Settings::where('name', 'dailybonus_minbet_slots')->first()->value;
        return floatval(number_format(($dailyslotsbet / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 7, '.', ''));
    }

    public function dailyminbet(): float {
        $dailyminbet = \App\Settings::where('name', 'dailybonus_minbet')->first()->value;
        return floatval(number_format(($dailyminbet / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 7, '.', ''));
    }

    public function emeraldvip(): float {
        $emeraldvip = \App\Settings::where('name', 'emeraldvip')->first()->value;
        return floatval(number_format(($emeraldvip / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 7, '.', ''));
    }
    public function rubyvip(): float {
        $rubyvip = \App\Settings::where('name', 'rubyvip')->first()->value;
        return floatval(number_format(($rubyvip / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 7, '.', ''));
    }
    public function goldvip(): float {
        $goldvip = \App\Settings::where('name', 'goldvip')->first()->value;
        return floatval(number_format(($goldvip / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 7, '.', ''));
    }
    public function platinumvip(): float {
        $platinumvip = \App\Settings::where('name', 'platinumvip')->first()->value;
        return floatval(number_format(($platinumvip / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 7, '.', ''));
    }
    public function diamondvip(): float {
        $diamondvip = \App\Settings::where('name', 'diamondvip')->first()->value;
        return floatval(number_format(($diamondvip / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 7, '.', ''));
    }

    public function hotWalletBalance(): float {
        return '0';
    }

}
