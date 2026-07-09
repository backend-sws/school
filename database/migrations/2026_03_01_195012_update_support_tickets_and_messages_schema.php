<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('support_tickets', function (Blueprint $table) {
            $table->renameColumn('ticket_no', 'ticket_id');
            $table->renameColumn('message', 'description');
            $table->renameColumn('attachment_url', 'attachment');

            $table->string('support_for', 100)->nullable()->after('user_id');
            $table->string('issue_type', 100)->nullable()->after('support_for');
            $table->timestamp('opened_on')->nullable()->after('status');
            $table->timestamp('closed_on')->nullable()->after('opened_on');
            $table->foreignId('closed_by')->nullable()->constrained('users')->after('closed_on');
        });

        Schema::table('support_messages', function (Blueprint $table) {
            $table->string('attachment', 500)->nullable()->after('message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('support_messages', function (Blueprint $table) {
            $table->dropColumn('attachment');
        });

        Schema::table('support_tickets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('closed_by');
            $table->dropColumn(['support_for', 'issue_type', 'opened_on', 'closed_on']);

            $table->renameColumn('ticket_id', 'ticket_no');
            $table->renameColumn('description', 'message');
            $table->renameColumn('attachment', 'attachment_url');
        });
    }
};
