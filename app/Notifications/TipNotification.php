<?php namespace App\Notifications;

use App\Currency\Currency;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class TipNotification extends Notification {

    use Queueable;

    private $message;

    public function __construct($from, $currency, $amount) {
        $this->message = __('general.chat_commands.modal.tip.notify', ['name' => $from->name, 'value' => $amount, 'icon' => $currency->icon(), 'style' => $currency->style()]);
    }

    public function via($notifiable) {
        return ['database', 'broadcast', WebPushChannel::class];
    }

    public function toArray($notifiable) {
        return [
            'title' => 'Bitsarcade',
            'message' => $this->message
        ];
    }

    public function toWebPush($notifiable, $notification) {
        return (new WebPushMessage)
            ->title('Bitsarcade')
            ->body($this->message);
    }

}
