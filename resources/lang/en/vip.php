<?php

return [
    'rank' => [
        'level' => 'Reward Program - :level',
        '0' => 'New',
        '1' => 'Emerald',
        '2' => 'Ruby',
        '3' => 'Gold',
        '4' => 'Platinum',
        '5' => 'Diamond'
    ],
    'description' => 'Your Reward Level increases simply by wagering bets in most games in any currency.',
    'description.2' => 'Your progress to next Reward Level can be followed here.',
    'benefits_description' => 'Luna Loyal Rewards:',
    'benefits' => 'Reward Levels and Rewards:',
    'benefit_list' => [
        'emerald' => [
            '1' => 'Daily Cashback Feature unlock.',
            '2' => 'Access to Loyalty promocodes.',
            '3' => 'Loyalty role on the Discord server.',
            '4' => 'Increased Faucet Reward.',
            '5' => 'Get 15 Free Slot Spins.'
        ],
        'ruby' => [
            '1' => 'Promocode use limit per day is increased from 8 to 16.',
            '2' => 'Increased Daily Cashback Reward.',
            '3' => 'Increased Faucet Reward.',
            '4' => 'Promocode Reward increased by 25%.',
            '5' => 'Get 25 Free Slot Spins.'
        ],
        'gold' => [
            '1' => 'VIP codes do not affect the overall activation limit of promotional codes.',
            '2' => 'Promocode Reward increased by 50%.',
            '3' => 'Increased Daily Cashback Reward.',
            '4' => 'Get 50 Free Slot Spins.'
        ],
        'platinum' => [
            '1' => 'The required amount for withdrawal is reduced by 2 times.',
            '2' => 'Increased Daily Cashback Reward.',
            '3' => 'Get 75 Free Slot Spins.'
        ],
        'diamond' => [
            '1' => 'You are able to get customized and personalized rewards, such as custom border and avatar.',
            '2' => 'Code activation limit now resets every 12 hours.',
            '3' => 'Increased Daily Cashback Reward.',
            '4' => 'Get 150 Free Slot Spins.'
        ]
    ],
    'bonus' => [
        'tooltip' => 'Daily Cashback',
        'title' => 'Daily Cashback Reward',
        'progress_title' => 'Progress',
        'description' => "Once you reach Emerald Rank <svg style='width: 14px; height: 14px'><use href='#vip-emerald'></use></svg> within Reward Program, you are eligible to use Daily Cashback Feature. 
        Each wager over ".\App\Settings::where('name', 'dailybonus_minbet_slots')->first()->value." unlock 0.01% of your total daily Reward Prize.<br>
                          <br>The total size of which is determined by your Reward Level.<br>
                          <br>You can cash-in your Daily Reward at any time, but keep in mind that after this you will not be able to receive this cash reward for the rest of the day.
                          <br><br>We reset the Daily Cashback Gift every day at midnight. So make sure to remember to take the reward before midnight!",
        'timeout' => "<br><strong>You have already received Daily Cashback.</strong><br>Come back tomorrow!<br><br>"
    ]
];
