<?php namespace App\WebSocket;

use App\Games\Kernel\Game;

class MultipliersWhisper extends WebSocketWhisper {

    public function event(): string {
        return "Multiplier";
    }

    public function process($data): array {
        $game = Game::find($data->api_id);
        if($game == null) return reject(-3, 'Unknown API game id');
        if($data->api_id == 'crash' || $data->api_id == 'slide') return success($game->data());
        return success($game->multipliers());
    }

}
