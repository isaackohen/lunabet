<?php

namespace App\Console\Commands;

use App\Notifications\DiscordPromocode;
use App\Settings;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Intervention\Image\Facades\Image;
use NotificationChannels\Discord\DiscordChannel;
use VK\Client\VKApiClient;

class SendVkPromocode extends Command
{

    // https://oauth.vk.com/authorize?client_id=7434559&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=offline,photos,wall,groups&response_type=token&v=5.65

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datagamble:send-social-promocode';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send vk.com promocode';

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
        $dollaramount = floatval(Settings::where('name', 'promo_dollar')->first()->value);
        $sum = number_format(($dollaramount / \App\Http\Controllers\Api\WalletController::rateDollarEth()), 7, '.', '');
        $usages = intval(Settings::where('name', 'promo_usages')->first()->value);

        $promocode = \App\Promocode::create([
            'code' => \App\Promocode::generate(),
            'used' => [],
            'sum' => $sum,
            'usages' => $usages,
            'currency' => 'eth',
            'times_used' => 0,
            'expires' => \Carbon\Carbon::now()->addHours(1)
        ]);

        Notification::route('discord', Settings::where('name', 'discord_promocode_channel')->first()->value)->notify(new DiscordPromocode($promocode->code, $usages, $sum));
        event(new \App\Events\PromoNotification());
    }
}
