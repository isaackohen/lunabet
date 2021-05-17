<?php namespace App\Games\Kernel\Extended;

/**
 * If turn returns this instance, then game turnId will not be changed.
 * @package App\Games\Kernel\Extended
 */
class FailedTurn extends Turn {

    protected function type(): string {
        return 'fail';
    }

}
