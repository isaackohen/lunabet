<?php

namespace App\Http\Controllers;

use App\Currency\Currency;
use App\User;
use App\Leaderboard;
use App\Http\Controllers\Api\WalletController;
use App\Races;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EvoController extends Controller

{
    private $system_id = '1103';
    private $secret_key = 'fedf17be1580355d1edc7206fac69083';
    private $version = '1';
    private $currency = 'USD';
    
    public function list()
    {
        $signature = $this->system_id.'*'.$this->version.'*'.$this->secret_key;
        $response = file_get_contents('http://api.production.games/Game/getList?project='.$this->system_id.'&version=1&signature='.md5($signature).'');
        return response($response)->header('Content-Type', 'application/json');
    }

    public function getBalance(Request $request)
     {
            $token = $request['token'];
            $currency = explode('-', $token);
            $currency = $currency[2];
            $playerId = explode('-', $token);
            $playerId = $playerId[1];

            $user = \App\User::where('_id', $playerId)->first();

            $balance = $user->balance(Currency::find($currency))->get();

        if ($currency == 'BTC' || $currency == 'btc') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 2, '.', ''));
        } elseif ($currency == 'doge' || $currency == "DOGE") {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarDoge()), 2, '.', ''));
        } elseif ($currency == 'trx' || $currency == 'TRX') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarTron()), 2, '.', ''));
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarLtc()), 2, '.', ''));
        } elseif ($currency == 'bch' || $currency == 'BCH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 2, '.', ''));
        } elseif ($currency == 'eth' || $currency == 'ETH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarEth()), 2, '.', ''));
        }
        

        return response()->json([

            'status' => 'ok',
            'data' => ([
                'balance' => $balanceA,
                'currency' => 'USD'    
            ])
        ]);
}
    

    
    public function bet(Request $request)
    {
            $token = $request['token'];
            $currency = explode('-', $token);
            $currency = $currency[2];
            $playerId = explode('-', $token);
            $playerId = $playerId[1];
            $gamedata = explode('-', $token);
            $gamedata = $gamedata[3];
            $reqdata = $request['data'];
            $amount = $reqdata['amount'];
            $roundid = $reqdata['round_id'];
            $user = \App\User::where('_id', $playerId)->first();
            $details = $reqdata['details'];
            $decodeddetails = json_decode($details);

       if ($currency == 'btc') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 8, '.', ''));
        } elseif ($currency == 'doge' || $currency == "DOGE") {
            $cryptoamount = number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarDoge()), 8, '.', '');
        } elseif ($currency == 'trx' || $currency == 'TRX') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 8, '.', ''));
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarLtc()), 8, '.', ''));
        } elseif ($currency == 'bch' || $currency == 'BCH') {            
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 8, '.', ''));
        } elseif ($currency == 'eth' || $currency == 'ETH') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 8, '.', ''));
        }
      
      if($user->balance(Currency::find($currency))->get() > floatval($cryptoamount) OR $decodeddetails->game_mode_code == '2') {
        $user->balance(Currency::find($currency))->subtract($cryptoamount);
        $balance = $user->balance(Currency::find($currency))->get();

        if ($currency == 'BTC' || $currency == 'btc') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 2, '.', ''));
        } elseif ($currency == 'doge' || $currency == "DOGE") {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarDoge()), 2, '.', ''));
        } elseif ($currency == 'trx' || $currency == 'TRX') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarTron()), 2, '.', ''));
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarLtc()), 2, '.', ''));
        } elseif ($currency == 'bch' || $currency == 'BCH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 2, '.', ''));
        } elseif ($currency == 'eth' || $currency == 'ETH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarEth()), 2, '.', ''));
        }

      if($decodeddetails->game_mode_code != '2') {

        $game = \App\Game::create([
            'id' => DB::table('games')->count() + 1,
            'user' => $user->id,
            'game' => 'evoplay',
            'wager' => (float) $cryptoamount,
            'status' => 'in-progress',
            'server_seed' => $roundid,
            'client_seed' => 0,
            'nonce' => $amount,
            'data' => $gamedata,
            'type' => 'quick',
            'currency' => strtolower($currency)
        ]);
}
        sleep(0.08);

        return response()->json([
            'status' => 'ok',
            'data' => ([
                'balance' => $balanceA,
                'currency' => 'USD'    
            ])
        ]);

      }    
    else {
        return response()->json([
            'status' => 'error',
            'error' => ([
                'scope' => "user",
                'no_refund' => "1",
                'message' => "Not enough money"
            ])
        ]);
    }
    }

    public function win(Request $request)
    {

            $token = $request['token'];
            $currency = explode('-', $token);
            $currency = $currency[2];
            $playerId = explode('-', $token);
            $playerId = $playerId[1];
            $reqdata = $request['data'];
            $amount = $reqdata['amount'];
            $roundid = $reqdata['round_id'];
            $details = $reqdata['details'];
            $decodeddetails = json_decode($details);

            $finalaction = $reqdata['final_action'];
            $user = \App\User::where('_id', $playerId)->first();
        if ($currency == 'btc') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 8, '.', ''));
        } elseif ($currency == 'doge' || $currency == "DOGE") {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarDoge()), 8, '.', ''));
        } elseif ($currency == 'trx' || $currency == 'TRX') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 8, '.', ''));
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarLtc()), 8, '.', ''));
        } elseif ($currency == 'bch' || $currency == 'BCH') {            
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 8, '.', ''));
        } elseif ($currency == 'eth' || $currency == 'ETH') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 8, '.', ''));
        }



        if ($decodeddetails->game_mode_code == '0') {
        $getwager = (\App\Game::where('user', $user->id)->where('server_seed', $roundid)->first()->wager);
        $getwagerdollar = (\App\Game::where('user', $user->id)->where('server_seed', $roundid)->first()->nonce);

        if($amount != 0) {
            $status = 'win';
            $multi = (float) number_format(($cryptoamount / $getwager), 2);
        } 
        else {
            $status = 'lose'; 
            $multi = 0;
        }
       if($game = \App\Game::where('user', $user->id)->where('server_seed', $roundid)->where('status', 'in-progress')->first()) {
                    $game->update([
                    'status' => $status,
                    'multiplier' => $multi,
                    'profit' => (float) number_format(($cryptoamount), 8)
                    ]);      
                    
                    if($finalaction == 1) {
                    event(new \App\Events\LiveFeedGame($game, 10));
                    Leaderboard::insert($game);

                if($multi < 0.95 || $multi > 1.25 && $getwagerdollar > 0.05) {
                Races::insert($game);


            if ((Currency::find($currency)->dailyminslots() ?? 0) <= $getwagerdollar) {
             if ($user->vipLevel() > 0 && ($user->weekly_bonus ?? 0) < 100) {
                $user->update([
                    'weekly_bonus' => ($user->weekly_bonus ?? 0) + 0.1
                ]);
               }
             }
            }
            }
            }
        }

        $user->balance(Currency::find($currency))->add($cryptoamount);
        $balance = $user->balance(Currency::find($currency))->get();
        if ($currency == 'BTC' || $currency == 'btc') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 2, '.', ''));
        } elseif ($currency == 'doge' || $currency == "DOGE") {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarDoge()), 2, '.', ''));
        } elseif ($currency == 'trx' || $currency == 'TRX') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarTron()), 2, '.', ''));
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarLtc()), 2, '.', ''));
        } elseif ($currency == 'bch' || $currency == 'BCH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 2, '.', ''));
        } elseif ($currency == 'eth' || $currency == 'ETH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarEth()), 2, '.', ''));
        }

        return response()->json([
            'status' => 'ok',
            'data' => ([
                'balance' => $balanceA,
                'currency' => 'USD'    
            ])
        ]);
    
    }

    public function refund(Request $request)
    {

            $token = $request['token'];
            $currency = explode('-', $token);
            $currency = $currency[2];
            $playerId = explode('-', $token);
            $playerId = $playerId[1];
            $reqdata = $request['data'];
            $amount = $reqdata['amount'];
            $user = \App\User::where('_id', $playerId)->first();
            $refundroundid = $reqdata['refund_round_id'];


        if ($currency == 'btc') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 8, '.', ''));
        } elseif ($currency == 'doge' || $currency == "DOGE") {
            $cryptoamount = number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarDoge()), 8, '.', '');
        } elseif ($currency == 'trx' || $currency == 'TRX') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarTron()), 8, '.', ''));
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarLtc()), 8, '.', ''));
        } elseif ($currency == 'bch' || $currency == 'BCH') {            
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 8, '.', ''));
        } elseif ($currency == 'eth' || $currency == 'ETH') {
            $cryptoamount = floatval(number_format(($amount / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 8, '.', ''));
        }

                   if($game = \App\Game::where('user', $user->id)->where('server_seed', $refundroundid)->where('client_seed', '0')->first()) {
                    $game->update([
                    'client_seed' => '1'
                    ]);      

                   // $user->balance(Currency::find($currency))->add($cryptoamount);
       }
        
        $balance = $user->balance(Currency::find($currency))->get();
        if ($currency == 'BTC' || $currency == 'btc') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtc()), 2, '.', ''));
        } elseif ($currency == 'doge' || $currency == "DOGE") {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarDoge()), 2, '.', ''));
        } elseif ($currency == 'trx' || $currency == 'TRX') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarTron()), 2, '.', ''));
        } elseif ($currency == 'ltc' || $currency == 'LTC') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarLtc()), 2, '.', ''));
        } elseif ($currency == 'bch' || $currency == 'BCH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()), 2, '.', ''));
        } elseif ($currency == 'eth' || $currency == 'ETH') {
                $balanceA = floatval(number_format(($balance * \App\Http\Controllers\Api\WalletController::rateDollarEth()), 2, '.', ''));
        }

        return response()->json([
            'status' => 'ok',
            'data' => ([
                'balance' => $balanceA,
                'currency' => 'USD'    
            ])
        ]);
    
    }

    public function seamless(Request $request)
    {
        //$content = json_encode($request->getContent());
        //Log::notice($content->token);

        //$content = json_decode($request->getContent());
        //Log::notice($content->token);
            Log::notice(json_encode($request->all()));


        if ($request['name'] === 'init') {
            return $this->getBalance($request);
        }
        elseif ($request['name'] === 'bet') {
            return $this->bet($request);
        }
        elseif ($request['name'] === 'win') {
            return $this->win($request);
        }
        elseif ($request['name'] === 'refund') {
            return $this->refund($request);
        }



 
    }

    
    public function game($slug)
    {
        
        $user = auth()->user();
        $unique = uniqid();
        $user = auth()->user();
        $currency = auth()->user()->clientCurrency()->id();


        if (strlen($slug) > 50)
        {
            return redirect('/');
        }
    
        $slugsanitize = preg_replace("/[\/\{\}\)\(\%#\$]/", "sanitize", $slug);
    
        if (!$user) 
        {
            return redirect('/');
        }
        $getevouid = (\App\Slotslist::where('_id', $slug)->first()->u_id);

        $token = $unique . '-' . $user->_id . '-' . $currency . '-' . $slug;
        $game = $getevouid;
        $args = [ 
                    $token, 
                    $game, 
                    [
                        $user->_id, 
                        'https://lunabet.io', //exit_url 
                        'https://lunabet.io', //cash_url
                        '1' //https
                    ], 
                    '1', //denomination
                    $this->currency, //currency
                    '1', //return_url_info
                    '2' //callback_version
                ]; 

        $evofreespinslot = \App\Settings::where('name', 'evoplay_freespin_slot')->first()->value;
        $evofreespinusd = \App\Settings::where('name', 'evoplay_freespin_usd')->first()->value;
        $bonustoken = $unique . '-' . $user->_id . '-' . 'eth' . '-' . $slug;
        $bonusarg = [ 
                    $bonustoken, 
                    $game, 
                    [
                        $user->freegames,
                        $evofreespinusd,
                        $user->_id, 
                        'https://lunabet.io', //exit_url 
                        'https://lunabet.io', //cash_url
                        '1' ////https
                    ], 
                    '1', //denomination
                    $this->currency, //currency
                    '1', //return_url_info
                    '2' //callback_version
                ]; 

        $signature = self::getSignature($this->system_id, $this->version, $args, $this->secret_key);
        $bonussignature = self::getSignature($this->system_id, $this->version, $bonusarg, $this->secret_key);

        if($user->freegames > 0 && $game == $evofreespinslot) {
        $response = json_decode(file_get_contents('http://api.production.games/Game/getURL?project='.$this->system_id.'&version=1&signature='.$bonussignature.'&token='.$bonustoken.'&game='.$evofreespinslot.'&settings[extra_bonuses][bonus_spins][spins_count]='.$user->freegames.'&settings[extra_bonuses][bonus_spins][bet_in_money]='.$evofreespinusd.'&settings[user_id]='.$user->_id.'&settings[exit_url]=https://lunabet.io&settings[cash_url]=https://lunabet.io&settings[https]=1&denomination=1&currency=USD&return_url_info=1&callback_version=2'), true);
        $user->update([
            'freegames' => 0
        ]);
    }   
    else {
        $response = json_decode(file_get_contents('http://api.production.games/Game/getURL?project='.$this->system_id.'&version=1&signature='.$signature.'&token='.$token.'&game='.$game.'&settings[user_id]='.$user->_id.'&settings[exit_url]=https://lunabet.io&settings[cash_url]=https://lunabet.io&settings[https]=1&denomination=1&currency=USD&return_url_info=1&callback_version=2'), true);

    }

        $url = $response['data']['link'];
        $view = view('evoplay')->with('url', $url);
        return view('layouts.app')->with('page', $view);
    }

    public function getSignature($system_id, $version, array $args, $secret_key)
    {
        $md5 = array();
                $md5[] = $system_id;
                $md5[] = $version;
                foreach ($args as $required_arg) {
                        $arg = $required_arg;
                        if(is_array($arg)){
                                if(count($arg)) {
                                        $recursive_arg = '';
                                        array_walk_recursive($arg, function($item) use (& $recursive_arg) { if(!is_array($item)) { $recursive_arg .= ($item . ':');} });
                                        $md5[] = substr($recursive_arg, 0, strlen($recursive_arg)-1); // get rid of last colon-sign
                                } else {
                                $md5[] = '';
                                }
                        } else {
                $md5[] = $arg;
                }
        };
        $md5[] = $secret_key;
        $md5_str = implode('*', $md5);
        $md5 = md5($md5_str);
        return $md5;
    }
    
}
