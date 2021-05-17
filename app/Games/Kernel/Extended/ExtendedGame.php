<?php namespace App\Games\Kernel\Extended;

use App\Currency\Currency;
use App\Events\BalanceModification;
use App\Games\Kernel\Data;
use App\Games\Kernel\Game;
use App\Games\Kernel\Multiplayer\MultiplayerGame;
use App\Games\Kernel\ProvablyFairResult;
use App\Leaderboard;
use App\Transaction;
use App\User;
use Illuminate\Support\Facades\DB;

abstract class ExtendedGame extends Game {

    public abstract function start(\App\Game $game);

    public abstract function turn(\App\Game $game, array $turnData): Turn;

    abstract function isLoss(ProvablyFairResult $result, \App\Game $game, array $turnData): bool;

    public function process(Data $data) {
        if(!$this->acceptsDemo() && ($data->guest() || $data->demo())) return ['error' => [-7, 'This game does not accept any demo bets']];
        if($this instanceof MultiplayerGame && $this->state()->hasBetFrom($data->user()->_id)) return ['code' => -6, 'message' => "Can't place more than one bet"];
        if(!$this->acceptBet($data)) return ['error' => [-6, 'Game won\'t accept any bets right now']];

        if(!$data->guest()) $data->user()->balance(Currency::find($data->currency()))->demo($data->demo())->subtract($data->bet(), Transaction::builder()->game($data->id())->message('Game')->get());
        if(!$data->guest()){
			if(\App\Statistics::where('_id', $data->user()->_id)->first() == null) {
				$a = \App\Statistics::create([
					'_id' => $data->user()->_id, 'bets_btc' => 0, 'wins_btc' => 0, 'loss_btc' => 0, 'wagered_btc' => 0, 'profit_btc' => 0, 'bets_eth' => 0, 'wins_eth' => 0, 'loss_eth' => 0, 'wagered_eth' => 0, 'profit_eth' => 0, 'bets_ltc' => 0, 'wins_ltc' => 0, 'loss_ltc' => 0, 'wagered_ltc' => 0, 'profit_ltc' => 0, 'bets_doge' => 0, 'wins_doge' => 0, 'loss_doge' => 0, 'wagered_doge' => 0, 'profit_doge' => 0, 'bets_bch' => 0, 'wins_bch' => 0, 'loss_bch' => 0, 'wagered_bch' => 0, 'profit_bch' => 0, 'bets_trx' => 0, 'wins_trx' => 0, 'loss_trx' => 0, 'wagered_trx' => 0, 'profit_trx' => 0
				]);
			}

			$stats = \App\Statistics::where('_id', $data->user()->_id)->first();

			if($data->currency() == 'btc'){
			$stats->update([
                'bets_btc' => $stats->bets_btc + 1,
				'wagered_btc' => $stats->wagered_btc + $data->bet()
            ]);
			}
			if($data->currency()== 'eth'){
			$stats->update([
                'bets_eth' => $stats->bets_eth + 1,
				'wagered_eth' => $stats->wagered_eth + $data->bet()
            ]);
			}
			if($data->currency() == 'ltc'){
			$stats->update([
                'bets_ltc' => $stats->bets_ltc + 1,
				'wagered_ltc' => $stats->wagered_ltc + $data->bet()
            ]);
			}
			if($data->currency() == 'doge'){
			$stats->update([
                'bets_doge' => $stats->bets_doge + 1,
				'wagered_doge' => $stats->wagered_doge + $data->bet()
            ]);
			}
			if($data->currency() == 'bch'){
			$stats->update([
                'bets_bch' => $stats->bets_bch + 1,
				'wagered_bch' => $stats->wagered_bch + $data->bet()
            ]);
			}
			if($data->currency() == 'trx'){
			$stats->update([
                'bets_trx' => $stats->bets_trx + 1,
				'wagered_trx' => $stats->wagered_trx + $data->bet()
            ]);
			}
		}

        if ($data->user() != null && $data->user()->referral != null) {
            $referrer = \App\User::where('_id', $data->user()->referral)->first();
            $referrer->balance(Currency::find($data->currency()))->add($data->bet() * 0.0009, \App\Transaction::builder()->message('referral bonus')->get());
        }

        $game = \App\Game::create([
            'id' => DB::table('games')->count() + 1,
            'user' => $data->guest() ? null : $data->user()->_id,
            'game' => $this->metadata()->id(),
            'wager' => $data->bet(),
            'status' => 'in-progress',
            'profit' => 0,
            'server_seed' => $this->server_seed(),
            'client_seed' => $this->client_seed(),
            'nonce' => $this->nonce(),
            'multiplier' => 0,
            'currency' => $data->currency(),
            'data' => [
                'turn' => 0,
                'history' => [],
                'game_data' => [],
                'user_data' => $data->toArray()
            ],
            'demo' => $data->demo(),
            'type' => $this instanceof MultiplayerGame ? 'multiplayer' : 'extended'
        ]);

        $this->start($game);

        return ['response' => ['id' => $game->_id, 'wager' => $data->bet()]];
    }

