<?php

namespace App\GraphQL\Resolvers;

use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Scheduler
{
    /**
     * Dispatch any due campaigns via the scheduler service.
     * Returns the number of jobs dispatched.
     */
    public function dispatch($_, array $args, GraphQLContext $ctx): int
    {
        // make sure the user is authenticated
        if (! $ctx->request()->user()) {
            throw new Error('Unauthenticated.');
        }

        $schedulerUrl = rtrim(config('services.scheduler.url'), '/');

        if (! $schedulerUrl) {
            throw new Error('Scheduler service URL not configured.');
        }

        try {
            // explicitly send JSON headers
            $response = Http::timeout(30)
                ->withHeaders([
                    'Accept'       => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post("{$schedulerUrl}/api/dispatch-scheduled");

            // log raw for debugging
            Log::debug('Scheduler response', [
                'url'    => "{$schedulerUrl}/api/dispatch-scheduled",
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if (! $response->successful()) {
                throw new Error("Scheduler call failed ({$response->status()}): " . $response->body());
            }

            $data = $response->json();

            if (! isset($data['dispatched'])) {
                throw new Error('Unexpected scheduler response: ' . $response->body());
            }

            return (int) $data['dispatched'];
        } catch (\Exception $e) {
            Log::error('Exception while calling scheduler service', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);
            throw new Error('Error dispatching campaigns: ' . $e->getMessage());
        }
    }
}
