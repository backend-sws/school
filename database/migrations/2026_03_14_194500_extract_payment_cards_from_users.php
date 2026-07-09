<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Move card columns from users to a dedicated payment_cards table.
     * One user → many cards.
     */
    public function up(): void
    {
        Schema::create('payment_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label', 50)->nullable();
            $table->string('card_last_four', 4);
            $table->string('card_holder_name', 50);
            $table->text('card_expiry_encrypted');
            $table->text('card_token_encrypted');
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index('user_id');
        });

        // Migrate existing data from users table
        $users = DB::table('users')
            ->whereNotNull('card_last_four')
            ->select(['id', 'card_last_four', 'card_holder_name', 'card_expiry_encrypted', 'card_token_encrypted'])
            ->get();

        foreach ($users as $user) {
            DB::table('payment_cards')->insert([
                'user_id' => $user->id,
                'label' => 'Primary',
                'card_last_four' => $user->card_last_four,
                'card_holder_name' => $user->card_holder_name ?? 'Card Holder',
                'card_expiry_encrypted' => $user->card_expiry_encrypted,
                'card_token_encrypted' => $user->card_token_encrypted,
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Drop the columns from users
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'card_last_four',
                'card_holder_name',
                'card_expiry_encrypted',
                'card_token_encrypted',
            ]);
        });
    }

    public function down(): void
    {
        // Restore columns on users
        Schema::table('users', function (Blueprint $table) {
            $table->string('card_last_four', 4)->nullable()->after('onboarding_data');
            $table->string('card_holder_name', 50)->nullable()->after('card_last_four');
            $table->text('card_expiry_encrypted')->nullable()->after('card_holder_name');
            $table->text('card_token_encrypted')->nullable()->after('card_expiry_encrypted');
        });

        // Migrate data back (default card only)
        $cards = DB::table('payment_cards')
            ->where('is_default', true)
            ->get();

        foreach ($cards as $card) {
            DB::table('users')->where('id', $card->user_id)->update([
                'card_last_four' => $card->card_last_four,
                'card_holder_name' => $card->card_holder_name,
                'card_expiry_encrypted' => $card->card_expiry_encrypted,
                'card_token_encrypted' => $card->card_token_encrypted,
            ]);
        }

        Schema::dropIfExists('payment_cards');
    }
};
