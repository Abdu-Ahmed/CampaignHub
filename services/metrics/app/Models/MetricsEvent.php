<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetricsEvent extends Model
{
    use HasFactory;

    protected $table = 'metrics';
    protected $fillable = ['campaign_id', 'metric', 'count', 'recorded_at'];
    protected $casts = ['recorded_at' => 'datetime'];
}
