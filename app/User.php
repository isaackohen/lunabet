<?php

namespace App;

use App\Currency\Currency;
use App\Http\Controllers\Api\WalletController;
use App\Events\BalanceModification;
use App\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use MongoDB\BSON\Decimal128;
use NotificationChannels\WebPush\HasPushSubscriptions;
use RobThree\Auth\TwoFactorAuth;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends \Jenssegers\Mongodb\Auth\User implements JWTSubject {

    use Notifiable, HasPushSubscriptions;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'avatar', 'access', 'client_seed', 'vip_discord_notified',
        'bonus_claim', 'stickers', 'private_profile', 'private_bets', 'name_history', 'latest_activity',
        'discord_bonus', 'notification_bonus', 'ban', 'mute', 'weekly_bonus', 'weekly_bonus_obtained', 'jwt',
        'tfa', 'tfa_enabled', 'tfa_persistent_key', 'tfa_onetime_key', 'email_notified', 'dismissed_global_notifications',
        'vk', 'fb', 'google', 'discord', 'register_ip', 'login_ip', 'register_multiaccount_hash', 'login_multiaccount_hash',
        'referral', 'referral_wager_obtained', 'referral_bonus_obtained', 'promocode_limit_reset', 'promocode_limit', 

        'btc', 'ltc', 'eth', 'doge', 'bch', 'trx',
        'demo_btc', 'demo_ltc', 'demo_eth', 'demo_doge', 'demo_bch', 'demo_trx',
        'wallet_btc', 'wallet_ltc', 'wallet_eth', 'wallet_doge', 'wallet_bch', 'wallet_trx',
        'wallet_trx_private_key', 'freegames', 'freegames_balance', 'referral_balance_usd', 'agm', 'bo1'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'email', 'stickers', 'ban', 'mute',
        'vk', 'fb', 'google', 'discord', 'discord_bonus', 'notification_bonus', 'latest_activity',
        'tfa', 'tfa_enabled', 'tfa_persistent_key', 'tfa_onetime_key', 'email_notified', 'dismissed_global_notifications',
        'register_ip', 'login_ip', 'register_multiaccount_hash', 'login_multiaccount_hash', 'vip_discord_notified',
        'referral', 'referral_wager_obtained', 'referral_bonus_obtained', 'promocode_limit_reset', 'promocode_limit',

        'btc', 'ltc', 'eth', 'doge', 'bch', 'trx',
        'demo_btc', 'demo_ltc', 'demo_eth', 'demo_doge', 'demo_bch', 'demo_trx',
        'wallet_btc', 'wallet_ltc', 'wallet_eth', 'wallet_doge', 'wallet_bch', 'wallet_trx',
        'wallet_trx_private_key', 'agm', 'bo1'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'bonus_claim' => 'datetime',
        'mute' => 'datetime',
        'latest_activity' => 'datetime',
        'promocode_limit_reset' => 'datetime',
        'tfa_persistent_key' => 'datetime',
        'tfa_onetime_key' => 'datetime',
        'stickers' => 'json',
        'name_history' => 'json',
        'referral_wager_obtained' => 'json'
    ];

    public static function getIp() {
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) return $ip;
                }
            }
        }
        return request()->ip();
    }

    public function isDismissed(GlobalNotification $globalNotification) {
        return in_array($globalNotification->_id, $this->dismissed_global_notifications ?? []);
    }

    public function dismiss(GlobalNotification $globalNotification) {
        $array = $this->$globalNotification->dismissed_global_notifications ?? [];
        array_push($array, $globalNotification->_id);
        $this->update([
            'dismissed_global_notifications' => $array
        ]);
    }

    public function notifications() {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->orderBy('created_at', 'desc');
    }

    public function balance(Currency $currency): UserBalance {
        return new UserBalance($this, $currency);
    }

    public function clientCurrency(): Currency {
        return Currency::find($_COOKIE['currency'] ?? Currency::all()[0]->id()) ?? Currency::all()[0];
    }

    public function depositWallet(Currency $currency) {
        $wallet = $this->makeVisible('wallet_'.$currency->id())->toArray()['wallet_'.$currency->id()] ?? null;
        if($wallet == null) {
            $wallet = $currency->newWalletAddress();
            if($wallet !== 'Error') $this->update([
                'wallet_'.$currency->id() => $wallet
            ]);
        }
        return $wallet;
    }

    public function total(Currency $currency) {
        return DB::table('games')->where('user', $this->_id)->where('currency', $currency->id())->where('demo', '!=', true)->where('status', '!=', 'in-progress')->where('status', '!=', 'cancelled')->sum('wager');
    }

    public function games() {
        return DB::table('games')->where('user', $this->_id)->where('status', '!=', 'cancelled')->where('status', '!=', 'in-progress')->where('demo', '!=', true)->count();
    }

    public function getInvestmentProfit(Currency $currency, bool $sub, bool $stopAtZero = true) {
        $profit = 0;
        foreach (Investment::where('user', $this->_id)->where('status', 0)->where('currency', $currency->id())->get() as $investment)
            $profit += $investment->getProfit() - ($sub ? $investment->amount : 0);
        return $stopAtZero == false ? $profit : ($profit < 0 ? 0 : $profit);
    }

    public function vipLevel(): int {
        return $this->vipData()[0];
    }

    public function closestVipCurrency(): Currency {
        return $this->vipData()[1];
    }

    private function vipData(): array {
        if(Cache::has('vip:'.$this->_id.':level'))
            return [
                intval(Cache::get('vip:'.$this->_id.':level')),
                Currency::find(Cache::get('vip:'.$this->_id.':currency'))
            ];

        $currency = Currency::all()[0];
        $vipLevel = 0;
        foreach(Currency::all() as $c) {
            $w = DB::table('games')->where('user', $this->_id)->where('currency', $c->id())->where('demo', '!=', true)->where('game', '!=', 'plinko')->where('status', '!=', 'in-progress')->where('status', '!=', 'cancelled')->sum('wager');
            $level = 0;



            if($w >= floatval($c->diamondvip())) $level = 5;
            else if($w >= floatval($c->platinumvip())) $level = 4;
            else if($w >= floatval($c->goldvip())) $level = 3;
            else if($w >= floatval($c->rubyvip())) $level = 2;
            else if($w >= floatval($c->emeraldvip())) $level = 1;

            if($level > $vipLevel) {
                $vipLevel = $level;
                $currency = $c;
            }
        }


        Cache::put('vip:'.$this->_id.':level', $vipLevel, now()->addMinutes(1));
        Cache::put('vip:'.$this->_id.':currency', $currency->id(), now()->addMinutes(1));

        return [
            $vipLevel,
            $currency
        ];
    }

    public function vipBonus(): float {
         $currency = Currency::find("eth");
        return floatval($currency->dailybonus()) * $this->vipLevel();
    }

    public function tfa(): TwoFactorAuth {
        return new TwoFactorAuth('2FA/'.$this->name);
    }

    public function validate2FA(bool $persist): bool {
        $token = $persist ? ($this->tfa_persistent_key ?? null) : ($this->tfa_onetime_key ?? null);
        return ($this->tfa_enabled ?? false) === false || ($token != null && !$token->isPast());
    }

    public function reset2FAOneTimeToken() {
        $this->update(['tfa_onetime_key' => null]);
    }

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [];
    }

}

