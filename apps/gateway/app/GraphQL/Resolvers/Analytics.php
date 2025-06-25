<?php

namespace App\GraphQL\Resolvers;

use Illuminate\Support\Facades\Http;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Error\Error;

class Analytics
{
    protected string $baseUrl;
    protected string $tokenHeader;

    public function __construct()
    {
        $this->baseUrl = config('services.analytics.url');
    }

    /**
     * dailyMetrics: proxy to analytics service
     */
    public function daily($_, array $args, GraphQLContext $ctx): array
    {
        $campaignId = $args['campaignId'];
        $from       = $args['from'];
        $to         = $args['to'];
        $token      = $ctx->request()->bearerToken();

        if (! $token) {
            throw new Error('Authentication token is required');
        }

        $resp = Http::withToken($token)
            ->get("{$this->baseUrl}/api/analytics/campaigns/{$campaignId}/daily", [
                'from' => $from,
                'to'   => $to,
            ]);

        if (! $resp->successful()) {
            throw new Error("Analytics service error: HTTP {$resp->status()}");
        }

        // Each item already has date, impressions, clicks, conversions, ctr, conversion_rate
        // Rename conversion_rate → conversionRate for GraphQL
        return array_map(function($item){
            return [
              'date'           => $item['date'],
              'impressions'    => (int) $item['impressions'],
              'clicks'         => (int) $item['clicks'],
              'conversions'    => (int) $item['conversions'],
              'ctr'            => (float) $item['ctr'],
              'conversionRate' => (float) $item['conversion_rate'],
            ];
        }, $resp->json());
    }
}
