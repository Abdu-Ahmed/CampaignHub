<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MetricsEvent;

class MetricsController extends Controller
{
    public function store(Request $req)
    {
        $data = $req->validate([
            'campaign_id' => 'required|integer',
            'metric'      => 'required|string',
            'count'       => 'required|integer',
            'timestamp'   => 'required|date',
        ]);

        MetricsEvent::create([
            'campaign_id' => $data['campaign_id'],
            'metric'      => $data['metric'],
            'count'       => $data['count'],
            'recorded_at' => $data['timestamp'],
        ]);

        return response()->json(['success' => true], 201);
    }

    public function index(Request $req, $campaign)
    {
        $query = MetricsEvent::where('campaign_id', $campaign);
        if ($from = $req->query('from')) {
            $query->where('recorded_at', '>=', $from);
        }
        if ($to = $req->query('to')) {
            $query->where('recorded_at', '<=', $to);
        }
        return response()->json($query->orderBy('recorded_at')->get());
    }
}