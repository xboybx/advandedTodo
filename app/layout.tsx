import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
    title: 'TaskFlow - Todo Application',
    description: 'A comprehensive todo application with dashboard analytics',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
