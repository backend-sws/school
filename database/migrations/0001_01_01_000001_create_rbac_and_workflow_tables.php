<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('key', 64);
            $table->string('name', 100);
            $table->integer('level');
            $table->text('description')->nullable();
            $table->boolean('is_system')->default(false);
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['key', 'scope_type', 'scope_id']);
            $table->index(['scope_type', 'scope_id']);
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('key', 128);
            $table->string('name', 150);
            $table->string('module', 50)->nullable();
            $table->text('description')->nullable();
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['scope_type', 'scope_id']);
        });

        Schema::create('role_permissions', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->foreignId('assigned_by')->nullable()->constrained('users');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();

            $table->unique(['user_id', 'role_id', 'scope_type', 'scope_id']);
            $table->index(['user_id']);
            $table->index(['scope_type', 'scope_id']);
        });

        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('token_hash');
            $table->string('device_info', 255)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('expires_at');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('revoked_at')->nullable();

            $table->index(['user_id']);
            $table->index(['token_hash']);
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->string('action', 100);
            $table->string('entity_type', 50)->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->jsonb('old_values')->nullable();
            $table->jsonb('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id']);
            $table->index(['entity_type', 'entity_id']);
            $table->index(['created_at']);
        });

        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->string('key', 64);
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->timestamps();

            $table->unique(['key', 'scope_type', 'scope_id']);
            $table->index(['scope_type', 'scope_id']);
        });

        Schema::create('workflow_permissions', function (Blueprint $table) {
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->primary(['workflow_id', 'permission_id']);
        });

        Schema::create('role_workflows', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->primary(['role_id', 'workflow_id']);
        });

        Schema::create('user_workflows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->foreignId('assigned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('assigned_at')->useCurrent();

            $table->unique(['user_id', 'workflow_id', 'scope_type', 'scope_id'], 'usr_wf_scp_unique');
            $table->index(['scope_type', 'scope_id']);
        });

        Schema::create('user_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->boolean('granted');
            $table->string('scope_type', 32)->nullable();
            $table->unsignedBigInteger('scope_id')->nullable();

            $table->unique(['user_id', 'permission_id', 'scope_type', 'scope_id'], 'usr_perm_scp_unique');
            $table->index(['scope_type', 'scope_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
        Schema::dropIfExists('user_workflows');
        Schema::dropIfExists('role_workflows');
        Schema::dropIfExists('workflow_permissions');
        Schema::dropIfExists('workflows');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('refresh_tokens');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
