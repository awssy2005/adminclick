<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── demandes: tracking_code ──
        Schema::table('demandes', function (Blueprint $table) {
            if (!Schema::hasColumn('demandes', 'tracking_code')) {
                $table->string('tracking_code')->nullable()->after('status');
            }
        });

        // ── users: notification preferences ──
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'notif_email')) {
                $table->boolean('notif_email')->default(true)->after('role');
            }
            if (!Schema::hasColumn('users', 'notif_sms')) {
                $table->boolean('notif_sms')->default(false)->after('notif_email');
            }
            if (!Schema::hasColumn('users', 'notif_whatsapp')) {
                $table->boolean('notif_whatsapp')->default(false)->after('notif_sms');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('notif_whatsapp');
            }
        });

        // ── sms_logs: simulated SMS delivery ──
        if (!Schema::hasTable('sms_logs')) {
            Schema::create('sms_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
                $table->string('to_phone');
                $table->text('content');
                $table->string('channel')->default('sms'); // sms | whatsapp
                $table->string('status')->default('simulated');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::table('demandes', fn($t) => $t->dropColumn('tracking_code'));
        Schema::table('users', fn($t) => $t->dropColumn(['notif_email', 'notif_sms', 'notif_whatsapp', 'phone']));
        Schema::dropIfExists('sms_logs');
    }
};
