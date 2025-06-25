<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticsDailyMetric extends Model {

  use HasFactory;
  protected $fillable = [
    'campaign_id','date','impressions','clicks','conversions','ctr','conversion_rate'
  ];
  protected $casts = ['date'=>'date'];
}
