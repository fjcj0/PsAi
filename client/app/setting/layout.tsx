import type { Metadata } from "next";
import { ReactNode } from 'react';
export const metadata: Metadata = {
    title: "Setting",
    description: "User Settings",
};
export default function SettingLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
