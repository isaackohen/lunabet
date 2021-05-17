<?php namespace App\Notifications;

use App\Currency\Currency;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class WithdrawDeclined extends Notification {

    use Queueable;

    private $message;

    public function __construct($withdraw) {
        $this->message = __('general.notifications.withdraw_declined.message', [
            'diff' => $withdraw->created_at->diffForHumans(),
            'sum' => $withdraw->sum,
            'currency' => Currency::find($withdraw->currency)->name(),
            'reason' => $withdraw->decline_reason
        ]);
    }

    public function via($notifiable) {
        return ['database', 'broadcast', WebPushChannel::class];
    }

    public function toArray($notifiable) {
        return [
            'title' => __('general.notifications.withdraw_declined.title'),
            'message' => $this->message
        ];
    }

    public function toWebPush($notifiable, $notification) {
        return (new WebPushMessage)
            ->title(__('general.notifications.withdraw_declined.title'))
            ->body($this->message);
    }

}
