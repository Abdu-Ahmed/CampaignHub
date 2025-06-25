<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Jobs\ScheduleCampaign;
use Carbon\Carbon;

class DispatchScheduledCampaigns extends Command
{
    protected $signature   = 'campaigns:dispatch-scheduled';
    protected $description = 'Find all campaigns that should start now and dispatch ScheduleCampaign jobs';

    public function handle()
    {
        $apiUrl = config('services.campaign.url');
        $token  = config('services.scheduler.api_token');
        $nowIso = Carbon::now()->toIso8601String();

        // Fetch campaigns scheduled to start now or earlier
        $response = Http::withToken($token)
            ->get("{$apiUrl}/api/campaigns", [
                'status'    => 'scheduled',
                'dueBefore' => $nowIso,
            ]);

        if (! $response->successful()) {
            $this->error("Failed to fetch scheduled campaigns: {$response->body()}");
            return 1;
        }

        $scheduledList = $response->json();
        $count = 0;
        foreach ($scheduledList as $campaignData) {
            ScheduleCampaign::dispatch(
                $campaignData['id'],
                $token,
                $apiUrl
            );
            $count++;
        }

        $this->info("Dispatched {$count} scheduled campaign job(s).");
        return 0;
    }
}
