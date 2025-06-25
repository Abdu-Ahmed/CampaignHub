<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('analytics_daily_metrics', function(Blueprint $t){
        $t->id();
        $t->unsignedBigInteger('campaign_id');
        $t->date('date');
        $t->unsignedBigInteger('impressions')->default(0);
        $t->unsignedBigInteger('clicks')->default(0);
        $t->unsignedBigInteger('conversions')->default(0);
        $t->float('ctr', 8, 4)->default(0);
        $t->float('conversion_rate', 8, 4)->default(0);
        $t->timestamps();
        $t->unique(['campaign_id','date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_daily_metrics');
    }
};