class UserBalance {

    private User $user;
    private Currency $currency;
    private bool $quiet = false;
    private bool $demo = false;

    private float $minValue = 0.00000000;

    public function __construct(User $user, Currency $currency) {
        $this->user = $user;
        $this->currency = $currency;
    }

    public function quiet() {
        $this->quiet = true;
        return $this;
    }

    public function demo($set = true) {
        $this->demo = $set;
        return $this;
    }

    public function get(): float {
        $value = floatval(($this->user->{$this->getColumn()} ?? new Decimal128($this->minValue))->jsonSerialize()['$numberDecimal']);
        return $value < 0 ? 0 : floatval(number_format($value, 8, '.', ''));
    }

    private function getColumn() {
        return $this->demo ? 'demo_'.$this->currency->id() : $this->currency->id();
    }

    public function add(float $amount, array $transaction = null) {
        $this->user->update([
            $this->getColumn() => new Decimal128(strval($this->get() + $amount))
        ]);

        if($this->quiet == false) event(new BalanceModification($this->user, $this->currency, 'add', $this->demo, $amount, 0));
        Transaction::create([
            'user' => $this->user->_id,
            'demo' => $this->demo,
            'currency' => $this->currency->id(),
            'new' => $this->get(),
            'old' => $this->get() - $amount,
            'amount' => $amount,
            'quiet' => $this->quiet,
            'data' => $transaction ?? []
        ]);
    }

    public function subtract(float $amount, array $transaction = null) {
        $value = $this->get() - $amount;
        if($value < 0) $value = 0;
        $this->user->update([
            $this->getColumn() => new Decimal128(strval($value))
        ]);

        if($this->quiet == false) event(new BalanceModification($this->user, $this->currency, 'subtract', $this->demo, $amount, 0));
        Transaction::create([
            'user' => $this->user->_id,
            'demo' => $this->demo,
            'currency' => $this->currency->id(),
            'new' => $this->get(),
            'old' => $this->get() + $amount,
            'amount' => -$amount,
            'quiet' => $this->quiet,
            'data' => $transaction ?? []
        ]);
    }

}
