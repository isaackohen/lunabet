<?php

namespace App\Console\Commands;

use App\Chat;
use App\Leaderboard;
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

class VIPlevel extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datagamble:vipupdate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adds VIP level';

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
        $emeraldvip = \App\Settings::where('name', 'emeraldvip')->first()->value;
        $rubyvip = \App\Settings::where('name', 'rubyvip')->first()->value;
        $goldvip = \App\Settings::where('name', 'goldvip')->first()->value;
        $platinumvip = \App\Settings::where('name', 'platinumvip')->first()->value;
        $diamondvip = \App\Settings::where('name', 'diamondvip')->first()->value;


        foreach (\App\Leaderboard::where('type', 'today')->where('currency', 'usd')->orderBy('user', 'desc')->get() as $leaderboards) {
        $user = \App\User::where('_id', $leaderboards->user)->first();
        $wageredfloat = floatval(number_format($leaderboards->usd_wager, 2, '.', ''));

        if ($wageredfloat > $diamondvip && $user->viplevel == '4') {
            $user->update(['viplevel' => '5']);
        }

        if ($wageredfloat > $platinumvip || $diamondvip < $rubyvip && $user->viplevel == '3') {
            $user->update(['viplevel' => '4']);
        }

        if ($wageredfloat > $goldvip || $platinumvip < $rubyvip && $user->viplevel == '2') {
            $user->update(['viplevel' => '3']);
        }

        if ($wageredfloat > $rubyvip || $goldvip < $rubyvip && $user->viplevel == '1') {
            $user->update(['viplevel' => '2']);
        }

        if ($wageredfloat > $emeraldvip || $wageredfloat < $rubyvip && $user->viplevel == '0') {
            $user->update(['viplevel' => '1']);
        }

    }
}
}