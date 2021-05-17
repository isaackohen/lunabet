<?php namespace App\Notifications;

use App\Settings;
use Illuminate\Notifications\Notification;
use NotificationChannels\Discord\DiscordChannel;
use NotificationChannels\Discord\DiscordMessage;

class DiscordPromocode extends Notification {

    private string $code;
    private int $usages;
    private float $sum;

    public function __construct(string $code, int $usages, float $sum) {
        $this->code = $code;
        $this->usages = $usages;
        $this->sum = $sum;
    }

    public function via($notifiable) {
        return [DiscordChannel::class];
    }

    public function routeNotificationForDiscord() {
        return Settings::where('name', 'discord_promocode_channel')->first()->value;
    }

    public function toDiscord($notifiable) {
        return (new DiscordMessage())->embed([
            'title' => 'New Promocode!',
            'description' => "**{$this->code}** - ".number_format($this->sum, 2, '.', '')." ETH! {$this->usages} max uses.\nEnter promocode at: https://lunabet.io/bonus/",
            'color' => '15158332'
        ]);
    }

}
