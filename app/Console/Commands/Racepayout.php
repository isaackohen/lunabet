<?php

namespace App\Console\Commands;

use App\Chat;
use App\Leaderboard;
use App\Races;
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

class Racepayout extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datagamble:racepayout';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pays out yesterday race winners';

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
        $yday = Carbon::yesterday()->timestamp; 
        $index = 0;

        foreach (\App\Races::where('type', 'today')->where('currency', 'usd')->where('time', $yday)->orderBy('usd_wager', 'desc')->take(10)->get() as $i=>$entry) {
            if($i == 0){
                        $user = \App\User::where('_id', $entry->user)->first();
                        $balancetype = \App\Settings::where('name', 'races_prize_currency')->first()->value;
                        $firstprize = \App\Settings::where('name', 'races_prize_1st')->first()->value;
                        $addbalance = number_format(($firstprize / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 7, '.', '');

                        if($user->access == 'user') {
                            $user->balance(\App\Currency\Currency::find($balancetype))->add($addbalance, \App\Transaction::builder()->message('Races')->get()); 
                        }
            }
                    elseif($i == 1) {
                        $user = \App\User::where('_id', $entry->user)->first();
                        $balancetype = \App\Settings::where('name', 'races_prize_currency')->first()->value;
                        $secondprize= \App\Settings::where('name', 'races_prize_2nd')->first()->value;
                        $addbalance = number_format(($secondprize / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 7, '.', '');
                        
                    if($user->access == 'user') {
                        $user->balance(\App\Currency\Currency::find($balancetype))->add($addbalance, \App\Transaction::builder()->message('Races')->get()); 
                    }
            }
            elseif($i == 2) {
            $user = \App\User::where('_id', $entry->user)->first();
                        $balancetype = \App\Settings::where('name', 'races_prize_currency')->first()->value;
                        $thirdprize = \App\Settings::where('name', 'races_prize_3rd')->first()->value;
            $addbalance = number_format(($thirdprize / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 7, '.', '');

                    if($user->access == 'user') {
                        $user->balance(\App\Currency\Currency::find($balancetype))->add($addbalance, \App\Transaction::builder()->message('Races')->get()); 
                    }

            }
            else {
                        $user = \App\User::where('_id', $entry->user)->first();
                        $freespins = \App\Settings::where('name', 'races_prize_freespins')->first()->value;
                        $user->update(['freegames' => $freespins]);
            }
        }
    }
}