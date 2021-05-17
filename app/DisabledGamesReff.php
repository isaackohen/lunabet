<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

class DisabledGamesReff extends Model {

    protected $connection = 'mongodb';
    protected $collection = 'disabled_gamesreff';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

}
