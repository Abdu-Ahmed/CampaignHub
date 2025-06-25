<?php

namespace App\Console;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\DispatchScheduledCampaigns;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        DispatchScheduledCampaigns::class,
    ];

    protected function schedule(\Illuminate\Console\Scheduling\Schedule $schedule)
    {
        $schedule->command('campaigns:dispatch-scheduled')
             ->everyMinute()
             ->withoutOverlapping();
    }

    
}