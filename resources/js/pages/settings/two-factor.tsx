import HeadingSmall from '@/components/heading-small';
import { useRegisterGuide } from '@/components/GuideProvider';
import { TWO_FACTOR_GUIDE } from '@/constants/guides/settings';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';

import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: show.url(),
    },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    useRegisterGuide(TWO_FACTOR_GUIDE);

    return (
        <>
            <Head title="Two-Factor Authentication" />
            <div>
                    <HeadingSmall
                        id="two-factor-header"
                        guidance={TWO_FACTOR_GUIDE}
                    />
                    
                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-6">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                                <ShieldCheck className="h-4 w-4" />
                                2FA Protection Enabled
                            </div>
                            
                            <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
                                With two-factor authentication enabled, you will
                                be prompted for a secure, random pin during
                                login, which you can retrieve from the
                                TOTP-supported application on your phone.
                            </p>

                            <div className="w-full max-w-2xl bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </div>

                            <div className="relative inline-block pt-4">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            variant="outline"
                                            type="submit"
                                            disabled={processing}
                                            className="text-destructive hover:bg-destructive/5 border-destructive/20 font-bold"
                                        >
                                            <ShieldBan className="mr-2 h-4 w-4" /> Disable 2FA Protection
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-6">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                <ShieldBan className="h-4 w-4" />
                                2FA Protection Disabled
                            </div>
                            <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
                                When you enable two-factor authentication, you
                                will be prompted for a secure pin during login.
                                This pin can be retrieved from a TOTP-supported
                                application on your phone.
                            </p>

                            <div className="pt-4">
                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        className="min-w-[180px] font-bold"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Continue Setup
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="min-w-[180px] font-bold"
                                            >
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Enable 2FA Secure Access
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
            </div>
        </>
    );
}


