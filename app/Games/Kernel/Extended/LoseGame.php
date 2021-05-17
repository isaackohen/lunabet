<?php namespace App\Games\Kernel\Extended;

class LoseGame extends Turn {

    protected function type(): string {
        return 'lose';
    }

}
