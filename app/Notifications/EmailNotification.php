<?php namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class EmailNotification extends Notification {

    use Queueable;

    private $message;

    public function __construct() {
        $this->message = __('general.notifications.email_reminder.message');
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable) {
        return [
            'title' => __('general.notifications.email_reminder.title'),
            'message' => $this->message
        ];
    }

}
