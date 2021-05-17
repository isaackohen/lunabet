<?php namespace App\WebSocket;

use App\Games\Kernel\Extended\ExtendedGame;
use App\Games\Kernel\Game;

class FinishWhisper extends WebSocketWhisper {

    public function event(): string {
        return 'Finish';
    }

    public function process($data): array {
        $game = \App\Game::where('_id', $data->id)->first();
        if($game == null) return reject(1, 'Invalid game id');
        if($game->status !== 'in-progress') return reject(2, 'Game is finished');

        $api_game = Game::find($game->game);
        if(!($api_game instanceof ExtendedGame)) return reject(3, 'Unsupported game operation');

        $api_game->finish($game);
        return success([
            'game' => $game->toArray()
        ]);
    }

}
