<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class RecentSlots extends Model {

    protected $connection = 'mongodb';
    protected $collection = 'recentslots';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 's', 'b'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

}