    public function finish(\App\Game $game) {
        $game->update([
            'profit' => $game->status === 'lose' ? 0 : $game->wager * $game->multiplier,
            'status' => $game->status === 'in-progress' ? 'win' : $game->status
        ]);

        if($game->user != null) {
            $currency = Currency::find($game->currency);
            $user = User::where('_id', $game->user)->first();

			if(\App\Statistics::where('_id', $game->user)->first() == null) {
				$a = \App\Statistics::create([
					'_id' => $game->user, 'bets_btc' => 0, 'wins_btc' => 0, 'loss_btc' => 0, 'wagered_btc' => 0, 'profit_btc' => 0, 'bets_eth' => 0, 'wins_eth' => 0, 'loss_eth' => 0, 'wagered_eth' => 0, 'profit_eth' => 0, 'bets_ltc' => 0, 'wins_ltc' => 0, 'loss_ltc' => 0, 'wagered_ltc' => 0, 'profit_ltc' => 0, 'bets_doge' => 0, 'wins_doge' => 0, 'loss_doge' => 0, 'wagered_doge' => 0, 'profit_doge' => 0, 'bets_bch' => 0, 'wins_bch' => 0, 'loss_bch' => 0, 'wagered_bch' => 0, 'profit_bch' => 0, 'bets_trx' => 0, 'wins_trx' => 0, 'loss_trx' => 0, 'wagered_trx' => 0, 'profit_trx' => 0
				]);
			}

			$stats = \App\Statistics::where('_id', $game->user)->first();

			if($game->currency == 'btc'){
			$stats->update([
				'wins_btc' => $stats->wins_btc + ($game->status === 'lose' ? 0 : 1),
				'loss_btc' => $stats->loss_btc + ($game->status === 'lose' ? 1 : 0),
				'profit_btc' => $stats->profit_btc + ($game->status === 'lose' ? -($game->wager) : ($game->wager * $game->multiplier))
            ]);
			}
			if($game->currency == 'eth'){
			$stats->update([
				'wins_eth' => $stats->wins_eth + ($game->status === 'lose' ? 0 : 1),
				'loss_eth' => $stats->loss_eth + ($game->status === 'lose' ? 1 : 0),
				'profit_eth' => $stats->profit_eth + ($game->status === 'lose' ? -($game->wager) : ($game->wager * $game->multiplier))
            ]);
			}
			if($game->currency == 'ltc'){
			$stats->update([
				'wins_ltc' => $stats->wins_ltc + ($game->status === 'lose' ? 0 : 1),
				'loss_ltc' => $stats->loss_ltc + ($game->status === 'lose' ? 1 : 0),
				'profit_ltc' => $stats->profit_ltc + ($game->status === 'lose' ? -($game->wager) : ($game->wager * $game->multiplier))
            ]);
			}
			if($game->currency == 'doge'){
			$stats->update([
				'wins_doge' => $stats->wins_doge + ($game->status === 'lose' ? 0 : 1),
				'loss_doge' => $stats->loss_doge + ($game->status === 'lose' ? 1 : 0),
				'profit_doge' => $stats->profit_doge + ($game->status === 'lose' ? -($game->wager) : ($game->wager * $game->multiplier))
            ]);
			}
			if($game->currency == 'bch'){
			$stats->update([
				'wins_bch' => $stats->wins_bch + ($game->status === 'lose' ? 0 : 1),
				'loss_bch' => $stats->loss_bch + ($game->status === 'lose' ? 1 : 0),
				'profit_bch' => $stats->profit_bch + ($game->status === 'lose' ? -($game->wager) : ($game->wager * $game->multiplier))
            ]);
			}
			if($game->currency == 'trx'){
			$stats->update([
				'wins_trx' => $stats->wins_trx + ($game->status === 'lose' ? 0 : 1),
				'loss_trx' => $stats->loss_trx + ($game->status === 'lose' ? 1 : 0),
				'profit_trx' => $stats->profit_trx + ($game->status === 'lose' ? -($game->wager) : ($game->wager * $game->multiplier))
            ]);
			}

            if($this->getTurn($game) == 0) {
                $this->handleCancellation($game);
            } else {
                if ($game->profit == 0) event(new BalanceModification($user, $currency, 'subtract', $game->demo, $game->wager, 0));
                else {
                    auth()->user()->balance($currency)->demo($game->demo)->quiet()->add($game->profit, Transaction::builder()->game($game->game)->message('Win')->get());
                    event(new BalanceModification(auth()->user(), $currency, 'add', $game->demo, $game->profit, 0));
                }
                if (!$game->demo) event(new \App\Events\LiveFeedGame($game, 0));

                if(!$game->demo && auth()->user()->vipLevel() > 0 && (auth()->user()->weekly_bonus ?? 0) < 100)
                    auth()->user()->update([
                        'weekly_bonus' => (auth()->user()->weekly_bonus ?? 0) + 0.1
                    ]);
				Leaderboard::insert($game);
            }
        }
    }

