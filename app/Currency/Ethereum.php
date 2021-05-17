<?php namespace App\Currency;

use App\Currency\Option\WalletOption;
use App\User;
use Bezhanov\Ethereum\Converter;
use Illuminate\Support\Facades\Log;
use Web3\Providers\HttpProvider;
use App\Http\Controllers\Api\WalletController;

use Web3\RequestManagers\HttpRequestManager;
use Web3\Web3;

class Ethereum extends Currency {

    function id(): string {
        return 'eth';
    }

    function name(): string {
        return "ETH";
    }

    public function alias(): string {
        return "ethereum";
    }

    function icon(): string {
        return "fab fa-eth";
    }

    public function style(): string {
        return "#627eea";
    }

    public function isRunning(): bool {
        return $this->coldWalletBalance() != -1;
    }
    public function dailybonus(): float {
        $ethdaily = \App\Settings::where('name', 'dailybonus_usd')->first()->value;
        return floatval(number_format(($ethdaily / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }

    
    public function dailyminslots(): float {
        $dailyslotsbet = \App\Settings::where('name', 'dailybonus_minbet_slots')->first()->value;
        return floatval(number_format(($dailyslotsbet / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }

    public function dailyminbet(): float {
        $dailyminbet = \App\Settings::where('name', 'dailybonus_minbet')->first()->value;
        return floatval(number_format(($dailyminbet / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }

    public function emeraldvip(): float {
        $emeraldvip = \App\Settings::where('name', 'emeraldvip')->first()->value;
        return floatval(number_format(($emeraldvip / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }
    public function rubyvip(): float {
        $rubyvip = \App\Settings::where('name', 'rubyvip')->first()->value;
        return floatval(number_format(($rubyvip / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }
    public function goldvip(): float {
        $goldvip = \App\Settings::where('name', 'goldvip')->first()->value;
        return floatval(number_format(($goldvip / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }
    public function platinumvip(): float {
        $platinumvip = \App\Settings::where('name', 'platinumvip')->first()->value;
        return floatval(number_format(($platinumvip / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }
    public function diamondvip(): float {
        $diamondvip = \App\Settings::where('name', 'diamondvip')->first()->value;
        return floatval(number_format(($diamondvip / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 6, '.', ''));
    }


    public function newWalletAddress(): string {
        $returnedValue = 'Error';

        $web3 = $this->getClient();
        $web3->getPersonal()->newAccount(auth()->user()->_id, function($err, $account) use(&$returnedValue) {
            if($err !== null) {
                Log::critical($err);
                return null;
            }

            $returnedValue = $account;
        });
        return $returnedValue;
    }

    private function balance($account) {
        try {
            $returnedValue = -1;
            $web3 = $this->getClient();
            $web3->getEth()->getBalance($account, function ($err, $balance) use (&$returnedValue) {
                if ($err != null) Log::critical($err);
                else $returnedValue = $balance;
            });
            return (new Converter())->fromWei($returnedValue);
        } catch (\Exception $e) {
            Log::critical($e);
            return -1;
        }
    }

    public function setupWallet() {
        $web3 = $this->getClient();
        $hotWallet = 'Error'; $coldWallet = 'Error';

        $hotPass = substr(md5(mt_rand()), 0, 32);
        $coldPass = substr(md5(mt_rand()), 0, 32);

        $this->option('transfer_password', $coldPass);
        $this->option('withdraw_password', $hotPass);

        $web3->getPersonal()->newAccount($hotPass, function($err, $account) use(&$hotWallet) {
            $hotWallet = $account;
        });
        $web3->getPersonal()->newAccount($coldPass, function($err, $account) use (&$coldWallet) {
            $coldWallet = $account;
        });
        if($hotWallet === 'Error' || $coldWallet === 'Error') return null;

        $this->option('transfer_address', $coldWallet);
        $this->option('withdraw_address', $hotWallet);
    }

    public function send(string $from, string $to, float $sum) {
        if($from === $this->option('transfer_address')) $password = $this->option('transfer_password');
        else if($from === $this->option('withdraw_address')) $password = $this->option('withdraw_password');
        else $password = User::where('wallet_eth', $from)->first()->_id;

        $this->getClient()->getPersonal()->unlockAccount($from, $password, function ($err, $unlocked) use($to, $sum, $from) {
            if($err != null) {
                Log::critical($err);
                return;
            }

            $this->getClient()->getEth()->sendTransaction([
                'to' => $to,
                'from' => $from,
                'value' => '0x' . dechex(intval((new Converter())->toWei($sum, 'ether')))
            ], function ($err) {
                if ($err !== null) Log::critical($err);
            });
        });
    }

    public function hotWalletBalance(): float {
       // return $this->balance($this->option('withdraw_address')) ?? -1;
        return '0';
    }

    public function coldWalletBalance(): float {
     //   return $this->balance($this->option('transfer_address')) ?? -1;
        return '0';
    }

    private function getClient() {
        return new Web3(new HttpProvider(new HttpRequestManager('http://localhost:8545', 30)));
    }

    public function process(string $wallet) {
        $this->getClient()->getEth()->blockNumber(function($err, $number) use($wallet) {
            if($err != null) {
                Log::critical($err);
                return;
            }
            if($number == null) return;

            $this->getClient()->getEth()->getTransactionByHash($wallet, function($err, $response) use($number, $wallet) {
                if($err != null) {
                    Log::critical($err);
                    return;
                }
                if($response == null) return;

                //if(isset($response->blockNumber)) $confirmations = intval($number->toString()) - hexdec($response->blockNumber);
                if(isset($response->to) && isset($response->blockNumber)) $this->accept(intval(Currency::find('eth')->option('confirmations')), $response->to, $wallet, (new Converter())->fromWei(intval($response->value)));
            });
        });
    }

    protected function options(): array {
        return [
        ];
    }

}
