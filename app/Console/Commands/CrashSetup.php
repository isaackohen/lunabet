<?php

namespace App\Console\Commands;

use App\Events\CrashFinishGame;
use App\Events\CrashGameTimerStart;
use App\Jobs\CrashFinishAndSetupNextGame;
use Illuminate\Console\Command;

class CrashSetup extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datagamble:crash';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start Crash game';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle() {
        dispatch(new CrashFinishAndSetupNextGame(1));
    }

}
