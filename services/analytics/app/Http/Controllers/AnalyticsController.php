<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnalyticsDailyMetric;

class AnalyticsController extends Controller
{
    public function daily(Request $req, $campaign) {
  $from = $req->query('from');
  $to   = $req->query('to');
  $data = AnalyticsDailyMetric::where('campaign_id',$campaign)
    ->when($from, fn($q)=>$q->where('date','>=',$from))
    ->when($to,   fn($q)=>$q->where('date','<=',$to))
    ->orderBy('date')
    ->get();
  return response()->json($data);
}
}
