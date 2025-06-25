<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'schedule_time',
        'end_date',
        'user_id',
        'status',
        'ab_config',       
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date'   => 'date',
        'end_date'     => 'date',
        'schedule_time'=> 'datetime',
        'ab_config'     => 'array',
    ];
}
