<?php namespace App\WebSocket;

class ChatHistoryWhisper extends WebSocketWhisper {

    public function event(): string {
        return "ChatHistory";
    }

    public function process($data): array {
        $history = \App\Chat::latest()->limit(35)->where('deleted', '!=', true)->get()->toArray();
        if(\App\Settings::where('name', 'quiz_active')->first()->value !== 'false')
            array_push($history, [
                "data" => [
                    "question" => \App\Settings::where('name', 'quiz_question')->first()->value,
                ],
                "type" => "quiz"
            ]);
        return success($history);
    }

}
