<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ScheduleCampaign implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $campaignId;
    public string $token;
    public string $apiUrl;

    /**
     * Create a new job instance.
     *
     * @param int $campaignId
     * @param string $token // Sanctum token for authentication
     * @param string $apiUrl // Base URL of Campaign service
     */
    public function __construct(int $campaignId, string $token, string $apiUrl)
    {
        $this->campaignId = $campaignId;
        $this->token = $token;
        $this->apiUrl = rtrim($apiUrl, '/');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        try {
            // Trigger the campaign start endpoint
            $url = "{$this->apiUrl}/api/campaigns/{$this->campaignId}/start";
            $response = Http::withToken($this->token)
                ->post($url);

            if (! $response->successful()) {
                Log::error('ScheduleCampaign job failed', [
                    'campaignId' => $this->campaignId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                // Optionally: release or retry
            } else {
                Log::info('ScheduleCampaign job succeeded', ['campaignId' => $this->campaignId]);
            }
        } catch (\Exception $e) {
            Log::error('ScheduleCampaign job exception', [
                'campaignId' => $this->campaignId,
                'error' => $e->getMessage(),
            ]);
            // Fail the job
            $this->fail($e);
        }
    }
}