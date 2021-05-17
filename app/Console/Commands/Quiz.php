<?php

namespace App\Console\Commands;

use App\Events\NewQuiz;
use App\Settings;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class Quiz extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datagamble:quiz';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send quiz to chat';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct() {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle() {
        $getSuitableQuiz = function() use(&$getSuitableQuiz) {
            $json = json_decode(file_get_contents('https://opentdb.com/api.php?amount=1&type=multiple'))->results[0];
            if(str_contains($json->question, 'which') || str_contains($json->question, 'following')) return $getSuitableQuiz();
            return $json;
        };

        $json = $getSuitableQuiz();

        Settings::where('name', 'quiz_question')->update(['value' => $json->question]);
        Settings::where('name', 'quiz_answer')->update(['value' => $json->correct_answer]);
        Settings::where('name', 'quiz_active')->update(['value' => 'true']);

        event(new \App\Events\QuizNotification());

        event(new NewQuiz($json->question));

    }

}
