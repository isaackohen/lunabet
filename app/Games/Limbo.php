<?php namespace App\Games;

use App\Game;
use App\Games\Kernel\Data;
use App\Games\Kernel\Metadata;
use App\Games\Kernel\Module\General\Wrapper\MultiplierCanBeLimited;
use App\Games\Kernel\ProvablyFair;
use App\Games\Kernel\ProvablyFairResult;
use App\Games\Kernel\Quick\QuickGame;
use App\Games\Kernel\Quick\SuccessfulQuickGameResult;
use App\Games\Kernel\RejectedGameResult;

class Limbo extends QuickGame implements MultiplierCanBeLimited {

    function metadata(): Metadata {
        return new class extends Metadata {
            function id(): string {
                return 'limbo';
            }

            function name(): string {
                return 'Limbo';
            }

            function icon(): string {
                return 'fas fa-rocket';
            }
        };
    }

    function start($user, Data $data) {
        $target = floatval($data->game()->target_payout);
        if($target < 1.01 || $target > 1000000) return new RejectedGameResult(1, 'Invalid target payout');

        return new SuccessfulQuickGameResult((new ProvablyFair($this))->result(), function(SuccessfulQuickGameResult $result, array $transformedResults) use($user, $data, $target) {
            $number = $transformedResults[0];
            if(!$this->isLoss($result->provablyFairResult(), $data)) $result->win($user, $data, $target);
            else $result->lose();

            return [
                'target' => $target,
                'number' => $number
            ];
        });
    }

    public function isLoss(ProvablyFairResult $result, Data $data): bool {
        return !(floatval($data->game()->target_payout) < $result->result()[0]);
    }

    function result(ProvablyFairResult $result): array {
        $max_multiplier = 5.00; $house_edge = 2.99;
        $float_point = $max_multiplier / ($result->extractFloat() * $max_multiplier) * $house_edge;
        return [floor($float_point * 100) / 100];
    }

    public function multiplier(?Game $game, ?Data $data, ProvablyFairResult $result): float {
        return floatval($data->game()->target_payout);
    }

}
