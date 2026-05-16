<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Régions ──────────────────────────────────────────────────────────
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('nom_fr', 120);
            $table->string('nom_ar', 120);
            $table->string('code', 10)->unique();
            $table->timestamps();
        });

        // ── Provinces / Préfectures ───────────────────────────────────────────
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained('regions')->cascadeOnDelete();
            $table->string('nom_fr', 120);
            $table->string('nom_ar', 120);
            $table->string('code', 10)->unique();
            $table->enum('type', ['province', 'prefecture'])->default('province');
            $table->timestamps();

            $table->index('region_id');
        });

        // ── Communes ─────────────────────────────────────────────────────────
        Schema::create('communes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->constrained('provinces')->cascadeOnDelete();
            $table->string('nom_fr', 120);
            $table->string('nom_ar', 120);
            $table->string('code', 12)->unique();
            $table->enum('type', ['commune_urbaine', 'commune_rurale', 'arrondissement'])->default('commune_urbaine');
            $table->timestamps();

            $table->index('province_id');
        });

        // ── Districts / Arrondissements / Moqataa ────────────────────────────
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commune_id')->constrained('communes')->cascadeOnDelete();
            $table->string('nom_fr', 150);
            $table->string('nom_ar', 150);
            $table->string('code', 14)->nullable()->unique();
            $table->timestamps();

            $table->index('commune_id');
        });

        // ── Bureaux d'État Civil ──────────────────────────────────────────────
        Schema::create('civil_offices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commune_id')->constrained('communes')->cascadeOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->string('nom_fr', 200);
            $table->string('nom_ar', 200);
            $table->string('code', 16)->nullable()->unique();
            $table->string('adresse_fr', 255)->nullable();
            $table->string('adresse_ar', 255)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->timestamps();

            $table->index(['commune_id', 'district_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('civil_offices');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('communes');
        Schema::dropIfExists('provinces');
        Schema::dropIfExists('regions');
    }
};
