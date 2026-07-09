import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/use-subscription';
import { Link } from '@inertiajs/react';
import { Lock, Zap } from 'lucide-react';
import React from 'react';

interface UpgradePromptProps {
    title?: string;
    description?: string;
    featureName?: string;
}

/**
 * A premium upgrade prompt component shown when a user tries to access a locked feature.
 */
export function UpgradePrompt({
    title = 'Premium Feature',
    description = 'This feature is available on higher subscription plans.',
    featureName,
}: UpgradePromptProps) {
    const subscription = useSubscription();

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
            <Card className="w-full max-w-md border-dashed border-2 bg-muted/30">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Lock className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-balance mt-2">
                        {featureName ? (
                            <>
                                <strong>{featureName}</strong> is not included in your current{' '}
                                <span className="font-semibold text-foreground">{subscription?.tier_label ?? 'Starter'}</span> plan.
                            </>
                        ) : (
                            description
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Unlock this and many other premium features by upgrading your organization's subscription.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button asChild className="w-full gap-2 shadow-lg shadow-primary/20" size="lg">
                        <Link href={route('billing.plans')}>
                            <Zap className="h-4 w-4" />
                            Upgrade Now
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full">
                        <Link href={route('dashboard')}>Back to Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
