<?php namespace App\Currency;

use App\Currency\Option\WalletOption;
use App\User;
use App\Http\Controllers\Api\WalletController;

use IEXBase\TronAPI\Exception\TronException;
use IEXBase\TronAPI\Provider\HttpProvider;
use Illuminate\Support\Facades\Storage;

class Tron extends Currency {

    function id(): string {
        return 'trx';
    }

    function name(): string {
        return 'TRX';
    }

    public function alias(): string {
        return 'tron';
    }

    function icon(): string {
        return 'fas fa-trx';
    }

    public function style(): string {
        return "#eb0a29";
    }

    public function dailyminslots(): float {
        $dailyslotsbet = \App\Settings::where('name', 'dailybonus_minbet_slots')->first()->value;
        return floatval(number_format(($dailyslotsbet / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 7, '.', ''));
    }

    public function dailyminbet(): float {
        $dailyminbet = \App\Settings::where('name', 'dailybonus_minbet')->first()->value;
        return floatval(number_format(($dailyminbet / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 7, '.', ''));
    }

    public function emeraldvip(): float {
        $emeraldvip = \App\Settings::where('name', 'emeraldvip')->first()->value;
        return floatval(number_format(($emeraldvip / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 7, '.', ''));
    }
    public function rubyvip(): float {
        $rubyvip = \App\Settings::where('name', 'rubyvip')->first()->value;
        return floatval(number_format(($rubyvip / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 7, '.', ''));
    }
    public function goldvip(): float {
        $goldvip = \App\Settings::where('name', 'goldvip')->first()->value;
        return floatval(number_format(($goldvip / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 7, '.', ''));
    }
    public function platinumvip(): float {
        $platinumvip = \App\Settings::where('name', 'platinumvip')->first()->value;
        return floatval(number_format(($platinumvip / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 7, '.', ''));
    }
    public function diamondvip(): float {
        $diamondvip = \App\Settings::where('name', 'diamondvip')->first()->value;
        return floatval(number_format(($diamondvip / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 7, '.', ''));
    }

    public function isRunning(): bool {
        try {
            $this->coldWalletBalance();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    function newWalletAddress(): string {
        try {
            $tron = $this->client();
            $account = $tron->createAccount();
            auth()->user()->update([
                'wallet_trx_private_key' => $account['privateKey']
            ]);
            return $account['address'];
        } catch (\Exception $e) {
            return 'Error';
        }
    }

    public function process(string $wallet) {
        $client = $this->client();
        $payments = $client->getManager()->request(sprintf('v1/accounts/%s/transactions', $wallet), [
            'only_confirmed' => 'true',
            'only_to' => 'true',
            'limit' => 200
        ], 'get')['data'];
        foreach($payments as $payment) $this->accept(1, $wallet, $payment['txID'], $client->fromTron($payment['raw_data']['contract'][0]['parameter']['value']['amount']));
    }

    public function setupWallet() {
        try {
            $tron = $this->client();
            $depositAccount = $tron->createAccount();
            $withdrawAccount = $tron->createAccount();
        } catch (\Exception $e) {
            return null;
        }

        $this->option('transfer_address', $depositAccount['address']);
        $this->option('withdraw_address', $withdrawAccount['address']);
        $this->option('trx_private_key', $depositAccount['privateKey']);
        $this->option('trx_withdraw_private_key', $withdrawAccount['privateKey']);
    }

    public function send(string $from, string $to, float $sum) {
        $client = $this->client();
        $user = User::where('wallet_trx', $from)->first();

        $client->setPrivateKey($user == null ? $this->option('trx_private_key') : $user->wallet_trx_private_key);
        $client->sendRawTransaction($client->signTransaction($client->getTransactionBuilder()->sendTrx($to, $sum, $from)));
    }

    public function coldWalletBalance(): float {
    //    $client = $this->client();
    //    $client->setAddress($this->option('transfer_address'));
    //    return $client->getBalance($this->option('transfer_address'), true);
        return '0';
   }

       public function hotWalletBalance(): float {
        $client = $this->client();
        $client->setAddress($this->option('withdraw_address'));
        return $client->getBalance($this->option('withdraw_address'), true);
    }


    /** @throws \Exception */
    private function client() {
        $api = env('APP_DEBUG') ? 'https://api.shasta.trongrid.io' : 'https://api.trongrid.io';
        $fullNode = new HttpProvider($api);
        $solidityNode = new HttpProvider($api);
        $eventServer = new HttpProvider($api);

        return new \IEXBase\TronAPI\Tron($fullNode, $solidityNode, $eventServer);
    }

    protected function options(): array {
        return [

        ];
    }

}
