<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Slotslist extends Model {

    protected $connection = 'mongodb';
    protected $collection = 'slotslist';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'n', 'desc', 'p', 'f'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

}
