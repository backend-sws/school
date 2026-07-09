<?php

namespace App\Providers;

require_once __DIR__ . '/../Support/aws_signature_skew_patch.php';

use App\Support\InstitutionContext;
use Illuminate\Auth\Events\Login;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'admission_application' => \App\Models\AdmissionApplication::class,
        ]);

        if (config('app.env') === 'production') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        if (request()->is('api/*')) {
            request()->headers->set('Accept', 'application/json');
        }

        // Global API rate limiter: disable in local dev, 300 req/min in production
        RateLimiter::for('api', function (Request $request) {
            if (config('app.env') === 'local') {
                return null;
            }
            return Limit::perMinute(300)->by($request->user()?->id ?: $request->ip());
        });

        Event::listen(Login::class, function (Login $event) {
            InstitutionContext::refreshDefaultAfterLogin($event->user);
        });
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Mail\Events\MessageSent::class,
            \App\Listeners\LogSentMessage::class
        );
    }
}
