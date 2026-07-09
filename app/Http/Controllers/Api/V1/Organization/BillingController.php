<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Enums\SubscriptionTier;
use App\Models\Organization;
use App\Support\ApiErrorMap;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function __construct(private SubscriptionService $subscriptionService)
    {
    }

    /**
     * Display the plans / pricing page.
     */
    public function index(Request $request)
    {
        $org = $this->resolveOrganization($request);
        $sub = $org?->subscription;

        $currentSubscription = $sub ? [
            'tier' => $sub->tier,
            'tier_label' => $sub->resolvedTier()->label(),
            'is_trial' => $sub->isOnTrial(),
            'ends_at' => $sub->subscription_end?->toDateString(),
            'trial_ends_at' => $sub->trial_ends_at?->toDateString(),
            'is_active' => $sub->isActive(),
        ] : null;

        $plans = collect(SubscriptionTier::cases())->map(fn($tier) => [
            'id' => $tier->value,
            'name' => $tier->label(),
            'price_monthly' => $tier->monthlyPrice(),
            'price_annual' => $tier->annualPrice(),
            'limits' => $tier->limits(),
            'modules' => $tier->modules(),
            'is_current' => $sub && $sub->resolvedTier() === $tier,
            'is_recommended' => $tier === SubscriptionTier::PROFESSIONAL,
        ]);

        return Inertia::render('billing/plans', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
        ]);
    }

    /**
     * Select a plan and initiate checkout.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'tier' => 'required|string',
            'cycle' => 'required|in:monthly,annual',
        ]);

        $tier = SubscriptionTier::tryFrom($request->tier);
        if (!$tier) {
            return back()->with('error', ApiErrorMap::message('billing.invalid_plan'));
        }

        return Inertia::render('billing/checkout', [
            'plan' => [
                'id' => $tier->value,
                'name' => $tier->label(),
                'price' => $request->cycle === 'monthly' ? $tier->monthlyPrice() : $tier->annualPrice(),
                'cycle' => $request->cycle,
            ],
            'publishableKey' => config('services.razorpay.key'),
        ]);
    }

    /**
     * Handle payment success callback.
     */
    public function paymentSuccess(Request $request)
    {
        $org = $this->resolveOrganization($request);
        if (!$org)
            ApiErrorMap::abort('billing.org_not_found');

        $tier = SubscriptionTier::tryFrom($request->tier);
        if (!$tier)
            ApiErrorMap::abort('billing.invalid_plan');

        $this->subscriptionService->applyTier($org, $tier, $request->cycle ?? 'monthly');

        return redirect()->route('billing.plans')->with('success', 'Subscription updated successfully!');
    }

    /**
     * Resolve organization from current user.
     */
    private function resolveOrganization(Request $request): ?Organization
    {
        $user = $request->user();
        $institution = $user->institution ?? null;
        return $institution ? Organization::find($institution->organization_id) : null;
    }
}
