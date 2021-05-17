<?php namespace App\Games\Kernel\Module\General;

use App\Games\Crash;
use App\Games\Kernel\Module\Module;
use App\Games\Kernel\Module\ModuleConfigurationOption;
use App\Modules;

class BigBalanceModule extends Module {

    function id(): string {
        return 'big_balance';
    }

    function name(): string {
        return 'Loss % (big balance)';
    }

    function description(): string {
        return 'Additional static loss % for big balance.<br>Recommended only for *Quick games, but use it carefully.<br>*Extended games can be easily detected as fraud if you use this.';
    }

    function settings(): array {
        return [
            new class extends ModuleConfigurationOption {
                function id(): string {
                    return 'starts';
                }

                function name(): string {
                    return 'Minimal balance';
                }

                function description(): string {
                    return 'Minimal balance';
                }

                function defaultValue(): ?string {
                    return '50';
                }

                function type(): string {
                    return 'input';
                }
            },
            new class extends ModuleConfigurationOption {
                function id(): string {
                    return 'chance';
                }

                function name(): string {
                    return 'Loss probability';
                }

                function description(): string {
                    return 'Loss probability (1-100)';
                }

                function defaultValue(): ?string {
                    return '15';
                }

                function type(): string {
                    return 'input';
                }
            }
        ];
    }

    function supports(): bool {
        return !($this->game instanceof Crash);
    }

    function lose(bool $demo): bool {
        if(auth()->guest()) return false;
        return auth()->user()->balance(auth()->user()->clientCurrency())->get() >= floatval(Modules::get($this->game, $demo)->get($this, 'starts'))
            && $this->chance(floatval(Modules::get($this->game, $demo)->get($this, 'chance')));
    }

}
