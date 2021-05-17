<?php

return [
    'tabs' => [
        'overview' => 'Overview',
        'list' => 'Referrals',
        'analytics' => 'Analytics'
    ],
    'overview' => [
        'guest_content' => "<p>Advertise and earn crypto by spreading the word about Lunabet!</p>
                      <p>You will receive various rewards for each active user who will register and play through your link.</p>
                      <button class='btn btn-primary' onclick='$.auth();'>Login</button>",
        'content' => "<p>Advertise lunabet.io and earn tons of crypto!</p>
                      <p>You will receive various bonuses for each active user you bring through your link.</p>
                      <strong class='mt-2'>Referral link</strong>
                      <input readonly class='mt-2' style='cursor: pointer !important;' id='link' data-toggle='tooltip' data-placement='top' title='Copy link' value='https://lunabet.io/?c=:id'>
                      <p class='mt-4'><strong>Rewards</strong><ul>
                      <li>You will also receive a small bonus once your referral is deemed active. You can track this through the \"Referrals\" tab.</li>
                      <li>You will get between 0.09% and 0.15% of each of your referral's bet, depending on your referral's VIP level.</li></ul></p>"
    ],
    'list' => [
        'name' => 'Name',
        'activity' => 'Activity bonus received'
    ],
    'analytics' => [
        'referrals' => '<strong>Number of referrals:</strong> :count',
        'referrals_bonus' => '<strong>Active referrals:</strong> :count',
        'referrals_wheel' => '<strong>Received bonuses for 10 active referrals:</strong> :count'
    ]
];
