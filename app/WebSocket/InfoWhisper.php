<?php namespace App\WebSocket;

use App\Games\Kernel\Game;

class InfoWhisper extends WebSocketWhisper {

    public function event(): string {
        return "Info";
    }

    public function process($data): array {
        $game = \App\Game::where('_id', $data->game_id)->first();
        if($game == null) return reject(1, 'Unknown game id');
        if($game->status === 'in-progress' || $game->status === 'cancelled') return reject(2, 'Game is not finished');
        return success([
            'metadata' => Game::find($game->game)->metadata()->toArray(),
            'info' => $game->toArray(),
            'user' => \App\User::where('_id', $game->user)->first()->toArray()
        ]);
    }

}
