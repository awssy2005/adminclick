<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracking_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained()->onDelete('cascade');
            $table->string('status');                    // soumise | en_traitement | expediee | livree | rejetee
            $table->text('description');
            $table->string('location')->nullable();       // ex. Centre de tri Casablanca
            $table->string('tracking_code')->nullable();  // code Barid Al-Maghrib ou autre
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_events');
    }
};