    protected function handleCancellation(\App\Game $game) {
        if($this instanceof MultiplayerGame && !$this->allowCancellation()) return;
        $game->update([
            'status' => 'cancelled'
        ]);

        $user = User::where('_id', $game->user)->first();
        if($user != null) $user->balance(Currency::find($game->currency))->demo($game->demo)->add($game->wager, Transaction::builder()->game($game->game)->message('Cancellation')->get());
    }

    protected function acceptBet(Data $data) {
        return true;
    }

    protected function acceptsDemo() {
        return true;
    }

    public function inHistory(\App\Game $game, $validate) {
        return in_array($validate, $game->data['history']);
    }

    public function userData(\App\Game $game) {
        return $game->data['user_data'];
    }

    public function gameData(\App\Game $game) {
        return $game->data['game_data'];
    }

    public function pushData(\App\Game $game, array $value) {
        $data = $game->data['game_data'];
        $data = array_merge($data, $value);
        $game->update([
            'data' => [
                'turn' => $game->data['turn'],
                'history' => $game->data['history'],
                'game_data' => $data,
                'user_data' => $game->data['user_data']
            ]
        ]);
    }

    public function pushHistory(\App\Game $game, $validate) {
        $history = $game->data['history'];
        array_push($history, $validate);
        $game->update([
            'data' => [
                'turn' => $game->data['turn'],
                'history' => $history,
                'game_data' => $game->data['game_data'],
                'user_data' => $game->data['user_data']
            ]
        ]);
    }

    public function setTurn(\App\Game $game, int $turn) {
        $game->update([
            'data' => [
                'turn' => $turn,
                'history' => $game->data['history'],
                'game_data' => $game->data['game_data'],
                'user_data' => $game->data['user_data']
            ]
        ]);
    }

    public function getTurn(\App\Game $game): int {
        return $game->data['turn'];
    }

    protected function getCards(ProvablyFairResult $result, int $count, $fisher_yates = false): array {
        $cards = range(0, 207);
        $output = [];
        for($i = 0; $i < $count; $i++) array_push($output,
            $fisher_yates ? array_splice($cards, floor($result->extractFloats($count)[$i] * (52 - $i)), 1)[0]
                                 : $cards[floor($result->extractFloats($count)[$i] * 52)]);
        return $output;
    }

}
