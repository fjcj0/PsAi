import type { ReactNode } from "react";
import ChatLayoutClient from "./ChatLayoutClient";
export const metadata = {
    title: "Chat",
    description: "Chat page",
};
export default function ChatLayout({ children }: { children: ReactNode }) {
    return <ChatLayoutClient>{children}</ChatLayoutClient>;
}
