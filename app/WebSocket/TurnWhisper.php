<?php namespace App\WebSocket;

use App\Games\Kernel\Extended\ExtendedGame;
use App\Games\Kernel\Game;
use App\Games\Kernel\Module\ModuleSeeder;
use App\Games\Kernel\ProvablyFairResult;

class TurnWhisper extends WebSocketWhisper {

    public function event(): string {
        return "Turn";
    }

    public function process($data): array {
        if(!isset($data->id)) return reject(1);
        $game = \App\Game::where('_id', $data->id)->first();
        if($game == null) return reject(1, 'Invalid game id');
        if($game->status !== 'in-progress') return reject(2, 'Game is finished');

        $api_game = Game::find($game->game);
        if(!($api_game instanceof ExtendedGame)) return reject(3, 'Unsupported game operation');

        $server_seed = (new ModuleSeeder($api_game, $game->demo, null, $game))->find(function(ProvablyFairResult $result) use($api_game, $game, $data) {
            return $api_game->isLoss($result, $game, (array) $data->data);
        }, $game->server_seed);

        $game->update([
            'server_seed' => $server_seed,
            'data' => [
                'turn' => $game->data['turn'] + 1,
                'history' => $game->data['history'],
                'user_data' => $game->data['user_data'],
                'game_data' => $game->data['game_data']
            ]
        ]);

        $turnData = $api_game->turn($game, (array) $data->data)->toArray();
        switch($turnData['type']) {
            case 'fail':
                $api_game->setTurn($game, $api_game->getTurn($game) - 1);
                break;
            case 'lose':
                $game->update(['status' => 'lose']);
                $api_game->finish($game);
                break;
            case 'finish':
                $game->update(['status' => 'win']);
                $api_game->finish($game);
                break;
        }

        return success(array_merge($turnData, [
            'game' => $game->makeHidden('server_seed')->makeHidden('nonce')->makeHidden('data')->toArray()
        ]));
    }

}
