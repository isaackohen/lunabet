<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Statistics extends Model
{
	
	    protected $connection = 'mongodb';
		protected $collection = 'user_statistics';
		    
		protected $fillable = [
            '_id', 'bets_btc', 'wins_btc', 'loss_btc', 'wagered_btc', 'profit_btc', 'bets_eth', 'wins_eth', 'loss_eth', 'wagered_eth', 'profit_eth', 'bets_ltc', 'wins_ltc', 'loss_ltc', 'wagered_ltc', 'profit_ltc', 'bets_doge', 'wins_doge', 'loss_doge', 'wagered_doge', 'profit_doge', 'bets_bch', 'wins_bch', 'loss_bch', 'wagered_bch', 'profit_bch', 'bets_trx', 'wins_trx', 'loss_trx', 'wagered_trx', 'profit_trx'
		];
}
