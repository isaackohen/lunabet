<?php namespace App\Games\Kernel;

use App\DisabledGame;
use App\DisabledGamesReff;

/**
 * @package App\Games
 * @see QuickGame
 * @see ExtendedGame
 */
abstract class Game {

    abstract function metadata(): Metadata;

    abstract function process(Data $data);

    abstract function result(ProvablyFairResult $result): array;

    public function nonce() {
        return auth()->guest() ? mt_rand(1, 100000) : \App\Game::where('user', auth()->user()->_id)->count() + 1;
    }

    public function server_seed() {
        return ProvablyFair::generateServerSeed();
    }

    public function client_seed() {
        return auth()->guest() ? 'guest' : auth()->user()->client_seed;
    }

    public function multipliers(): array {
        return [];
    }

    public function data(): array {
        return [];
    }
    
    public function isDisabled(): bool {
        return $this->metadata()->isPlaceholder() || DisabledGame::where('name', $this->metadata()->id())->first() != null;
    }

    public function isDisabledReff(): bool {
        return DisabledGamesReff::where('name', $this->metadata()->id())->first() != null;
    }

    public function ignoresMultipleClientTabs() {
        return false;
    }

    public function usesCustomWagerCalculations() {
        return false;
    }

    public static function list() {
        return [
            new \App\Games\Slide(),
            new \App\Games\Mines(),
            new \App\Games\Baccarat(),
            new \App\Games\Wheel(),
            new \App\Games\Dice(),
            new \App\Games\Blackjack(),
            new \App\Games\Plinko(),
            new \App\Games\Coinflip(),
            new \App\Games\VideoPoker(),
            new \App\Games\Tower(),
            new \App\Games\Keno(),
            new \App\Games\Stairs(),
            new \App\Games\Diamonds(),
            new \App\Games\Roulette(),
            new \App\Games\Crash(),
            new \App\Games\HiLo(),
            new \App\Games\Limbo(),
			new \App\Games\Slots(),
			new \App\Games\Triple(),
            new \App\Games\EvoPlay(),
            new \App\Games\SlotMachine()
        ];
    }

    public static function find(string $api_id) {
        foreach (self::list() as $game)
            if($game->metadata()->id() === $api_id) return $game;
        return null;
    }

}
