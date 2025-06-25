<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

class DispatchController extends Controller
{
    /**
     * Trigger the dispatch of scheduled campaigns
     */
    public function dispatchScheduled(Request $request): JsonResponse
    {
        try {
            // Call the existing Artisan command
            $exitCode = Artisan::call('campaigns:dispatch-scheduled');
            $output = Artisan::output();

            if ($exitCode === 0) {
                // Parse the output to get the count
                // Your command outputs: "Dispatched X scheduled campaign job(s)."
                preg_match('/Dispatched (\d+) scheduled campaign/', $output, $matches);
                $count = isset($matches[1]) ? (int)$matches[1] : 0;

                return response()->json([
                    'success' => true,
                    'dispatched' => $count,
                    'message' => trim($output)
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'dispatched' => 0,
                    'error' => 'Command failed with exit code ' . $exitCode,
                    'output' => $output
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'dispatched' => 0,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}