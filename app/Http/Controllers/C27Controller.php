<?php

namespace App\Http\Controllers;

use App\Currency\Currency;
use App\User;
use App\Leaderboard;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\WalletController;
use App\Races;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use outcomebet\casino25\api\client\Client;

class C27Controller extends Controller
{
    /** @var Client */
    protected $client;

    /**
     * C27Controller constructor.
     * @throws \outcomebet\casino25\api\client\Exception
     */
    public function __construct()
    {
        $this->client = new Client(array(
            'url' => 'https://api.c27.games/v1/',
            'sslKeyPath' => env('c27_path'),
        ));
        $this->client->mascot = new Client(array(
            'url' => 'https://api.mascot.games/v1/',
            'sslKeyPath' => env('mascot_path'),
        ));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function seamless(Request $request)
    {
        $content = json_decode($request->getContent());

        //Log::critical($content->method);
        //die;
        if ($content->method === 'getBalance') {
            return $this->getBalance($request);
        } elseif ($content->method === 'withdrawAndDeposit') {
            return $this->withdrawAndDeposit($request);
        } elseif ($content->method === 'rollbackTransaction') {
            return response()->json([
                'result' => (json_decode ("{}")),
                'id' => $content->id,
                'jsonrpc' => '2.0'
            ]);
        } else {
            return response()->json([
                'result' => (json_decode ("{}")),
                'id' => $content->id,
                'jsonrpc' => '2.0'
            ]);
        }
    }

    /**
     * @param $slug
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector|\Illuminate\View\View
     */
    public function provider($slug)
    {
        $user = auth()->user();

        if (strlen($slug) > 50){
            return redirect('/');
        }

        $sanitize = preg_replace("/[\/\{\}\)\(\%#\$]/", "sanitize", $slug);


        $url = $sanitize;
        $view = view('provider')->with('url', $url);
        return view('layouts.app')->with('page', $view);
    }


    /**
     * @param $slug
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector|\Illuminate\View\View
     */
    public function game($slug)
    {
        $user = auth()->user();
        $freespinslot = \App\Settings::where('name', 'freespin_slot')->first()->value;

        if (strlen($slug) > 50){
            return redirect('/');
        }

        $slugsanitize = preg_replace("/[\/\{\}\)\(\%#\$]/", "sanitize", $slug);

        if (!$user) {
            return redirect('/');
        }
        if(\App\RecentSlots::where('user_id', $user->id)->where('s', $slugsanitize)->first() == null) {
                \App\RecentSlots::create([
                'user_id' => $user->id, 's' => $slugsanitize, 'b' => 0,
            ]);
        }

            $provider = \App\Slotslist::where('_id', $slugsanitize)->first()->p;
            if($provider == 'mascot') {

                $this->client->mascot->setPlayer(['Id' => $user->id . '-' . auth()->user()->clientCurrency()->id() . '-lunabetplayer' , 'BankGroupId' => 'lunabet']);
                usleep(11000);
                $game = $this->client->mascot->createSession(
                [
                    'GameId' => $slugsanitize,
                    'PlayerId' => $user->id . '-' . auth()->user()->clientCurrency()->id() . '-lunabetplayer',
                    'AlternativeId' => time() . '_' . $user->id . '_' . auth()->user()->clientCurrency()->id(),
                    'RestorePolicy' => 'Last'
                ]
            );
                        if($user->freegames > 0 && $slugsanitize == $freespinslot) {
        $url = $game['SessionUrl'] . '/?' . $slugsanitize;
        }
        else {

        $url = $game['SessionUrl'] . '/?' . $slugsanitize;
        }
        $view = view('c27')->with('data', $game)->with('url', $url);

} else {

        if($slugsanitize == $freespinslot && $user->freegames > 0) {

       if(auth()->user()->access == 'moderator') {
            $this->client->setPlayer(['Id' => $user->id . '-' . 'eth' . '-lunabetstreamer' , 'BankGroupId' => 'bits_streamers']);
                                    usleep(11000);
            $this->client->setBonus([   
                    'Id' => 'shared',   
                    'FsType' => 'original', 
                    'CounterType' => 'shared',  
                    'SharedParams' => [ 
                        'Games' => [    
                            $slug => [  
                                'FsCount' => auth()->user()->freegames, 
                            ]   
                        ]   
                    ]   
                ]);      
             $game = $this->client->createSession(   
                [   
                    'GameId' => $slugsanitize,  
                    'BonusId' => 'shared',
                    'StaticHost' => 'static.respin.sh',
                    'PlayerId' => $user->id . '-' . 'eth' . '-lunabetstreamer',  
                    'AlternativeId' => time() . '_' . $user->id . '_' . 'eth', 
                    'Params' => [   
                        'freeround_bet' => 1    
                    ],  
                    'RestorePolicy' => 'Create'
                ]   
             );  
             }

        else {
             $this->client->setPlayer(['Id' => $user->id . '-' . 'eth' . '-lunabetplayer' , 'BankGroupId' => 'lunabet']);
             usleep(11000);
        $this->client->setBonus([   
                    'Id' => 'shared',   
                    'FsType' => 'original', 
                    'StaticHost' => 'static.respin.sh',
                    'CounterType' => 'shared',  
                    'SharedParams' => [ 
                        'Games' => [    
                            $slugsanitize => [  
                                'FsCount' => auth()->user()->freegames, 
                            ]   
                        ]   
                    ]   
                ]);      
         $game = $this->client->createSession(   
                [   
                    'GameId' => $slugsanitize,  
                    'BonusId' => 'shared',  
                    'PlayerId' => $user->id . '-' . 'eth' . '-lunabetplayer',  
                    'AlternativeId' => time() . '_' . $user->id . '_' . 'eth', 
                    'Params' => [   
                        'freeround_bet' => 1    
                    ],  
                    'RestorePolicy' => 'Create'
                ]   
            );  
        }
        }
        else
        {
       if(auth()->user()->access == 'moderator') {
            $this->client->setPlayer(['Id' => $user->id . '-' . auth()->user()->clientCurrency()->id() . '-lunabetstreamer' , 'BankGroupId' => 'bits_streamers']);
                                    usleep(11000);
            $game = $this->client->createSession(
                [
                    'GameId' => $slugsanitize,
                    'StaticHost' => 'static.respin.sh',
                    'PlayerId' => $user->id . '-' . auth()->user()->clientCurrency()->id() . '-lunabetstreamer',
                    'AlternativeId' => time() . '_' . $user->id . '_' . auth()->user()->clientCurrency()->id(),
                    'RestorePolicy' => 'Last'
                ]
            );
             }

            else {
                $this->client->setPlayer(['Id' => $user->id . '-' . auth()->user()->clientCurrency()->id() . '-lunabetplayer' , 'BankGroupId' => 'lunabet']);
        usleep(11000);
                $game = $this->client->createSession(
                [
                    'GameId' => $slugsanitize,
                    'StaticHost' => 'static.respin.sh',
                    'PlayerId' => $user->id . '-' . auth()->user()->clientCurrency()->id() . '-lunabetplayer',
                    'AlternativeId' => time() . '_' . $user->id . '_' . auth()->user()->clientCurrency()->id(),
                    'RestorePolicy' => 'Last'
                ]
            );
        }
        }
        if($user->freegames > 0 && $slugsanitize == $freespinslot) {
        $url = 'https://' . $game['SessionId'] . '.spins.sh/?' . $slugsanitize;
        }
        else {

        $url = 'https://' . $game['SessionId'] . '.spins.sh/?' . $slugsanitize;
        }
        $view = view('c27')->with('data', $game)->with('url', $url);
}

        usleep(150000);
        return view('layouts.app')->with('page', $view);
        

    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function withdrawAndDeposit(Request $request)
    {
        $content = json_decode($request->getContent());
        $sessionAlternativeId = $content->params->sessionAlternativeId;
        $currency = explode('_', $sessionAlternativeId);
        $currency = $currency[2];
        $playerName = explode('-', $content->params->playerName);
        $user = $this->getUser($playerName[0]);
        if(\App\Statistics::where('_id', $user->id)->first() == null) {
            $a = \App\Statistics::create([
                '_id' => $user->id, 'bets_btc' => 0, 'wins_btc' => 0, 'loss_btc' => 0, 'wagered_btc' => 0, 'profit_btc' => 0, 'bets_eth' => 0, 'wins_eth' => 0, 'loss_eth' => 0, 'wagered_eth' => 0, 'profit_eth' => 0, 'bets_ltc' => 0, 'wins_ltc' => 0, 'loss_ltc' => 0, 'wagered_ltc' => 0, 'profit_ltc' => 0, 'bets_doge' => 0, 'wins_doge' => 0, 'loss_doge' => 0, 'wagered_doge' => 0, 'profit_doge' => 0, 'bets_bch' => 0, 'wins_bch' => 0, 'loss_bch' => 0, 'wagered_bch' => 0, 'profit_bch' => 0, 'bets_trx' => 0, 'wins_trx' => 0, 'loss_trx' => 0, 'wagered_trx' => 0, 'profit_trx' => 0
            ]);
        }

        $stats = \App\Statistics::where('_id', $user->id)->first();
        $balance = $user->balance(Currency::find($currency))->get();    
        if ($user->freegames > 0) {   
            if (($user->freegames - $content->params->chargeFreerounds) > 0) {  
                $user->freegames = $user->freegames - $content->params->chargeFreerounds;   
                $user->freegames_balance = $user->freegames_balance + $content->params->deposit;    
                $user->save();  
                return response()->json([   
                    'result' => [   
                        'newBalance' => (int) ($user->freegames_balance),   
                        'transactionId' => $content->params->transactionRef,    
                        'freeroundsLeft' => $user->freegames    
                    ],  
                    'id' => $content->id,   
                    'jsonrpc' => '2.0'  
                ]);
                } else {    
                $content->params->deposit = $user->freegames_balance;   
                $user->freegames = 0;   
                $user->freegames_balance = 0;   
                $user->save();  
            }   
        } else if ($user->freegames_balance > 0) {  
            $content->params->deposit = $user->freegames_balance;   
            $user->freegames_balance = 0;   
            $user->save();  
        }

        if ($currency == 'BTC' || $currency == 'btc') {
            $balanceB = (int) ((((string) $balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtc()) * 100);
        } elseif ($currency == 'doge' || $currency == "DOGE") {
            $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarDoge()) * 100);
        } elseif ($currency == 'trx' || $currency == 'TRX') {
            $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarTron()) * 100);
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
            $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarLtc()) * 100);
        } elseif ($currency == 'bch' || $currency == 'BCH') {
            $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()) * 100);
        } elseif ($currency == 'eth' || $currency == 'ETH') {
            $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarEth()) * 100);
        }

        if ($currency == 'btc') {
            $subtract = bcdiv($content->params->withdraw, \App\Http\Controllers\Api\WalletController::rateDollarBtc() * 100, 8);
            $add = bcdiv($content->params->deposit, \App\Http\Controllers\Api\WalletController::rateDollarBtc() * 100, 8);

        } elseif ($currency == 'doge' || $currency == "DOGE") {
            $subtract = bcdiv($content->params->withdraw, \App\Http\Controllers\Api\WalletController::rateDollarDoge() * 100, 8);
            $add = bcdiv($content->params->deposit, \App\Http\Controllers\Api\WalletController::rateDollarDoge() * 100, 8);
        } elseif ($currency == 'trx' || $currency == 'TRX') {
            $subtract = bcdiv($content->params->withdraw, \App\Http\Controllers\Api\WalletController::rateDollarTron() * 100, 8);
            $add = bcdiv($content->params->deposit, \App\Http\Controllers\Api\WalletController::rateDollarTron() * 100, 8);
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
            $subtract = bcdiv($content->params->withdraw, \App\Http\Controllers\Api\WalletController::rateDollarLtc() * 100, 8);
            $add = bcdiv($content->params->deposit, \App\Http\Controllers\Api\WalletController::rateDollarLtc() * 100, 8);
        } elseif ($currency == 'bch' || $currency == 'BCH') {
            $subtract = bcdiv($content->params->withdraw, \App\Http\Controllers\Api\WalletController::rateDollarBtcCash() * 100, 8);
            $add = bcdiv($content->params->deposit, \App\Http\Controllers\Api\WalletController::rateDollarBtcCash() * 100, 8);
        } elseif ($currency == 'eth' || $currency == 'ETH') {
            $subtract = bcdiv($content->params->withdraw, \App\Http\Controllers\Api\WalletController::rateDollarEth() * 100, 8);
            $add = bcdiv($content->params->deposit, \App\Http\Controllers\Api\WalletController::rateDollarEth() * 100, 8);
        }

        if($user->freegames < 1) {
            $user->balance(Currency::find($currency))->subtract($subtract, json_decode($request->getContent(), true));
        }
            $user->balance(Currency::find($currency))->add($add, json_decode($request->getContent(), true));

        $balance = $user->balance(Currency::find($currency))->get();
        if ($currency == 'BTC' || $currency == 'btc') {
            $balance = (int) ((((string) $balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtc()) * 100);
        } elseif ($currency == 'doge' || $currency == "DOGE") {
            $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarDoge()) * 100);
        } elseif ($currency == 'trx' || $currency == 'TRX') {
            $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarTron()) * 100);
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
            $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarLtc()) * 100);
        } elseif ($currency == 'bch' || $currency == 'BCH') {
            $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()) * 100);
        } elseif ($currency == 'eth' || $currency == 'ETH') {
            $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarEth()) * 100);
        }

        if ($add > 0) {
            $status = 'win';
        } else {
            $status = 'loss';
        }

        if ($subtract != 0) {
            $multi = (float) number_format(($add / $subtract), 2);
        } else {
            $multi = 0;
        }

        $profit = (float) $add - $subtract;



        if($currency == 'doge'){
            $usd_wager = floatval(number_format($subtract * WalletController::rateDollarDoge(), 2, '.', ''));
            $stats->update([
                'bets_doge' => $stats->bets_doge + 1,
                'wins_doge' => $stats->wins_doge + ($profit > 0 ? ($multi < 1 ? 0 : 1) : 0),
                'loss_doge' => $stats->loss_doge + ($profit > 0 ? ($multi < 1 ? 1 : 0) : 1),
                'wagered_doge' => $stats->wagered_doge + $subtract,
                'profit_doge' => $stats->profit_doge + ($profit > 0 ? ($multi < 1 ? -($subtract) : ($profit)) : -($subtract))
            ]);
        }

        if($currency == 'btc'){
            $usd_wager = floatval(number_format($subtract * WalletController::rateDollarBtc(), 2, '.', ''));
            $stats->update([
                'bets_btc' => $stats->bets_btc + 1,
                'wins_btc' => $stats->wins_btc + ($profit > 0 ? ($multi < 1 ? 0 : 1) : 0),
                'loss_btc' => $stats->loss_btc + ($profit > 0 ? ($multi < 1 ? 1 : 0) : 1),
                'wagered_btc' => $stats->wagered_btc + $subtract,
                'profit_btc' => $stats->profit_btc + ($profit > 0 ? ($multi < 1 ? -($subtract) : ($profit)) : -($subtract))
            ]);
        }

        if($currency == 'eth'){
            $usd_wager = floatval(number_format($subtract * WalletController::rateDollarEth(), 2, '.', ''));
            $stats->update([
                'bets_eth' => $stats->bets_eth + 1,
                'wins_eth' => $stats->wins_eth + ($profit > 0 ? ($multi < 1 ? 0 : 1) : 0),
                'loss_eth' => $stats->loss_eth + ($profit > 0 ? ($multi < 1 ? 1 : 0) : 1),
                'wagered_eth' => $stats->wagered_eth + $subtract,
                'profit_eth' => $stats->profit_eth + ($profit > 0 ? ($multi < 1 ? -($subtract) : ($profit)) : -($subtract))
            ]);
        }

        if($currency == 'ltc'){
            $usd_wager = floatval(number_format($subtract * WalletController::rateDollarLtc(), 2, '.', ''));
            $stats->update([
                'bets_ltc' => $stats->bets_ltc + 1,
                'wins_ltc' => $stats->wins_ltc + ($profit > 0 ? ($multi < 1 ? 0 : 1) : 0),
                'loss_ltc' => $stats->loss_ltc + ($profit > 0 ? ($multi < 1 ? 1 : 0) : 1),
                'wagered_ltc' => $stats->wagered_ltc + $subtract,
                'profit_ltc' => $stats->profit_ltc + ($profit > 0 ? ($multi < 1 ? -($subtract) : ($profit)) : -($subtract))
            ]);
        }

        if($currency == 'bch'){
            $usd_wager = floatval(number_format($subtract * WalletController::rateDollarBtcCash(), 2, '.', ''));
            $stats->update([
                'bets_bch' => $stats->bets_bch + 1,
                'wins_bch' => $stats->wins_bch + ($profit > 0 ? ($multi < 1 ? 0 : 1) : 0),
                'loss_bch' => $stats->loss_bch + ($profit > 0 ? ($multi < 1 ? 1 : 0) : 1),
                'wagered_bch' => $stats->wagered_bch + $subtract,
                'profit_bch' => $stats->profit_bch + ($profit > 0 ? ($multi < 1 ? -($subtract) : ($profit)) : -($subtract))
            ]);
        }

        if($currency == 'trx'){
            $usd_wager = floatval(number_format($subtract * WalletController::rateDollarTron(), 2, '.', ''));
            $stats->update([
                'bets_trx' => $stats->bets_trx + 1,
                'wins_trx' => $stats->wins_trx + ($profit > 0 ? ($multi < 1 ? 0 : 1) : 0),
                'loss_trx' => $stats->loss_trx + ($profit > 0 ? ($multi < 1 ? 1 : 0) : 1),
                'wagered_trx' => $stats->wagered_trx + $subtract,
                'profit_trx' => $stats->profit_trx + ($profit > 0 ? ($multi < 1 ? -($subtract) : ($profit)) : -($subtract))
            ]);
        }
        $game = \App\Game::create([
            'id' => DB::table('games')->count() + 1,
            'user' => $user->id,
            'game' => 'slotmachine',
            'wager' => (float) $subtract,
            'multiplier' => $multi,
            'status' => $status,
            'profit' => $profit,
            'server_seed' => $content->params->transactionRef,
            'client_seed' => $content->params->transactionRef,
            'nonce' => '',
            'data' => json_decode($request->getContent(), true),
            'type' => 'quick',
            'balance-before' => number_format($balanceB/100, 2, '.', ''),
            'balance-after' => number_format($balance/100, 2, '.', ''),
            'currency' => strtolower($currency)
        ]);
        event(new \App\Events\LiveFeedGame($game, 10));


            Leaderboard::insert($game);
            if($usd_wager > floatval(0.05)) {
            if($multi < 0.95 || $multi > 1.25) {
                Races::insert($game);


            if ((Currency::find($currency)->dailyminslots() ?? 0) <= $subtract) {
             if ($user->vipLevel() > 0 && ($user->weekly_bonus ?? 0) < 100) {
                $user->update([
                    'weekly_bonus' => ($user->weekly_bonus ?? 0) + 0.1
                ]);
               }
             }
            }
        }

        return response()->json([
            'result' => [
                'newBalance' => $balance,
                'transactionId' => $content->params->transactionRef,
            ],
            'id' => $content->id,
            'jsonrpc' => '2.0'
        ]);
    }

    public function getBalance(Request $request)
    {
        usleep(12000);
        try {
            $content = json_decode($request->getContent());

            $sessionAlternativeId = $content->params->sessionAlternativeId;

            $currency = explode('_', $sessionAlternativeId);
            $currency = $currency[2];


            $playerName = explode('-', $content->params->playerName);

            $user = $this->getUser(strtolower($playerName[0]));

            $balance = $user->balance(Currency::find($currency))->get();

            if ($currency == 'BTC' || $currency == 'btc') {
                $balance = (int) ((((string) $balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtc()) * 100);
            } elseif ($currency == 'doge' || $currency == "DOGE") {
                $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarDoge()) * 100);
            } elseif ($currency == 'trx' || $currency == 'TRX') {
                $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarTron()) * 100);
            } elseif ($currency == 'ltc' || $currency == 'LTC') {
                $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarLtc()) * 100);
            } elseif ($currency == 'bch' || $currency == 'BCH') {
                $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()) * 100);
            } elseif ($currency == 'eth' || $currency == 'ETH') {
                $balance = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarEth()) * 100);
            }
        } catch (\Error $e) {
            $balance = 0;
        }
        $freegames = 0;
        if ($user->freegames > 0 ) {
            $freegames = $user->freegames;
            $balance = (int) $user->freegames_balance;
        }
        return response()->json([
            'result' => ([
                'balance' => $balance,
                'freeroundsLeft' => (int) $freegames
            ]),
            'id' => $content->id,
            'jsonrpc' => '2.0'
        ]);
    }
    public function getUser($playerName): User
    {
        return User::findOrFail($playerName);
    }
}
