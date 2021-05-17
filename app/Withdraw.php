<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Withdraw extends Model {

    protected $connection = 'mongodb';

    protected $collection = 'withdraws';

    protected $fillable = [
        'user', 'sum', 'currency', 'address', 'status', 'decline_reason', 'auto'
    ];

}
