<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            // JSON column to hold variations and split %.
            $table->json('ab_config')
                  ->nullable()
                  ->after('status')
                  ->comment('{"variation_a": "...", "variation_b": "...", "split_a": 50, "winner_metric": "clicks"}');
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('ab_config');
        });
    }
};
