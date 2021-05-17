<?php namespace App\WebSocket;

class PingWhisper extends WebSocketWhisper {

    public function event(): string {
        return "Ping";
    }

    public function process($data): array {
        return success(['Pong']);
    }

}
