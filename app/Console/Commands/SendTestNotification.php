<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\TestNotification;
use Illuminate\Console\Command;

class SendTestNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notification:test
                            {user : User ID or email to send the test notification to}
                            {--title= : Optional notification title}
                            {--body= : Optional notification body}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test real-time notification to a user (for local/dev testing).';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $userInput = $this->argument('user');
        $user = is_numeric($userInput)
            ? User::find((int) $userInput)
            : User::where('email', $userInput)->first();

        if (! $user) {
            $this->error("User not found: {$userInput}");

            return self::FAILURE;
        }

        $title = $this->option('title') ?? 'Test notification';
        $body = $this->option('body') ?? 'If you see this, real-time notifications are working.';

        $user->notify(new TestNotification($title, $body));

        $this->info("Test notification sent to user #{$user->id} ({$user->email}).");
        $this->line('Open the app in the browser as this user to see the live toast (or check DB notifications).');

        return self::SUCCESS;
    }
}
