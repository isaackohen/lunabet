<?php namespace App\WebSocket;

use App\Events\WhisperResponse;
use App\User;

abstract class WebSocketWhisper {

    public ?User $user;
    public string $id;

    public abstract function event(): string;

    public abstract function process($data): array;

    public function sendResponse(array $response) {
        event(new WhisperResponse($this->user, $this->id, $response));
    }

    public static function find(string $eventName): ?WebSocketWhisper {
        foreach (self::list() as $whisper) {
            $whisper = new $whisper();
            if($whisper->event() === $eventName) return $whisper;
        }
        return null;
    }

    public static function list(): array {
        return [
            PingWhisper::class,
            ChatHistoryWhisper::class,
            ChatMessageWhisper::class,
            OnlineUsersWhisper::class,
            PlayWhisper::class,
            TurnWhisper::class,
            FinishWhisper::class,
            MultipliersWhisper::class,
            InfoWhisper::class
        ];
    }

}
