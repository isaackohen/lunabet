<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class Providers extends Model {

    protected $connection = 'mongodb';
    protected $collection = 'providers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'name'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

}
