<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('metrics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('campaign_id');
            $table->string('metric');
            $table->unsignedBigInteger('count');
            $table->timestamp('recorded_at');
            $table->timestamps();
            $table->index(['campaign_id', 'metric']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('metrics');
    }
};