<?php

namespace App\Console\Commands;

use App\Chat;
use App\Currency\Currency;
use App\Events\ChatMessage;
use App\Invoice;
use App\Settings;
use App\Transaction;
use App\User;
use Carbon\Carbon;
use MongoDB\BSON\Decimal128;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class Rain extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datagamble:rain';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send rain in chat';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */


    public function handle() {
		
        $usersLength = mt_rand(1, 5);
		$currency = Currency::find("eth");
        $raindollar = \App\Settings::where('name', 'rain_amountindollar')->first()->value;
        $rainamount = number_format(($raindollar / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 7, '.', '');
        $rainmaxmultiplier = \App\Settings::where('name', 'rain_maxmultiplier')->first()->value;
        $rainmaxbalance = number_format(($rainmaxmultiplier * $rainamount), 7, '.', '');

        $last1Hours = \Carbon\Carbon::now()->subHours(1)->toDateTimeString();
        $last24Hours = \Carbon\Carbon::now()->subHours(24)->toDateTimeString();
        $last10minute = \Carbon\Carbon::now()->subMinutes(10)->toDateTimeString();
        $last20minute = \Carbon\Carbon::now()->subMinutes(20)->toDateTimeString();
        $last4minute = \Carbon\Carbon::now()->subMinutes(4)->toDateTimeString();
		
        $all = User::where('latest_activity', '>=', \Carbon\Carbon::parse($last20minute))->where('eth', '<', new Decimal128($rainmaxbalance))->get()->toArray();
        if(count($all) < $usersLength) {
            $a = User::raw(function($collection) use ($usersLength) { return $collection->aggregate([ ['$sample' => ['size' => $usersLength]] ]); })->toArray();
            shuffle($a);
            $all += $a;
        }

        shuffle($all);

        $dub = []; $users = [];
        foreach ($all as $list) {
            $user = User::where('_id', $list['_id'])->first();
            if($user == null || in_array($list['_id'], $dub)) continue;
            array_push($dub, $list['_id']);
            array_push($users, $user);
        }

        $users = array_slice($users, 0, $usersLength);
        $result = [];
        

        foreach ($users as $user) {
            $user->balance($currency)->add(floatval($rainamount), Transaction::builder()->message('Rain (Global)')->get());
            array_push($result, $user->toArray());
        }

        $message = Chat::create([
            'data' => [
                'users' => $result,
                'reward' => floatval($rainamount),
                'currency' => $currency->id()
            ],
            'type' => 'rain'
        ]);

        event(new ChatMessage($message));
    }

}
