import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

/**
 * Auth Layout wrapper
 * Uses the split layout for a more professional appearance
 */
export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: AuthLayoutProps) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
