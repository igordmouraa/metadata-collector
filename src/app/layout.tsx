import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientAnalytics } from '@/components/client-analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Analytics Collector',
    description: 'Sistema de coleta de metadados de usuários',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        <ClientAnalytics />
        </body>
        </html>
    );
}