import type { Metadata } from "next";
import { ReactNode } from 'react';
export const metadata: Metadata = {
    title: "PsAI",
    description: "AI chat using typescript",
};
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}