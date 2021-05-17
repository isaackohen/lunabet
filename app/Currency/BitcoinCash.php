<?php namespace App\Currency;

use App\Settings;
use App\Http\Controllers\Api\WalletController;

use Illuminate\Support\Facades\Log;
use Nbobtc\Command\Command;
use App\Currency\Option\WalletOption;

class BitcoinCash extends V17RPCBitcoin {

    function id(): string {
        return "bch";
    }

    function name(): string {
        return "BCH";
    }

    function icon(): string {
        return "fas fa-bch";
    }

    public function alias(): string {
        return 'bitcoin-cash';
    }

    function style(): string {
        return "#8dc351";
    }

    public function dailyminslots(): float {
        $dailyslotsbet = \App\Settings::where('name', 'dailybonus_minbet_slots')->first()->value;
        return floatval(number_format(($dailyslotsbet / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 7, '.', ''));
    }

    public function dailyminbet(): float {
        $dailyminbet = \App\Settings::where('name', 'dailybonus_minbet')->first()->value;
        return floatval(number_format(($dailyminbet / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 7, '.', ''));
    }

    public function emeraldvip(): float {
        $emeraldvip = \App\Settings::where('name', 'emeraldvip')->first()->value;
        return floatval(number_format(($emeraldvip / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 7, '.', ''));
    }
    public function rubyvip(): float {
        $rubyvip = \App\Settings::where('name', 'rubyvip')->first()->value;
        return floatval(number_format(($rubyvip / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 7, '.', ''));
    }
    public function goldvip(): float {
        $goldvip = \App\Settings::where('name', 'goldvip')->first()->value;
        return floatval(number_format(($goldvip / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 7, '.', ''));
    }
    public function platinumvip(): float {
        $platinumvip = \App\Settings::where('name', 'platinumvip')->first()->value;
        return floatval(number_format(($platinumvip / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 7, '.', ''));
    }
    public function diamondvip(): float {
        $diamondvip = \App\Settings::where('name', 'diamondvip')->first()->value;
        return floatval(number_format(($diamondvip / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 7, '.', ''));
    }

    public function coldWalletBalance(): float {
        return json_decode(file_get_contents('https://rest.bitcoin.com/v2/address/details/'.$this->option('transfer_address')))->balance;
    }

    public function hotWalletBalance(): float {
        return json_decode(file_get_contents('https://rest.bitcoin.com/v2/address/details/'.$this->option('withdraw_address')))->balance;
    }
    
        protected function options(): array {
        return [
             new class extends WalletOption {
                function id() {
                    return "rpc";
                }
                function name(): string {
                    return "RPC URL";
                }
            },
                new class extends WalletOption {
                function id() {
                    return "confirmations";
                }

                function name(): string {
                    return "Required confirmations";
                }
            },  new class extends WalletOption {
                public function id() {
                    return 'transfer_address';
                }
                public function name(): string {
                    return 'Transfer deposits to this address';
                }
                
                public function readOnly(): bool {
                    return true;
                }
            },  new class extends WalletOption {
                public function id() {
                    return 'withdraw_address';
                }
                public function name(): string {
                    return 'Transfer withdraws from this address';
                }
            }
        ];
    }

}