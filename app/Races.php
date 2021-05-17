<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;
use App\Utils\Exception\UnsupportedOperationException;
use Carbon\Carbon;
use App\Currency\Currency;
use App\Http\Controllers\Api\WalletController;

class Races extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'races';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type', 'currency', 'wager', 'profit', 'usd_wager', 'usd_profit', 'bets', 'time', 'user'
    ];

    public static function insert(Game $game) {
        if($game->status === 'in-progress' || $game->status === 'cancelled' || $game->demo) return;

        self::insertGame('today', $game);
        self::insertGame('all', $game);
    }

    private static function insertGame($type, Game $game) {
        $currency = Currency::find($game->currency);

        $entry = Races::where('type', $type)->where('currency', $currency->id())->where('user', $game->user)->where('time', self::toTime($type))->first();
		
		$entryusd = Races::where('type', $type)->where('currency', 'usd')->where('user', $game->user)->where('time', self::toTime($type))->first();
		
		if($game->currency == 'btc'){
		$usd_wager = $game->wager * WalletController::rateDollarBtc();
		$usd_profit= $game->profit * WalletController::rateDollarBtc();
		}
		if($game->currency == 'eth'){
		$usd_wager = $game->wager * WalletController::rateDollarEth();
		$usd_profit= $game->profit * WalletController::rateDollarEth();
		}
		if($game->currency == 'ltc'){
		$usd_wager = $game->wager * WalletController::rateDollarLtc();
		$usd_profit= $game->profit * WalletController::rateDollarLtc();
		}
		if($game->currency == 'doge'){
		$usd_wager = $game->wager * WalletController::rateDollarDoge();
		$usd_profit= $game->profit * WalletController::rateDollarDoge();
		}
		if($game->currency == 'bch'){
		$usd_wager = $game->wager * WalletController::rateDollarBtcCash();
		$usd_profit= $game->profit * WalletController::rateDollarBtcCash();
		}
		if($game->currency == 'trx'){
		$usd_wager = $game->wager * WalletController::rateDollarTron();
		$usd_profit= $game->profit * WalletController::rateDollarTron();
		}
		
		
		if(!$entry) {
            Races::create([
                'type' => $type,
                'currency' => $currency->id(),
                'wager' => $game->wager,
                'profit' => $game->profit,
				'bets' => 1,
                'time' => self::toTime($type),
                'user' => $game->user
            ]);
				if(!$entryusd) {
					Races::create([
						'type' => $type,
						'currency' => 'usd',
						'usd_wager' => $usd_wager, 
						'usd_profit' => $usd_profit,
						'bets' => 1,
						'time' => self::toTime($type),
						'user' => $game->user
					]);
					return;
				}
				$entryusd->update([
					'usd_wager' => $entryusd->usd_wager + $usd_wager,
					'usd_profit' => $entryusd->usd_profit + $usd_profit,
					'bets' => $entryusd->bets + 1
				]);
			return;	
        }
		
		$entryusd->update([
            'usd_wager' => $entryusd->usd_wager + $usd_wager,
            'usd_profit' => $entryusd->usd_profit + $usd_profit,
			'bets' => $entryusd->bets + 1
        ]);

        $entry->update([
            'wager' => $entry->wager + $game->wager,
            'profit' => $entry->profit + $game->profit,
			'bets' => $entry->bets + 1
        ]);
    }

    /**
     * @param $positions
     * @param string $type today|all
     * @param string $currency
     * @param string $orderBy wager|profit
     * @return array
     */
    public static function getLeaderboardByCurrency($positions, string $type, \App\Currency\Currency $currency, string $orderBy = 'wager'): array {
        $result = [];
		if(Races::where('type', $type)->first() == null) return reject(2, 'Invalid type');
        foreach(Races::where('type', $type)->where('currency', $currency->id())->where('time', self::toTime($type))->orderBy($orderBy, 'desc')->take($positions)->get() as $entry) {
            array_push($result, [
                'entry' => $entry->toArray(),
                'user' => User::where('_id', $entry->user)->first()->toArray()
            ]);
        }
        return $result;
    }
	
	public static function getLeaderboardByUsd($positions, string $type, string $orderBy = 'wager'): array {
        $result = [];
		if(Races::where('type', $type)->first() == null) return reject(2, 'Invalid type');
        foreach(Races::where('type', $type)->where('currency', 'usd')->where('time', self::toTime($type))->orderBy($orderBy, 'desc')->take($positions)->get() as $entry) {
            array_push($result, [
                'entry' => $entry->toArray(),
                'user' => User::where('_id', $entry->user)->first()->toArray()
            ]);
        }
        return $result;
    }

    private static function toTime($type) {
        switch ($type) {
            case 'today': $mark = Carbon::today()->timestamp; break;
            case 'all': $mark = Carbon::minValue()->timestamp; break;
            default: throw new UnsupportedOperationException('Invalid leaderboard type: '.$type);
        }

        return $mark;
    }

}
