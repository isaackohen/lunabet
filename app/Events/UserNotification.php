<?php namespace App\Events;

use App\Currency\Currency;
use App\User;
use App\Settings;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;


class UserNotification implements ShouldBroadcastNow {

    use Dispatchable, InteractsWithSockets, SerializesModels;


    public function __construct() {
        }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel
     */ 
    public function broadcastOn() {
        return new Channel('Everyone');
    }

    public function broadcastWith() {
        return ['message'=> \App\Settings::where('name', 'toast_message')->first()->value];
    }

}
