<?php namespace App\Games\Kernel\Module\General;

use App\Games\Crash;
use App\Games\Kernel\Module\Module;
use App\Games\Kernel\Module\ModuleConfigurationOption;
use App\Modules;

class CrashModule extends Module {

    function id(): string {
        return 'crash';
    }

    function name(): string {
        return 'Crash';
    }

    function description(): string {
        return 'Limit maximum payout';
    }

    function settings(): array {
        return [
            new class extends ModuleConfigurationOption {
                function id(): string {
                    return 'mines_'.$this->mines;
                }

                function name(): string {
                    return 'Number of mines: '.$this->mines;
                }

                function description(): string {
                    return 'Loss % with '.$this->mines.' mine(s) in the field';
                }

                function defaultValue(): ?string {
                    return '1';
                }

                function type(): string {
                    return 'input';
                }
            }
        ];
    }

    function supports(): bool {
        return $this->game instanceof Tower;
    }

    function lose(bool $demo): bool {
        return $this->chance(floatval(Modules::get($this->game, $demo)->get($this, 'mines_'.$this->game->getModuleData($this->dbGame))));
    }

}
