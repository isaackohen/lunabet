<?php

return [
    'vip' => [
        'description' => '<strong>Daily VIP Bonus</strong><br>As a member of the VIP reward program, you are entitled for a daily VIP bonus. Find out more about this!',
        'unavailable_description' => '<strong>Daily VIP Bonus</strong><br>All VIP program participants are entitled for a daily bonus.'
    ],
    'wheel' => [
        'description' => '<strong>Wheel</strong><br>Spin the wheel every 3 minutes<br>for a free bonus!',
        'title' => 'Wheel',
        'prompt' => 'Looking for a free bonus?<br>Check out our Wheel!'
    ],
    'promo' => [
        'description' => '<strong>Redeem Code</strong><br>Have a code? Redeem it and get a bonus!',
        'activate' => 'Activate',
        'title' => 'Redeem Code',
        'placeholder' => 'Code',
        'success' => 'Success',
        'invalid' => 'Invalid code',
        'expired_time' => 'Invalid code.',
        'expired_usages' => 'Invalid code: activation limit exceeded.',
        'used' => 'You have already used this code.'
    ],
    'agm' => [
        'invalid' => 'You have not met all requirements.',
        'normaloffer1success' => 'Success! Free spins have been added to your account.',
        'success' => 'Success! Sent to offerwall provider.'
    ],
    'partner' => [
        'description' => '<strong>Affiliate program</strong><br>Invite your friends to Bitsarcade.com and get a bonus!'
    ],
    'rain' => [
        'description' => '<strong>Rain</strong><br>Every few hours, an event occurs in the chat that distributes the bonus to random people.',
        'title' => 'Rain',
        'modal_description' => 'Rain is a chatbot that distributes coins to random people. <br> Criteria for getting in the rain:<ul class="mt-2"><li>Deposit is required in the last 24 hours</li><li>The bot sends a random number of coins at a random time (the minimum number of distributions is 10 per day, the maximum is 20)</li><li>Number of people - from 5 to 15</li></ul>'
    ],
    'discord' => [
        'title' => 'Discord',
        'common_desc' => 'Join our Discord server and get a bonus!',
        'description' => '<strong>Discord</strong><br>Join our Discord server and get a bonus!',
        'redirect' => 'Link account',
        'link' => 'To receive a bonus, you have to:<ul><li>Link your Discord account</li><li>Join <a href="'.\App\Settings::where('name', 'discord_invite_link')->first()->value.'" target="_blank">our Discord server</a></li></ul>After linking your Discord account and joining the server, return to this page and click on the "Verify" button.',
        'subscribe' => '<a href="'.\App\Settings::where('name', 'discord_invite_link')->first()->value.'" target="_blank">Join our Discord server</a> to receive a bonus.<br>After joining, click on the "Verify" button and the bonus will instantly be credited!',
        'check' => 'Verify',
        'redirect_group' => 'Join our Discord server',
        'success' => 'Success!',
        'error' => [
            '1' => 'You haven\'t joined our Discord server.',
            '2' => 'You have already received this bonus.'
        ]
    ],
    'notifications' => [
        'description' => '<strong>Notifications</strong><br>Turn on notifications and know about Bitsarcade.com updates among the first!'
    ]
];
