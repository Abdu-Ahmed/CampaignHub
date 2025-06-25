<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // dispatch any campaigns whose schedule_time has arrived
        $schedule->call(function () {
            \App\Models\Campaign::where('status', 'scheduled')
                ->where('schedule_time', '<=', now())
                ->get()
                ->each(fn($camp) => \App\Jobs\StartCampaign::dispatch($camp));
        })->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
