<?php

namespace App\Jobs;

use App\Events\CrashFinishGame;
use App\Game;
use App\Games\Kernel\ProvablyFair;
use App\Settings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CrashFinishAndSetupNextGame implements ShouldQueue {

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $multiplier;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($multiplier) {
        $this->multiplier = $multiplier;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        event(new CrashFinishGame($this->multiplier));

        $history = json_decode(Settings::where('name', 'crash_history')->first()->value);
        array_unshift($history, $this->multiplier);
        if(count($history) >= 30) array_pop($history);
        Settings::where('name', 'crash_history')->update([
            'value' => json_encode($history)
        ]);

        foreach (Game::where('game', 'crash')->where('status', 'in-progress')->where('server_seed', Settings::where('name', 'crash_server_seed')->first()->value)->get() as $game) {
            $game->update(['status' => 'lose']);
            event(new \App\Events\LiveFeedGame($game, 0));
        }

        Settings::where('name', 'crash_players')->update([
            'value' => '[]'
        ]);

        Settings::where('name', 'crash_server_seed')->update([
            'value' => ProvablyFair::generateServerSeed()
        ]);

        Settings::where('name', 'crash_client_seed')->update([
            'value' => ProvablyFair::generateServerSeed()
        ]);

        Settings::where('name', 'crash_nonce')->update([
            'value' => mt_rand(1, 100000)
        ]);

        dispatch((new CrashNextGame())->delay(now()->addSeconds(6)));
    }

}
