<?php

return [
    'tabs' => [
        'deposit' => 'Пополнение',
        'withdraw' => 'Вывод',
        'history' => 'История',
        'deposits' => 'Пополнения',
        'withdraws' => 'Выводы'
    ],
    'deposit' => [
        'address' => 'Ваш адрес для депозита :currency',
        'confirmations' => 'Отправляйте :currency только на этот адрес, количество подтверждений: :confirmations.'
    ],
    'withdraw' => [
        'address' => '<i class=":icon"></i> :currency адрес',
        'amount' => 'Сумма (Минимальная: :min <i class=":icon"></i>)',
        'button' => 'Вывести',
        'fee' => 'С вашего баланса дополнительно спишется :fee <i class=":icon"></i> для покрытия комиссии.'
    ],
    'history' => [
        'empty' => 'Вы еще ничего не заказывали.',
        'name' => 'Валюта',
        'sum' => 'Сумма',
        'date' => 'Дата',
        'confirmations' => 'Подтверждения',
        'status' => 'Статус',
        'not_paid' => 'Не оплачено',
        'paid' => 'Оплачено',
        'wallet' => 'Кошелек: :wallet',
        'cancel' => 'Отменить',
        'withdraw_cancelled' => 'Выплата была отменена.',
        'withdraw_status' => [
            'moderation' => 'Модерация',
            'accepted' => 'Выплачено',
            'declined' => 'Отклонено модератором',
            'reason' => 'Причина:',
            'cancelled' => 'Отменено пользователем'
        ]
    ],
    'copy' => 'Скопировать',
    'copied' => 'Скопировано!'
];
