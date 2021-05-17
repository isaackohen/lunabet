<?php namespace App\Games;

use App\Game;
use App\Games\Kernel\Data;
use App\Games\Kernel\Extended\ContinueGame;
use App\Games\Kernel\Extended\ExtendedGame;
use App\Games\Kernel\Extended\FailedTurn;
use App\Games\Kernel\Extended\FinishGame;
use App\Games\Kernel\Extended\LoseGame;
use App\Games\Kernel\Extended\Turn;
use App\Games\Kernel\Metadata;
use App\Games\Kernel\Module\General\Wrapper\MultiplierCanBeLimited;
use App\Games\Kernel\ProvablyFair;
use App\Games\Kernel\ProvablyFairResult;

class Tower extends ExtendedGame implements MultiplierCanBeLimited {

    function metadata(): Metadata {
        return new class extends Metadata {
            function id(): string {
                return 'tower';
            }

            function name(): string {
                return 'Tower';
            }

            function icon(): string {
                return 'fad fa-gopuram';
            }
        };
    }

    public function start(\App\Game $game) {
        $this->pushData($game, [
            'mines' => intval($this->userData($game)['data']['mines'])
        ]);
    }

    public function getModuleData(\App\Game $game) {
        return floatval($this->gameData($game)['mines']);
    }

    public function turn(\App\Game $game, array $turnData): Turn {
        if(intval($turnData['cell']) < 0 || intval($turnData['cell']) > 4) return new FailedTurn($game, []);

        $this->pushHistory($game, intval($turnData['cell']));

        $grid = (new ProvablyFair($this, $game->server_seed))->result()->result()[$this->gameData($game)['mines'] - 1];
        $row = $grid[$this->getTurn($game) - 1];

        if(in_array(intval($turnData['cell']), $row)) {
            $this->pushData($game, ['grid' => $grid]);
            return new LoseGame($game, ['death' => $row, 'grid' => $grid]);
        }

        $game->update([
            'multiplier' => $this->multipliers()[$this->gameData($game)['mines']][$this->getTurn($game)]
        ]);

        $this->pushData($game, [strval($this->getTurn($game)) => intval($turnData['cell'])]);

        if($this->getTurn($game) >= 10) {
            $this->pushData($game, ['grid' => $grid]);
            return new FinishGame($game, ['death' => $row, 'grid' => $grid]);
        }
        return new ContinueGame($game, ['death' => $row]);
    }

    public function isLoss(ProvablyFairResult $result, \App\Game $game, array $turnData): bool {
        /*if($this->getTurn($game) > 1) for($i = 1; $i < $this->getTurn($game); $i++) {
            if(in_array($this->gameData($game)[strval($i)], (new ProvablyFair($this, $result->server_seed()))->result()->result()[$this->gameData($game)['mines'] - 1][$i - 1])) return false;
        }*/
        return in_array(intval($turnData['cell']), (new ProvablyFair($this, $result->server_seed()))->result()->result()[$this->gameData($game)['mines'] - 1][$this->getTurn($game)]);
    }

    function result(ProvablyFairResult $result): array {
        $output = [];
        $columns = 4; $rows = 10;
        for($mines = 1; $mines <= 4; $mines++) {
            $row = [];
            for($i = 1; $i <= $rows; $i++) {
                $array = range(0, $columns);
                $floats = $result->extractFloats($columns * $i);
                $floats = array_slice($floats, $columns * ($i - 1), $columns * $i);
                $index = -1;
                array_push($row, array_slice(array_map(function($float) use(&$array, &$floats, &$mines, &$i, &$index, &$columns) {
                    $index = $index + 1;
                    return array_splice($array, floor($float * ($columns - $index + 1)), 1)[0] ?? -1;
                }, $floats), 0, $mines));
            }

            array_push($output, $row);
        }
        return $output;
    }

    public function multipliers(): array {
        return [
            1 => [
                1 => 1.19,
                2 => 1.48,
                3 => 1.86,
                4 => 2.32,
                5 => 2.40,
                6 => 2.90,
                7 => 3.23,
                8 => 3.86,
                9 => 4.48,
                10 => 5.85
            ],
            2 => [
                1 => 1.58,
                2 => 2.64,
                3 => 4.40,
                4 => 7.33,
                5 => 12.22,
                6 => 20.36,
                7 => 33.94,
                8 => 56.56,
                9 => 74.27,
                10 => 97.11
            ],
            3 => [
                1 => 2.38,
                2 => 5.94,
                3 => 14.84,
                4 => 37.11,
                5 => 92.77,
                6 => 231.93,
                7 => 579.83,
                8 => 949.58,
                9 => 1623.96,
                10 => 4059.91
            ],
            4 => [
                1 => 4.75,
                2 => 23,
                3 => 118,
                4 => 593,
                5 => 2968,
                6 => 14843,
                7 => 34218,
                8 => 51093,
                9 => 85546,
                10 => 100000
            ]
        ];
    }

    public function multiplier(?Game $game, ?Data $data, ProvablyFairResult $result): float {
        return $this->multipliers()[$this->gameData($game)['mines']][$this->getTurn($game) + 1];
    }
}
