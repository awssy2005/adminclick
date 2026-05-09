<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('documents')) {
            return; // Table créée par une version antérieure — ignoré
        }

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('path');
            $table->string('type')->default('autre');
            $table->boolean('encrypted')->default(false);
            $table->unsignedBigInteger('size')->default(0);
            $table->string('share_token')->nullable()->unique();
            $table->timestamp('share_expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
