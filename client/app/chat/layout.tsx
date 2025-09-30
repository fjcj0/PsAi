import { ReactNode } from "react";
export const metadata = {
    title: "Chat",
    description: "Chat page",
};
export default function ChatLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            {children}
        </main>
    );
}