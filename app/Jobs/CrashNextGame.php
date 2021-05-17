<?php

namespace App\Jobs;

use App\Events\CrashFinishGame;
use App\Events\CrashGameTimerStart;
use App\Games\Crash;
use App\Games\Kernel\ProvablyFair;
use App\Settings;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CrashNextGame implements ShouldQueue {

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $instance = new Crash();
        $multiplier = (new ProvablyFair($instance))->result()->result()[0];
        if($multiplier < 1) $multiplier = 1.1;

        $timeInMilliseconds = 0;
        $simulation = 1; $suS =  0;

        while($simulation < $multiplier) {
            $simulation += 0.05 / 15 + $suS;
            $timeInMilliseconds += 2000 / 15 / 3;
            if($simulation >= 5.5) {
                $suS += 0.05 / 15;
                $timeInMilliseconds += 4000 / 15 / 3;
            }
        }

        Settings::where('name', 'crash_can_bet')->update(['value' => 'true']);
        Settings::where('name', 'crash_start_timestamp')->update(['value' => strval(now()->addMilliseconds($timeInMilliseconds + 6000)->timestamp)]);
        dispatch((new CrashDisableBetAccepting())->delay(now()->addSeconds(6)));

        event(new CrashGameTimerStart());

        dispatch((new CrashFinishAndSetupNextGame($multiplier))->delay(now()->addMilliseconds($timeInMilliseconds + 6000)));
    }

}
