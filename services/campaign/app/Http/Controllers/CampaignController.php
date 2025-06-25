<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Jobs\StartCampaign;

class CampaignController extends Controller
{
    // List campaigns for the authenticated user
    public function index(Request $req)
    {
        $query = Campaign::query();

        // 1) Only admins see everybody’s — everybody else only their own
        if ($req->user()->role !== 'admin') {
            $query->where('user_id', $req->user()->id);
        }

        // 2) Optional status filter
        if ($req->filled('status')) {
            $query->where('status', $req->status);
        }

        // 3) Optional dueBefore filter (ISO-8601 timestamp)
        if ($req->filled('dueBefore')) {
            $query->where('schedule_time', '<=', $req->dueBefore);
        }

        return $query->get();
    }


    // Create a new campaign
    public function store(Request $req)
    {
        $data = $req->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'start_date'    => 'required|date',
            'schedule_time' => 'nullable|date|after_or_equal:start_date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'status'        => 'in:draft,scheduled,active',
            'ab_config'     => 'nullable|array',
            'ab_config.variationA' => 'required_with:ab_config|string',     
            'ab_config.variationB' => 'required_with:ab_config|string',     
            'ab_config.splitA' => 'required_with:ab_config|integer|between:0,100', 
            'ab_config.winner_metric'  => 'nullable|string|in:impressions,clicks,conversions',
        ]);

        $data['user_id'] = $req->user()->id;
        $campaign = Campaign::create($data);

        return response()->json($campaign, 201);
    }


    // Show a single campaign
    public function show(Campaign $campaign)
    {
        $this->authorize('view', $campaign);
        return $campaign;
    }

    // Update an existing campaign
    public function update(Request $req, Campaign $campaign)
    {
        $this->authorize('update', $campaign);

        $data = $req->validate([
            'title'         => 'sometimes|required|string|max:255',
            'description'   => 'nullable|string',
            'start_date'    => 'sometimes|required|date',
            'schedule_time' => 'nullable|date|after_or_equal:now',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'status'        => 'in:draft,scheduled,active',
            'ab_config'     => 'nullable|array',
            'ab_config.variationA' => 'required_with:ab_config|string',     
            'ab_config.variationB' => 'required_with:ab_config|string',     
            'ab_config.splitA' => 'required_with:ab_config|integer|between:0,100', 
            'ab_config.winner_metric'  => 'nullable|string|in:impressions,clicks,conversions',
        ]);

        // auto-set status when scheduling:
        if (isset($data['schedule_time'])) {
            $data['status'] = 'scheduled';
        }

        $campaign->update($data);

        if (! empty($data['schedule_time'])) {
            StartCampaign::dispatch($campaign)
                ->delay($campaign->schedule_time);
        }

        return response()->json($campaign);
    }
    

    // Delete a campaign
    public function destroy(Campaign $campaign)
    {
        $this->authorize('delete', $campaign);
        $campaign->delete();
        return response()->noContent();
    }


    /**
     * Duplicate the given campaign for the current user.
     */
    public function duplicate(Request $req, Campaign $campaign)
    {
        $this->authorize('view', $campaign);

        // clone the record, resetting the primary key and status → draft
        $copy = $campaign->replicate([
            // only replicate these attributes; do NOT replicate id, timestamps
            'title', 'description', 'start_date', 'end_date', 'schedule_time', 'ab_config'
        ]);

        $copy->title       = 'Copy of ' . $campaign->title;
        $copy->status      = 'draft';
        $copy->user_id     = $req->user()->id;
        $copy->created_at  = now();
        $copy->updated_at  = now();

        $copy->save();

        return response()->json($copy, 201);
    }
}
