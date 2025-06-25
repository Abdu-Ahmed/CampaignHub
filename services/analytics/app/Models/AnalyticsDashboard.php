<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class AnalyticsDashboard extends Model {
  protected $fillable = ['user_id','name','config'];
  protected $casts = ['config'=>'array'];
}
