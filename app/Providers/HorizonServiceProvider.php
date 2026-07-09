<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Laravel\Horizon\Horizon;
use Illuminate\Support\ServiceProvider;

class HorizonServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Register the Horizon gate.
     *
     * This gate determines who can access Horizon in non-local environments.
     */
    protected function gate(): void
    {
        Gate::define('viewHorizon', function ($user) {
            // Only super admins can access the Horizon dashboard
            $isSuperAdmin = $user->roles()
                ->whereHas('role', fn ($q) => $q->where('name', 'super_admin'))
                ->exists();

            return $isSuperAdmin;
        });
    }
}
