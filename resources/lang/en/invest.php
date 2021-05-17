<?php

return [
    'description' => 'BitsArcade allows its players to play just like other casinos, but also offers the unique feature allowing users to be "The Bank". By investing in the bankroll, you can earn dividend from the loss of other players, this is a great way to "compete" against the players and have a guaranteed expected return over the longrun.',
    'sidebar' => [
        'stats' => 'Be The Bank Stats',
        'new_investment' => 'Be The Bank - BETA',
        'your_bankroll' => 'Your Bankroll:',
        'your_bankroll_percent' => 'Your Bankroll %:',
        'your_share' => 'Your Share:',
        'your_investing_profit' => 'Your Investing Profit:',
        'site_bankroll' => "BitsArcade's Combined Bankroll:",
        'site_profit' => "BitsArcade's Profit so far:",
        'amount' => 'Amount (Min :min)',
        'invest' => 'Invest'
    ],
    'history' => [
        'amount' => 'Investment Amount',
        'your_share' => 'Your Share',
        'profit' => 'Current Amount',
        'status' => 'Status',
        'cancelled' => 'Cancelled',
        'disinvest' => 'Cancel Investment',
        'dead' => 'Lost'
    ],
    'tabs' => [
        'info' => 'Info',
        'history' => 'Your Investments'
    ],
    'info' => [
        '1' => [
            'title' => 'How does this work?',
            'description' => 'Unlike old casino\'s where you bet against a bankroll held solely and non-transparant by owners, we publically show available our hot wallet bankroll and give you the option to invest in the platform at low-entry or requirements completely automatically.
            When a player wins or loses, the bet goes to this public bankroll and generates profits (or losses) for all those who are invested. To counter possible abuse, we charge a small commission explained in detail below.'
        ],
        '2' => [
            'title' => 'Calculating Your Equity',
            'description' => 'Your equity share is equal to (Your_Investment / (Global_Bankroll + Your_Investment)) * 100%. If you had 1 BTC invested, and the global bankroll was 99 BTC before you invested, your share would be: (1 / (99 + 1)) * 100% = 1% meaning 1% of all profits and losses would be applied to your investment.'
        ],
        '3' => [
            'title' => 'Calculating profit and loss',
            'description' => 'To determine how much profit or loss you are receiving from a bet, calculate your share using the formulas above, or with the calculator on the investment tab. Once you have your share, multiply it by any profit or loss. By example, Ellie has a 10% share of the bankroll; a player loses 0.25 ETH on his bet. Ellie would receive 10% * 0.25 = 0.025 ETH in profits. The formula for profit/loss is Your_Share * Total_Profit = Your_Profit.'
        ],
        '4' => [
            'title' => 'Invest Commissions',
            'description' => 'Commissions are made up of two small fees, the "Invest Commission" and "Cancel Invest Commission" (Pulling out your money).
                                <br><br>
                                First, for the Invest Commission. We take a small 1% to 1.5% commission when you make your investment.
                                <br>
                                This same commission applies to pulling out your investment. You can view your investments on the \'Your Investments\' Tab and take out your investment instantly whenever you want.'
        ],
        '5' => [
            'title' => 'Are there any risks to investing?',
            'description' => 'Yes! On short-term, there is volatillity within lucky players. The longer you stay invested, the closer the expected profit (house odds) converts to net profit.'
        ]
    ]
];
