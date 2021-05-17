<?php namespace App\WebSocket;

use App\Currency\Currency;
use App\Games\Kernel\Data;
use App\Games\Kernel\Game;
use App\User;
use App\DisabledGamesReff;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PlayWhisper extends WebSocketWhisper {

    public function event(): string {
        return "Play";
    }

    public function process($data): array {
        $game = Game::find($data->api_id);
        if($game == null) return reject(-3, 'Unknown API game id');
        if($game->isDisabled()) return reject(-5, 'Game is disabled');
        if($this->user != null && !$game->ignoresMultipleClientTabs() && DB::table('games')->where('game', $data->api_id)->where('user', $this->user->_id)->where('status', 'in-progress')->count() > 0) return reject(-8, 'Game already has started');

        if($this->user == null && !$data->demo) return reject(-2, 'Not authorized');
        if($this->user == null && $data->demo) return reject(-2, 'Please login to play');
        if(!$game->usesCustomWagerCalculations() && floatval($data->bet) < Currency::find($data->currency)->option('min_bet')) return reject(-1, 'Invalid wager value');
		if(!$game->usesCustomWagerCalculations() && floatval($data->bet) > Currency::find($data->currency)->option('max_bet')) return reject(-9, 'Invalid wager value');
        if($this->user != null && ($this->user->balance(Currency::find($data->currency))->demo($data->demo)->get() < floatval($data->bet))) return reject(-4, 'Not enough money');

        $currencyOld = $data->currency;
        $data = new Data($this->user, [
            'api_id' => $data->api_id,
            'bet' => $data->bet,
            'currency' => $data->currency,
            'demo' => $data->demo,
            'quick' => $data->quick,
            'data' => (array) $data->data
        ]);

/**
if(!$game->isDisabledReff()) {

        if ($this->user != null && $this->user->vipLevel() > 0 && $this->user->referral != null) {
            $referrer = \App\User::where('_id', $this->user->referral)->first();
            $currency = $data->currency;
            $balance = $data->bet();

            if ($currency == 'BTC' || $currency == 'btc') {
                $balanceB = (int) ((((string) $balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtc()) * 100);
            } elseif ($currency == 'doge' || $currency == "DOGE") {
                $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarDoge()) * 0);
            } elseif ($currency == 'trx' || $currency == 'TRX') {
                $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarTron()) * 100);
            } elseif ($currency == 'ltc' || $currency == 'LTC') {
                $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarLtc()) * 100);
            } elseif ($currency == 'bch' || $currency == 'BCH') {
                $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarBtcCash()) * 100);
            } elseif ($currency == 'eth' || $currency == 'ETH') {
                $balanceB = (int)((((string)$balance) * \App\Http\Controllers\Api\WalletController::rateDollarEth()) * 0);
            }
            $if($balanceB > floatval(Currency::find($data->currency)->dailyminbet()) {
            $balanceC = $balanceB * 0.0009;
            if ($referrer->referral_balance_usd === "" OR $referrer->referral_balance_usd === null) {
                $referrer->referral_balance_usd = 0;
            }
            $referrer->referral_balance_usd = $referrer->referral_balance_usd + $balanceC;
            $referrer->save();

        }
}
        if($this->user != null && $this->user->referral != null && $this->user->vipLevel() > 0 && floatval($data->bet) > Currency::find($data->currency)->dailyminbet() && $this->user->games() >= floatval(\App\Settings::where('name', 'referrer_activity_requirement')->first()->value)) {
            $referrer = \App\User::where('_id', $this->user->referral)->first();
            $referrals = $referrer->referral_wager_obtained ?? [];
            if(!in_array($this->user->_id, $referrals)) {
                array_push($referrals, $this->user->_id);
                $referrer->update(['referral_wager_obtained' => $referrals]);
            }
        }
*/

        if($this->user != null && $this->user->vipLevel() > 0 && $this->user->vip_discord_notified == null) {
            $this->user->notify(new \App\Notifications\VipDiscordNotification());
            $this->user->update(['freegames' => '15']);
            $this->user->update(['vip_discord_notified' => true]);
        }

        return $game->process($data);
    }

}
