<?php namespace App\Games\Kernel\Extended;

class FinishGame extends Turn {

    protected function type(): string {
        return 'finish';
    }

}
