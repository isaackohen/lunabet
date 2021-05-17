<?php namespace App\Events;

use App\Game;
use App\User;
use App\RecentSlots;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LiveFeedGame implements ShouldBroadcastNow {

    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $game;
    private $delay;

    public function __construct(Game $game, $delay) {
        $this->game = $game;
        $this->delay = $delay;
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

        $meta = \App\Games\Kernel\Game::find($this->game->game)->metadata()->toArray();
        
        if ($this->game->game == "slotmachine") {
            $c27 = \Illuminate\Support\Facades\Cache::remember('c27_all', 60*60*60, function() {
                $client = new \outcomebet\casino25\api\client\Client(array(
                    'url' => 'https://api.c27.games/v1/',
                    'sslKeyPath' => env('c27_path'),
                ));
                return $client->listGames();
            });

            foreach ($c27['Games'] as $c27game) {
                if ($c27game['Id'] == $this->game->data['params']['gameId']) {
                    $meta['name'] = $c27game['Name'];
                    $meta['id'] = $this->game->data['params']['gameId'];

                }
            }
        }
 
        if ($this->game->game == "evoplay") {
            $evoplayuid = $this->game->data;
                    $getevoname = (\App\Slotslist::where('_id', $evoplayuid)->first()->n);
                    $meta['name'] = $getevoname;
                }
  
        return [
            'game' => $this->game->toArray(),
            'user' => User::where('_id', $this->game->user)->first()->toArray(),
            'metadata' => $meta,
            'delay' => $this->delay
        ];
    }

}
