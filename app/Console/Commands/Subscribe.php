<?php namespace App\Console\Commands;

use App\WebSocket\WebSocketWhisper;
use Clue\React\Redis\Factory;
use Illuminate\Console\Command;
use Tymon\JWTAuth\Facades\JWTAuth;

class Subscribe extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datagamble:subscribe';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Subscribe to redis updates';

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
        $loop = \React\EventLoop\Factory::create();
        $factory = new Factory($loop);

        $client = $factory->createLazyClient(env('APP_DEBUG') ? 'localhost' : "redis://:".env('REDIS_PASSWORD').'@'.env('REDIS_HOST').":".env('REDIS_PORT'));
        $channel = 'whisper.private-Whisper';
        $client->subscribe($channel)->then(function() use($channel) {
            echo 'Now subscribed to '.$channel.' channel' . PHP_EOL;
        }, function (\Exception $e) use ($client) {
            $client->close();
            echo 'Unable to subscribe: ' . $e->getMessage() . PHP_EOL;
        });

        $client->on('message', function ($channel, $message) {
            try {
                $message = json_decode($message);
                $event = str_replace('client-', '', $message->event);

                $whisper = WebSocketWhisper::find($event);
                if($whisper == null) {
                    echo 'Failed to process '.$event. ' (unknown event)' . PHP_EOL;
                    return;
                }

                $whisper->user = $message->data->jwt === '-' ? null : JWTAuth::setToken($message->data->jwt)->authenticate();
                $whisper->id = $message->data->id;

                $response = $whisper->process($message->data->data);
                $whisper->sendResponse($response);
                echo 'Event ' . $event . ' with data ' . json_encode($message->data->data) . ' -> ' . json_encode($response) . PHP_EOL;
            } catch (\Exception $e) {
                echo 'Failed to process '.$event . ' ('.json_encode($message).')' . PHP_EOL;
                echo $e->getMessage() . PHP_EOL;
                echo $e->getTraceAsString() . PHP_EOL;
            }
        });

        $loop->run();
    }

}
