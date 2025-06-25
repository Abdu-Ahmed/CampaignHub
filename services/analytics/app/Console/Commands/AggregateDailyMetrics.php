<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\AnalyticsDailyMetric;
use Exception;

class AggregateDailyMetrics extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'analytics:aggregate-daily-metrics';

    /**
     * The console command description.
     */
    protected $description = 'Aggregate yesterday\'s metrics into daily summary table';

    public function handle(): int
    {
        $yesterday = now()->subDay()->toDateString();
        $token = $this->getToken();
        
        if (!$token) {
            $this->error('No analytics token configured. Please set ANALYTICS_SERVICE_TOKEN in your .env file.');
            return 1;
        }

        $base = config('services.campaign.url');
        
        $this->info("Fetching campaigns from: {$base}/api/campaigns");
        $this->info("Using token: " . substr($token, 0, 10) . "...");

        // Fetch all campaigns from Campaign service
        try {
            $response = Http::timeout(30)
                ->withToken($token)
                ->get("{$base}/api/campaigns");

            if (!$response->successful()) {
                $this->handleHttpError('campaigns', $response);
                return 1;
            }

            $campaigns = $response->json();
            
            if (!is_array($campaigns)) {
                $this->error("Expected array of campaigns, got: " . gettype($campaigns));
                $this->error("Response body: " . $response->body());
                return 1;
            }

            if (empty($campaigns)) {
                $this->info("No campaigns found, skipping aggregation.");
                return 0;
            }

            $this->info("Found " . count($campaigns) . " campaigns to process");

        } catch (Exception $e) {
            $this->error("Exception while fetching campaigns: " . $e->getMessage());
            return 1;
        }

        $processedCount = 0;
        $errorCount = 0;

        foreach ($campaigns as $campaign) {
            $campaignId = $campaign['id'] ?? null;
            
            if (!$campaignId) {
                $this->warn("Skipping campaign without ID: " . json_encode($campaign));
                continue;
            }

            $this->line("Processing campaign ID: {$campaignId}");

            try {
                    $from = "{$yesterday}T00:00:00Z";
                    $to   = "{$yesterday}T23:59:59Z";

                    $this->line("Fetching metrics for campaign {$campaignId} from {$from} to {$to}");

                    $metricsResponse = Http::timeout(30)
                        ->withToken($token)
                        ->get(
                            config('services.metrics.url') . "/api/campaigns/{$campaignId}/metrics",
                            ['from' => $from, 'to' => $to]
                        );

                if (!$metricsResponse->successful()) {
                    $this->handleHttpError("metrics for campaign {$campaignId}", $metricsResponse);
                    $errorCount++;
                    continue;
                }

                $events = $metricsResponse->json();
                
                if (!is_array($events)) {
                    $this->error("Expected array of events for campaign {$campaignId}, got: " . gettype($events));
                    $errorCount++;
                    continue;
                }

                $metrics = $this->aggregateMetrics($events);
                
                AnalyticsDailyMetric::updateOrCreate(
                    ['campaign_id' => $campaignId, 'date' => $yesterday],
                    $metrics
                );

                $this->line("✓ Campaign {$campaignId}: {$metrics['impressions']} impressions, {$metrics['clicks']} clicks, {$metrics['conversions']} conversions");
                $processedCount++;

            } catch (Exception $e) {
                $this->error("Exception processing campaign {$campaignId}: " . $e->getMessage());
                $errorCount++;
            }
        }

        $this->info("Completed: {$processedCount} campaigns processed, {$errorCount} errors");
        
        if ($processedCount > 0) {
            $this->info("Aggregated daily metrics for {$yesterday}");
        }

        return $errorCount > 0 ? 1 : 0;
    }

    private function handleHttpError(string $context, $response): void
    {
        $status = $response->status();
        $contentType = $response->header('Content-Type');
        
        $this->error("Failed to fetch {$context}: HTTP {$status}");
        $this->error("Content-Type: {$contentType}");
        
        // Handle different response types
        if (str_contains($contentType, 'application/json')) {
            $body = $response->json();
            $this->error("Error response: " . json_encode($body, JSON_PRETTY_PRINT));
        } elseif (str_contains($contentType, 'text/html')) {
            // Extract title and any obvious error messages from HTML
            $body = $response->body();
            
            // Try to extract page title
            if (preg_match('/<title>(.*?)<\/title>/i', $body, $matches)) {
                $this->error("Page title: " . trim($matches[1]));
            }
            
            // Try to extract any error messages
            if (preg_match('/<h1[^>]*>(.*?)<\/h1>/i', $body, $matches)) {
                $this->error("Error heading: " . strip_tags($matches[1]));
            }
            
            // Look for Laravel error traces
            if (preg_match('/Exception.*?in.*?line \d+/i', $body, $matches)) {
                $this->error("Exception: " . strip_tags($matches[0]));
            }
            
            $this->error("This appears to be an HTML error page. The service may be down or misconfigured.");
        } else {
            $body = $response->body();
            $preview = substr(strip_tags($body), 0, 200);
            $this->error("Raw response preview: {$preview}...");
        }
    }

    private function aggregateMetrics(array $events): array
    {
        $impressions = 0;
        $clicks = 0;
        $conversions = 0;

        foreach ($events as $event) {
            $metricType = $event['metric'] ?? '';
            $count = (int) ($event['count'] ?? 0);

            switch ($metricType) {
                case 'impression':
                case 'impressions':
                    $impressions += $count;
                    break;
                case 'click':
                case 'clicks':
                    $clicks += $count;
                    break;
                case 'conversion':
                case 'conversions':
                    $conversions += $count;
                    break;
            }
        }

        return [
            'impressions' => $impressions,
            'clicks' => $clicks,
            'conversions' => $conversions,
            'ctr' => $impressions > 0 ? $clicks / $impressions : 0,
            'conversion_rate' => $clicks > 0 ? $conversions / $clicks : 0,
        ];
    }

    /**
     * Retrieve a valid Sanctum token for internal calls
     */
    protected function getToken(): ?string
    {
        return config('services.analytics.token');
    }
}