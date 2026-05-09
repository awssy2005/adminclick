<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            // Propriétaire du document (coffre-fort personnel)
            if (!Schema::hasColumn('documents', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade')->after('id');
            }
            // Type de document (ex: acte_naissance, certificat_residence, autre)
            if (!Schema::hasColumn('documents', 'type')) {
                $table->string('type')->default('autre')->after('file_size');
            }
            // Chiffrement activé (pour une future implémentation)
            if (!Schema::hasColumn('documents', 'encrypted')) {
                $table->boolean('encrypted')->default(false)->after('type');
            }
            // Lien de partage temporaire
            if (!Schema::hasColumn('documents', 'share_token')) {
                $table->string('share_token')->nullable()->unique()->after('encrypted');
            }
            if (!Schema::hasColumn('documents', 'share_expires_at')) {
                $table->timestamp('share_expires_at')->nullable()->after('share_token');
            }
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['type', 'encrypted', 'share_token', 'share_expires_at']);
            if (Schema::hasColumn('documents', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }
        });
    }
};
