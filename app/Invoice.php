<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Invoice extends Model {

    protected $connection = 'mongodb';
    protected $collection = 'invoices';

    protected $fillable = [
        'user', 'sum', 'currency', 'id', 'confirmations', 'ledger', 'payid', 'hash', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user', 'id');
    }

}
