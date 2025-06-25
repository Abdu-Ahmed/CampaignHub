<?php

namespace App\GraphQL\Resolvers;

use Illuminate\Support\Facades\Http;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Http\Client\Response;
use GraphQL\Error\Error;

class Campaign
{
    protected string $baseUrl;
    protected string $metricsUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.campaign.url');
        $this->metricsUrl = config('services.metrics.url');
    }

    // 1) List campaigns
    public function all($_, array $args, GraphQLContext $ctx): array
    {
        $resp = $this->callService('get', '/api/campaigns', $ctx->request()->bearerToken());
        return array_map([$this, 'normalize'], $resp->json());
    }

    // 2) Fetch one campaign
    public function find($_, array $args, GraphQLContext $ctx): array
    {
        $id   = $args['id'];
        $resp = $this->callService('get', "/api/campaigns/{$id}", $ctx->request()->bearerToken());
        return $this->normalize($resp->json());
    }

    // 3) Create
    public function create($_, array $args, GraphQLContext $ctx): array
    {
        $resp = $this->callService('post', '/api/campaigns', $ctx->request()->bearerToken(), $args);
        return $this->normalize($resp->json());
    }

    // 4) Update
    public function update($_, array $args, GraphQLContext $ctx): array
    {
        $id = $args['id'];
        unset($args['id']);

        $resp = $this->callService('patch', "/api/campaigns/{$id}", $ctx->request()->bearerToken(), $args);
        return $this->normalize($resp->json());
    }

    // 5) Delete
    public function delete($_, array $args, GraphQLContext $ctx): bool
    {
        $id       = $args['id'];
        $response = $this->callService('delete', "/api/campaigns/{$id}", $ctx->request()->bearerToken());
        return $response->status() === 204;
    }

    // 6) Real metrics from metrics service
    public function metrics($_, array $args, GraphQLContext $ctx): array
    {
        try {
            $campaignId = $args['id'];
            $token = $ctx->request()->bearerToken();
            
            if (!$token) {
                throw new Error('Authentication token is required');
            }

            if (!$this->metricsUrl) {
                throw new Error('Metrics service URL not configured');
            }

            // Call the metrics service
            $response = Http::withToken($token)
                ->get("{$this->metricsUrl}/api/campaigns/{$campaignId}/metrics");

            if (!$response->successful()) {
                // If metrics service is down or campaign has no metrics, return zeros
                return $this->getEmptyMetrics();
            }

            $metricsData = $response->json();
            
            // Process the raw metrics data from the service
            return $this->processMetricsData($metricsData);

        } catch (\Exception $e) {
            // If there's any error, return empty metrics instead of failing
            error_log("Metrics service error for campaign {$campaignId}: " . $e->getMessage());
            return $this->getEmptyMetrics();
        }
    }

    /**
     * Process raw metrics data from the metrics service
     */
    private function processMetricsData(array $metricsData): array
    {
        // Initialize counters
        $impressions = 0;
        $clicks = 0;
        $conversions = 0;

        // Sum up metrics by type
        foreach ($metricsData as $metric) {
            switch ($metric['metric'] ?? '') {
                case 'impression':
                case 'impressions':
                    $impressions += (int) ($metric['count'] ?? 0);
                    break;
                case 'click':
                case 'clicks':
                    $clicks += (int) ($metric['count'] ?? 0);
                    break;
                case 'conversion':
                case 'conversions':
                    $conversions += (int) ($metric['count'] ?? 0);
                    break;
            }
        }

        // Calculate derived metrics
        $ctr = $impressions > 0 ? $clicks / $impressions : 0;
        $conversionRate = $clicks > 0 ? $conversions / $clicks : 0;

        return [
            'impressions' => $impressions,
            'clicks' => $clicks,
            'conversions' => $conversions,
            'ctr' => $ctr,
            'conversionRate' => $conversionRate,
        ];
    }

    /**
     * Return empty metrics structure
     */
    private function getEmptyMetrics(): array
    {
        return [
            'impressions' => 0,
            'clicks' => 0,
            'conversions' => 0,
            'ctr' => 0.0,
            'conversionRate' => 0.0,
        ];
    }

    /**
     * Duplicate an existing campaign (for GraphQL).
     * Since the microservice doesn't have a dedicated duplicate endpoint,
     * we'll fetch the original and create a new one.
     */
    public function duplicate($_, array $args, GraphQLContext $ctx): array
    {
        try {
            $token = $ctx->request()->bearerToken();
            $id = $args['id'];

            if (!$token) {
                throw new Error('Authentication token is required');
            }

            if (!$this->baseUrl) {
                throw new Error('Campaign service URL not configured');
            }

            // 1) Fetch original campaign from microservice
            $origResp = $this->callService('get', "/api/campaigns/{$id}", $token);
            $orig = $origResp->json();
            
            if (!is_array($orig) || empty($orig)) {
                throw new Error('Original campaign not found or invalid data received');
            }

            // 2) Prepare new campaign data for microservice
            $new = [
                'title' => 'Copy of ' . ($orig['title'] ?? 'Untitled'),
                'description' => $orig['description'] ?? null,
                'status' => 'draft',
                'start_date' => $this->formatDate($orig['start_date'] ?? null) ?: date('Y-m-d'),
            ];

            if (!empty($orig['end_date'])) {
                $new['end_date'] = $this->formatDate($orig['end_date']);
            }

            // Handle ab_config - keep the same format as the microservice expects
            if (!empty($orig['ab_config']) && is_array($orig['ab_config'])) {
                // The microservice likely expects snake_case based on your validation rules
                $new['ab_config'] = [
                    'variationA' => $orig['ab_config']['variationA'] ?? $orig['ab_config']['variation_a'] ?? null,
                    'variationB' => $orig['ab_config']['variationB'] ?? $orig['ab_config']['variation_b'] ?? null,
                    'splitA' => $orig['ab_config']['splitA'] ?? $orig['ab_config']['split_a'] ?? null,
                    'winner_metric' => $orig['ab_config']['winnerMetric'] ?? $orig['ab_config']['winner_metric'] ?? null,
                ];
            }

            // 3) Create the duplicate via the regular create endpoint
            $createdResp = $this->callService('post', "/api/campaigns", $token, $new);
            
            $responseBody = $createdResp->body();
            $responseStatus = $createdResp->status();
            
            error_log("DEBUG - Create Response Status: {$responseStatus}");
            error_log("DEBUG - Create Response Body: " . $responseBody);
            error_log("DEBUG - Create Payload Sent: " . json_encode($new));
            
            $created = $createdResp->json();
            
            if (!is_array($created) || empty($created)) {
                throw new Error("Failed to create campaign duplicate - Status: {$responseStatus}, Body: " . substr($responseBody, 0, 200));
            }

            return $this->normalize($created);

        } catch (Error $e) {
            // Re-throw GraphQL errors as-is
            throw $e;
        } catch (\Exception $e) {
            // Convert other exceptions to GraphQL errors
            throw new Error('Campaign duplication failed: ' . $e->getMessage());
        }
    }

    /**
     * Centralized HTTP + error-handling for calls to the campaign microservice.
     */
    protected function callService(string $method, string $uri, string $token, array $payload = []): Response
    {
        if (!$token) {
            throw new Error('Authentication token is required');
        }

        try {
            $response = Http::withToken($token)->{$method}("{$this->baseUrl}{$uri}", $payload);

            if (!$response->successful()) {
                $status = $response->status();
                $body = $response->body();
                
                // Try to extract meaningful error message
                $errorMessage = $this->extractErrorMessage($body) ?: "HTTP {$status}";
                
                throw new Error("Campaign service error: {$errorMessage}");
            }

            return $response;

        } catch (Error $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new Error('Failed to communicate with campaign service: ' . $e->getMessage());
        }
    }

    /**
     * Extract meaningful error message from response body
     */
    private function extractErrorMessage(string $body): ?string
    {
        // Try to decode JSON error response
        $decoded = json_decode($body, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded['message'] ?? $decoded['error'] ?? null;
        }

        // If it's HTML (like Laravel error pages), extract title or return generic message
        if (str_contains($body, '<title>')) {
            preg_match('/<title>(.*?)<\/title>/i', $body, $matches);
            return $matches[1] ?? 'Service returned HTML error page';
        }

        return null;
    }

    /**
     * Format date string to Y-m-d format
     */
    private function formatDate(?string $date): ?string
    {
        if (!$date) return null;
        
        if (str_contains($date, 'T')) {
            return substr($date, 0, 10);
        }
        
        return $date;
    }

    /**
     * Turn JSON from the service into your GraphQL "Campaign" shape.
     */
    protected function normalize(?array $c): array
    {
        if (!is_array($c) || empty($c)) {
            throw new Error('Invalid campaign data received from service');
        }
        
        // Handle ab_config conversion - works with both snake_case and camelCase
        $abConfig = null;
        if (isset($c['ab_config']) && is_array($c['ab_config'])) {
            $abConfig = [
                'variationA' => $c['ab_config']['variationA'] ?? $c['ab_config']['variation_a'] ?? null,
                'variationB' => $c['ab_config']['variationB'] ?? $c['ab_config']['variation_b'] ?? null,
                'splitA' => $c['ab_config']['splitA'] ?? $c['ab_config']['split_a'] ?? null,
                'winnerMetric' => $c['ab_config']['winnerMetric'] ?? $c['ab_config']['winner_metric'] ?? null,
            ];
        }
        
        return [
            'id' => (string) ($c['id'] ?? ''),
            'user_id' => $c['user_id'] ?? null,
            'title' => $c['title'] ?? '',
            'description' => $c['description'] ?? null,
            'start_date' => $c['start_date'] ?? null,
            'end_date' => $c['end_date'] ?? null,
            'schedule_time' => $c['schedule_time'] ?? null,
            'status' => $c['status'] ?? 'draft',
            'ab_config' => $abConfig,
            'created_at' => $c['created_at'] ?? null,
            'updated_at' => $c['updated_at'] ?? null,
        ];
    }
}