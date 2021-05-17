<?php namespace App\Games\Kernel\Extended;

class ContinueGame extends Turn {

    protected function type(): string {
        return 'continue';
    }

}
